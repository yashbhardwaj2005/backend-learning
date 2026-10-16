import assert from "node:assert/strict";
import { test } from "node:test";
import { createServerConnection } from "../src/api/serverConnection.js";

const healthy = (status = 401) => ({
  status,
  data: { statusCode: status, success: status === 200 },
});

function clock() {
  let time = 0;
  const pauses = [];
  return {
    now: () => time,
    wait: async (milliseconds) => { pauses.push(milliseconds); time += milliseconds; },
    advance: (milliseconds) => { time += milliseconds; },
    pauses,
  };
}

test("a cold service retries read-only probes and resets its waiting message", async () => {
  const timer = clock();
  const connect = createServerConnection(timer);
  const updates = [];
  const timeouts = [];
  let attempts = 0;
  await connect(async (timeout) => {
    timeouts.push(timeout);
    if (++attempts === 1) throw Object.assign(new Error("Gateway"), { response: { status: 503 } });
    return healthy();
  }, (value) => updates.push(value));
  assert.equal(attempts, 2);
  assert.deepEqual(timer.pauses, [3000]);
  assert.deepEqual(timeouts, [12000, 12000]);
  assert.deepEqual(updates, [true, false]);
});

test("an anonymous JSON 401 or signed-in JSON 200 establishes readiness", async () => {
  for (const status of [200, 401]) {
    const updates = [];
    await createServerConnection(clock())(async () => healthy(status), (value) => updates.push(value));
    assert.deepEqual(updates, [false]);
  }
});

test("HTML and malformed JSON cannot claim the server is ready", async () => {
  const timer = clock();
  const connect = createServerConnection(timer);
  const responses = [
    { status: 200, data: "<html>Service waking up</html>" },
    { status: 200, data: { statusCode: 200, success: false } },
    { status: 401, data: { statusCode: 200, success: false } },
    healthy(),
  ];
  let attempts = 0;
  await connect(async () => responses[attempts++]);
  assert.equal(attempts, 4);
  assert.equal(timer.now(), 9000);
});

test("permanent startup failure stops at two minutes without caching success", async () => {
  const timer = clock();
  const connect = createServerConnection(timer);
  const updates = [];
  const timeouts = [];
  await assert.rejects(connect(async (timeout) => {
    timeouts.push(timeout);
    timer.advance(timeout);
    throw Object.assign(new Error("Timed out"), { code: "ECONNABORTED" });
  }, (value) => updates.push(value)), { code: "SERVER_CONNECTION_TIMEOUT" });
  assert.equal(timer.now(), 120000);
  assert.ok(timeouts.every((timeout) => timeout > 0 && timeout <= 12000));
  assert.deepEqual(updates, [true, false]);
  let freshProbe = false;
  await connect(async () => { freshProbe = true; return healthy(); });
  assert.equal(freshProbe, true);
});

test("simultaneous callers share one connection and both receive waiting updates", async () => {
  const timer = clock();
  const connect = createServerConnection(timer);
  let releaseProbe;
  let attempts = 0;
  const updatesA = [];
  const updatesB = [];
  const first = connect(async () => {
    attempts++;
    if (attempts === 1) return new Promise((resolve) => { releaseProbe = resolve; });
    return healthy();
  }, (value) => updatesA.push(value));
  const second = connect(async () => { throw new Error("A second probe must not run"); }, (value) => updatesB.push(value));
  assert.equal(first, second);
  releaseProbe({ status: 503, data: "Starting" });
  await Promise.all([first, second]);
  assert.equal(attempts, 2);
  assert.deepEqual(updatesA, [true, false]);
  assert.deepEqual(updatesB, [true, false]);
});

test("a subscriber joining during a retry sees the current waiting state", async () => {
  let releaseWait;
  let time = 0;
  const connect = createServerConnection({
    now: () => time,
    wait: () => new Promise((resolve) => { releaseWait = () => { time += 3000; resolve(); }; }),
  });
  let attempts = 0;
  const first = connect(async () => ++attempts === 1 ? { status: 502 } : healthy());
  await Promise.resolve();
  const updates = [];
  const second = connect(async () => healthy(), (value) => updates.push(value));
  releaseWait();
  await Promise.all([first, second]);
  assert.deepEqual(updates, [true, false]);
});

test("real API 500 and configuration 404 propagate without retries", async () => {
  for (const status of [500, 404]) {
    const timer = clock();
    const failure = Object.assign(new Error("API failed"), {
      response: { status, data: { statusCode: status, success: false } },
    });
    const updates = [];
    await assert.rejects(createServerConnection(timer)(async () => { throw failure; }, (value) => updates.push(value)), (error) => error === failure);
    assert.deepEqual(timer.pauses, []);
    assert.deepEqual(updates, [false]);
  }
});

test("cancellation is fatal, clears waiting, and does not start more probes", async () => {
  const timer = clock();
  let attempts = 0;
  const updates = [];
  const cancellation = Object.assign(new Error("Cancelled"), { code: "ERR_CANCELED" });
  await assert.rejects(createServerConnection(timer)(async () => {
    if (++attempts === 1) throw Object.assign(new Error("Network"), { code: "ERR_NETWORK" });
    throw cancellation;
  }, (value) => updates.push(value)), (error) => error === cancellation);
  assert.equal(attempts, 2);
  assert.deepEqual(updates, [true, false]);
});

test("readiness is cached for fifteen seconds and then checked again", async () => {
  const timer = clock();
  const connect = createServerConnection(timer);
  let attempts = 0;
  const probe = async () => { attempts++; return healthy(); };
  await connect(probe);
  timer.advance(14999);
  await connect(probe);
  assert.equal(attempts, 1);
  timer.advance(1);
  await connect(probe);
  assert.equal(attempts, 2);
});

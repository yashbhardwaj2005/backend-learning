import assert from "node:assert/strict";
import { test } from "node:test";
import jwt from "jsonwebtoken";
import { User } from "../src/models/user.model.js";
import {
  refreshAccessToken,
  registerUser,
  loginUser,
  changeCurrentPassword,
} from "../src/controllers/user.controller.js";

// These tests exercise Mongoose hooks and controllers without a live database.
function useRefreshSecret(t, secret) {
  const previous = process.env.REFRESH_TOKEN_SECRET;
  process.env.REFRESH_TOKEN_SECRET = secret;
  t.after(() => {
    if (previous === undefined) delete process.env.REFRESH_TOKEN_SECRET;
    else process.env.REFRESH_TOKEN_SECRET = previous;
  });
}

function runController(controller, req) {
  return new Promise((resolve, reject) => {
    const result = { cookies: {}, status: 200 };
    const res = {
      status(code) {
        result.status = code;
        return this;
      },
      cookie(name, value) {
        result.cookies[name] = value;
        return this;
      },
      json(body) {
        resolve({ ...result, body });
        return this;
      },
    };
    controller(req, res, reject);
  });
}

test("saving tokens preserves the password; changing the password hashes it once", async (t) => {
  t.mock.method(User.collection, "insertOne", async (document) => ({
    insertedId: document._id,
  }));
  t.mock.method(User.collection, "updateOne", async () => ({
    matchedCount: 1,
    modifiedCount: 1,
  }));
  const user = new User({
    username: "regression",
    fullName: "Regression Test",
    email: "regression@example.com",
    avatar: "https://example.com/avatar.png",
    password: "OriginalPassword123!",
  });

  await user.save();
  const firstHash = user.password;
  assert.notEqual(firstHash, "OriginalPassword123!");
  assert.equal(await user.isPasswordCorrect("OriginalPassword123!"), true);

  for (let attempt = 0; attempt < 3; attempt++) {
    user.refreshToken = `session-${attempt}`;
    await user.save({ validateBeforeSave: false });
    assert.equal(user.password, firstHash);
    assert.equal(await user.isPasswordCorrect("OriginalPassword123!"), true);
  }

  user.password = "NewPassword456!";
  await user.save();
  assert.notEqual(user.password, firstHash);
  assert.equal(await user.isPasswordCorrect("NewPassword456!"), true);
  assert.equal(await user.isPasswordCorrect("OriginalPassword123!"), false);
});

test("refresh returns the actual new refresh token in its cookie and body", async (t) => {
  const secret = "isolated-regression-test-secret";
  useRefreshSecret(t, secret);
  const token = jwt.sign({ _id: "507f1f77bcf86cd799439011" }, secret);
  const user = {
    _id: "507f1f77bcf86cd799439011",
    refreshToken: token,
    generateAccessToken: () => "new-access-token",
    generateRefreshToken: () => "new-refresh-token",
    save: async () => {},
  };
  t.mock.method(User, "findById", async () => user);
  const result = await runController(refreshAccessToken, {
    cookies: { refreshToken: token },
  });
  assert.equal(result.status, 200);
  assert.equal(result.cookies.refreshToken, "new-refresh-token");
  assert.equal(result.body.data.refreshToken, "new-refresh-token");
  assert.equal(user.refreshToken, "new-refresh-token");
});

test("empty refresh requests reject with 401 instead of crashing", async () => {
  await assert.rejects(runController(refreshAccessToken, { cookies: {} }), {
    statusCode: 401,
  });
});

test("a revoked refresh token cannot renew a session", async (t) => {
  const secret = "isolated-revocation-test-secret";
  useRefreshSecret(t, secret);
  const token = jwt.sign({ _id: "507f1f77bcf86cd799439011" }, secret);
  t.mock.method(User, "findById", async () => ({
    refreshToken: "a-different-session",
  }));
  await assert.rejects(
    runController(refreshAccessToken, { cookies: { refreshToken: token } }),
    { statusCode: 401 }
  );
});

test("missing account fields fail validation before database work", async () => {
  await assert.rejects(runController(registerUser, { body: {} }), {
    statusCode: 400,
  });
  await assert.rejects(
    runController(loginUser, { body: { username: "test" } }),
    { statusCode: 400 }
  );
  await assert.rejects(runController(changeCurrentPassword, { body: {} }), {
    statusCode: 400,
  });
});

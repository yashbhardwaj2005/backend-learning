// Check a read-only endpoint before submitting an account form. A free hosting
// service may need time to wake; never retry registration or login themselves.
export function createServerConnection({
  now = Date.now,
  wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
} = {}) {
  let pending = null;
  let readyUntil = 0;
  let waiting = false;
  const listeners = new Set();

  function notify(value) {
    waiting = value;
    for (const listener of listeners) listener(value);
  }

  async function check(probe) {
    const deadline = now() + 120000;

    while (now() < deadline) {
      try {
        const response = await probe(Math.min(12000, deadline - now()));
        const { status, data } = response;
        // Render's loading page can return HTML with status 200. Only our API's
        // JSON envelope proves Express is ready; anonymous 401 is also healthy.
        if (
          (status === 200 || status === 401) &&
          data?.statusCode === status &&
          data?.success === (status === 200)
        ) {
          if (now() >= deadline) break;
          readyUntil = now() + 15000;
          return;
        }
        const error = new Error("The service has not returned a ready API response.");
        error.response = response;
        throw error;
      } catch (error) {
        const status = error.response?.status;
        const cancelled = error.code === "ERR_CANCELED" ||
          error.name === "CanceledError" || error.name === "AbortError";
        if (cancelled || (status && ![200, 401, 502, 503, 504].includes(status))) {
          throw error;
        }
        if (!waiting) notify(true);
      }

      const remaining = deadline - now();
      if (remaining > 0) await wait(Math.min(3000, remaining));
    }

    const error = new Error("The service is taking too long to start. Please try again.");
    error.code = "SERVER_CONNECTION_TIMEOUT";
    throw error;
  }

  return function connect(probe, onWaiting = () => {}) {
    if (now() < readyUntil) {
      onWaiting(false);
      return Promise.resolve();
    }
    listeners.add(onWaiting);
    if (waiting) onWaiting(true);
    if (!pending) {
      pending = check(probe).finally(() => {
        notify(false);
        listeners.clear();
        pending = null;
      });
    }
    return pending;
  };
}

export const connectToServer = createServerConnection();

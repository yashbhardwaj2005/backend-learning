import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true, // Express reads its HTTP-only cookies, not localStorage.
  // A free Render service can take about a minute to wake after being idle.
  timeout: import.meta.env.PROD ? 90000 : 20000,
});

// Share one refresh request when several requests expire at the same time.
let refreshRequest = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthRequest = /\/users\/(login|register|refresh-token)$/.test(
      request?.url || ""
    );

    if (
      error.response?.status !== 401 ||
      !request ||
      request._retried ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    request._retried = true;
    try {
      if (!refreshRequest) {
        refreshRequest = api.post("/users/refresh-token").finally(() => {
          refreshRequest = null;
        });
      }
      await refreshRequest;
      return api(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export function getApiError(error) {
  if (!error.response) {
    if (error.code === "ECONNABORTED")
      return "The server took too long to respond. Please wait a moment and try again.";
    return import.meta.env.PROD
      ? "We couldn’t reach the service. Please try again in a moment."
      : "We couldn’t reach the server. Check that your backend is running on port 8000, then try again.";
  }
  if (error.response.status >= 500)
    return "The server couldn’t complete this request. Please try again in a moment.";
  if (typeof error.response.data?.message === "string")
    return error.response.data.message;

  // Some hosting/proxy errors return HTML. Never display markup or a stack.
  if (typeof error.response.data === "string") {
    const document = new DOMParser().parseFromString(
      error.response.data.replace(/<br\s*\/?>/gi, "\n"),
      "text/html"
    );
    const message = document.querySelector("pre")?.textContent?.split("\n")[0];
    if (message) return message.replace(/^\w*Error:\s*/, "").slice(0, 240);
  }
  return "Something went wrong. Please check your details and try again.";
}

export const authApi = {
  current: () => api.get("/users/current-user"),
  login: (identifier, password) =>
    api.post("/users/login", {
      [identifier.includes("@") ? "email" : "username"]: identifier
        .trim()
        .toLowerCase(),
      password,
    }),
  register: (formData) => api.post("/users/register", formData),
  logout: () => api.post("/users/logout"),
  updateAccount: (details) => api.patch("/users/update-account", details),
  updateAvatar: (formData) => api.patch("/users/avatar", formData),
  updateCover: (formData) => api.patch("/users/cover-image", formData),
  changePassword: (passwords) => api.post("/users/change-password", passwords),
  channel: (username) => api.get(`/users/c/${encodeURIComponent(username)}`),
  history: () => api.get("/users/history"),
};

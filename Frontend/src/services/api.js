import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL !== undefined
      ? import.meta.env.VITE_API_URL
      : import.meta.env.PROD
      ? ""
      : "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  console.log("================================");
  console.log("REQUEST URL:", config.url);
  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("AUTH HEADER:", config.headers.Authorization);
  console.log("================================");

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthAttempt =
      url.includes("/api/auth/login") || url.includes("/api/auth/register");

    if (error.response && error.response.status === 401 && !isAuthAttempt) {
      console.warn("Session expired or unauthorized. Clearing token.");
      localStorage.removeItem("access_token");
      const path = window.location.pathname;
      if (path !== "/" && path !== "/register") {
        window.location.href = "/?expired=1";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
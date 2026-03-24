import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:8081";

function normalizeApiBaseUrl(rawBaseUrl?: string): string {
  if (!rawBaseUrl) {
    return DEFAULT_API_BASE_URL;
  }

  const trimmedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

  if (trimmedBaseUrl === "/api") {
    return "";
  }

  if (trimmedBaseUrl.endsWith("/api")) {
    return trimmedBaseUrl.slice(0, -4);
  }

  return trimmedBaseUrl;
}

export const httpClient = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 10000,
});

httpClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

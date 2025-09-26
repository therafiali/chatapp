import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
const queue: Array<(token: string) => void> = [];

function flushQueue(token: string) {
  queue.splice(0).forEach((cb) => cb(token));
}

async function doRefresh(): Promise<string> {
  const res = await axios.get(`${API_BASE_URL}/auth/refresh`, { withCredentials: true });
  const newToken = res.data?.accessToken;
  if (!newToken) throw new Error("No accessToken in refresh response");
  localStorage.setItem("accessToken", newToken);
  return newToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error || {};
    if (!response || response.status !== 401 || !config) {
      return Promise.reject(error);
    }
    if (config._retry) {
      return Promise.reject(error);
    }
    config._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = doRefresh()
        .then((token) => {
          flushQueue(token);
          return token;
        })
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
    }

    try {
      const token = await (refreshPromise as Promise<string>);
      return new Promise((resolve) => {
        queue.push((t: string) => {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${t}`;
          resolve(api(config));
        });
        // fast path if already resolved
        flushQueue(token);
      });
    } catch (e) {
      // refresh failed → clean up and bubble up
      localStorage.removeItem("accessToken");
      return Promise.reject(error);
    }
  }
);

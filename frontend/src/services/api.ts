import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

function clearSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) {
      return Promise.reject(new Error("Refresh token ausente."));
    }

    refreshPromise = api
      .post<{ access: string; refresh?: string }>("/auth/refresh/", {
        refresh,
      })
      .then(({ data }) => {
        localStorage.setItem("access_token", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh_token", data.refresh);
        }
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Loads all API pages for screens that filter or summarize locally. */
export async function getAllPages<T>(
  path: string,
): Promise<PaginatedResponse<T>> {
  const first = await api.get<PaginatedResponse<T>>(path, {
    params: { page_size: 100 },
  });
  const results = [...first.data.results];
  const base = api.defaults.baseURL ?? window.location.origin;
  const apiOrigin = new URL(base, window.location.origin).origin;
  let next = first.data.next;

  while (next) {
    const nextUrl = new URL(next, base);
    if (nextUrl.origin !== apiOrigin) {
      throw new Error("A API retornou uma página fora do endereço configurado.");
    }

    const page = await api.get<PaginatedResponse<T>>(nextUrl.toString());
    results.push(...page.data.results);
    next = page.data.next;
  }

  return {
    ...first.data,
    next: null,
    previous: null,
    results,
  };
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(
      "access_token",
    );

    if (token) {
      config.headers.set(
        "Authorization",
        `Bearer ${token}`,
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config as RetriableRequestConfig | undefined;
    const endpoint = config?.url ?? "";
    const isAuthenticationEndpoint =
      /^\/?auth\/(login|google|refresh|cadastro)\//.test(endpoint);

    if (
      error.response?.status !== 401 ||
      !config ||
      isAuthenticationEndpoint
    ) {
      return Promise.reject(error);
    }

    if (config._retry) {
      clearSession();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    config._retry = true;

    return refreshAccessToken()
      .then((access) => {
        config.headers.set("Authorization", `Bearer ${access}`);
        return api(config);
      })
      .catch((refreshError: unknown) => {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      });
  },
);

export default api;

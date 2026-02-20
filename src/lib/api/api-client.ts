import { useAuthStore } from "@/store/auth-store";
import { LoginResponseDto } from "./types";

/**
 * Core API Client Utility
 * Handles base URL, authorization headers, and error handling with automatic token refresh.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

/**
 * Access Token을 가져오는 보조 함수
 */
const getAccessToken = () => {
    return useAuthStore.getState().accessToken;
}

// Token Refresh 진행 상태 관리
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    const headers = new Headers(options.headers)
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }

    // Authorization 헤더 자동 주입
    const token = getAccessToken()
    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        })

        // 401 Unauthorized 처리 (Refresh Token 로직)
        // 로그인이나 재발급 요청 시에는 무한 루프 방지를 위해 제외
        if (response.status === 401 && !endpoint.includes("/api/login") && !endpoint.includes("/api/reissue")) {
            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                useAuthStore.getState().clearAuth();
                throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
            }

            // 이미 Refresh 중이면 대기 큐에 추가
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    headers.set("Authorization", `Bearer ${token}`);
                    return apiClient<T>(endpoint, { ...options, headers });
                }).catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshResponse = await fetch(`${API_BASE_URL}/api/reissue`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });

                if (!refreshResponse.ok) {
                    throw new Error("토큰 갱신에 실패했습니다.");
                }

                const data: LoginResponseDto = await refreshResponse.json();

                // 새로운 토큰 저장
                useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);

                // 대기 중인 요청들 처리
                processQueue(null, data.accessToken);

                // 현재 요청 재시도
                const newHeaders = new Headers(options.headers);
                newHeaders.set("Content-Type", "application/json");
                newHeaders.set("Authorization", `Bearer ${data.accessToken}`);

                return apiClient<T>(endpoint, { ...options, headers: newHeaders });
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                useAuthStore.getState().clearAuth();
                throw refreshError;
            } finally {
                isRefreshing = false;
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            const error = new Error(
                errorData.message || `API 요청 실패 (Status: ${response.status})`
            )
                ; (error as any).status = response.status
            throw error
        }

        if (response.status === 204) {
            return {} as T
        }

        return response.json()
    } catch (error) {
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),
    patch: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: "DELETE" }),
}

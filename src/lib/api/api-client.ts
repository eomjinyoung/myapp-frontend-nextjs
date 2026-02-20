/**
 * Core API Client Utility
 * Handles base URL, authorization headers, and error handling.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

/**
 * Access Token을 가져오는 보조 함수
 * 클라이언트 사이드(브라우저)에서 실행될 때 localStorage에서 토큰을 추출합니다.
 */
const getAccessToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("accessToken")
    }
    return null
}

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

    const response = await fetch(url, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(
            errorData.message || `API 요청 실패 (Status: ${response.status})`
        )
            // 에러 객체에 상태 코드 추가
            ; (error as any).status = response.status
        throw error
    }

    if (response.status === 204) {
        return {} as T
    }

    return response.json()
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

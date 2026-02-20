const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function apiClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
            errorData.message || `API request failed with status ${response.status}`
        )
    }

    // Handle empty responses
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
    put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: "DELETE" }),
}

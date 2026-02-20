import { api } from "./api-client";
import {
    PostCreateDto,
    PostListResponseDto,
    PostResponseDto,
    PostUpdateDto
} from "./types";

/**
 * Post API Services
 */
export const postApi = {
    /**
     * 게시글 목록 조회
     */
    list: (page = 1) =>
        api.get<PostListResponseDto>(`/api/posts?page=${page}`),

    /**
     * 게시글 등록
     */
    create: (data: PostCreateDto) =>
        api.post<void>("/api/posts", data),

    /**
     * 게시글 상세 조회
     */
    detail: (no: number | string) =>
        api.get<PostResponseDto>(`/api/posts/${no}`),

    /**
     * 게시글 수정
     */
    update: (no: number | string, data: PostUpdateDto) =>
        api.patch<void>(`/api/posts/${no}`, data),

    /**
     * 게시글 삭제
     */
    delete: (no: number | string) =>
        api.delete<void>(`/api/posts/${no}`),
};

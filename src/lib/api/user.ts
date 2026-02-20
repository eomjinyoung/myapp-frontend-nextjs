import { api } from "./api-client";
import {
    PasswordChangeDto,
    UserResponseDto
} from "./types";

/**
 * User/Member API Services
 */
export const userApi = {
    /**
     * 현재 사용자 정보 조회
     */
    me: () =>
        api.get<UserResponseDto>("/api/user/me"),

    /**
     * 비밀번호 변경
     */
    changePassword: (data: PasswordChangeDto) =>
        api.post<void>("/api/user/password", data),
};

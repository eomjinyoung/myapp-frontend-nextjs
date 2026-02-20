import { api } from "./api-client";
import {
    LoginRequestDto,
    LoginResponseDto,
    UserSignupDto,
    TokenReissueRequestDto
} from "./types";

/**
 * Authentication API Services
 */
export const authApi = {
    /**
     * 로그인
     */
    login: (data: LoginRequestDto) =>
        api.post<LoginResponseDto>("/api/login", data),

    /**
     * 회원가입
     */
    signup: (data: UserSignupDto) =>
        api.post<void>("/api/signup", data),

    /**
     * 로그아웃
     */
    logout: () =>
        api.post<void>("/api/logout", {}),

    /**
     * 토큰 재발급
     */
    reissue: (data: TokenReissueRequestDto) =>
        api.post<LoginResponseDto>("/api/reissue", data),
};

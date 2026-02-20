/**
 * API Response & Request Types (OpenAPI Based)
 */

export interface ErrorResponseDto {
    message: string;
    status: number;
}

export interface UserSignupDto {
    name: string;
    email: string;
    password?: string;
    passwordConfirm?: string;
    passwordMatching?: boolean;
}

export interface LoginRequestDto {
    email: string;
    password?: string;
}

export interface LoginResponseDto {
    accessToken: string;
    tokenType: string;
    userName: string;
    refreshToken: string;
}

export interface PasswordChangeDto {
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirm?: string;
    newPasswordMatching?: boolean;
}

export interface UserResponseDto {
    no: number;
    name: string;
    email: string;
}

export interface PostCreateDto {
    title: string;
    content?: string;
    tags?: string;
}

export interface PostUpdateDto {
    no?: number;
    title: string;
    content?: string;
    tags?: string;
}

export interface PostResponseDto {
    no: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    tags?: string;
    authorName: string;
    authorNo: number;
}

export interface PostListDto {
    no: number;
    title: string;
    createdAt: string;
    views: number;
    authorName: string;
}

export interface PostListResponseDto {
    posts: PostListDto[];
    currentPage: number;
    totalPages: number;
}

export interface TokenReissueRequestDto {
    refreshToken: string;
}

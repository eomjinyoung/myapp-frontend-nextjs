import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi } from '@/lib/api/post';
import { PostCreateDto, PostUpdateDto } from '@/lib/api/types';

export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (page: number) => [...postKeys.lists(), { page }] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...postKeys.details(), id] as const,
};

export function usePosts(page = 1) {
    return useQuery({
        queryKey: postKeys.list(page),
        queryFn: () => postApi.list(page),
    });
}

export function usePost(id: string | number) {
    return useQuery({
        queryKey: postKeys.detail(id),
        queryFn: () => postApi.detail(id),
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: PostCreateDto) => postApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string | number; data: PostUpdateDto }) =>
            postApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => postApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

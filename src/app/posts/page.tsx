'use client';

import Link from 'next/link';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Clock, User } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function PostsPage() {
    const { data, isLoading, isError, error } = usePosts();

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <h2 className="text-2xl font-bold text-destructive">오류가 발생했습니다</h2>
                <p className="text-muted-foreground mt-2">{error.message}</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    다시 시도
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">게시글 목록</h1>
                    <p className="text-muted-foreground mt-1">
                        VibeApp의 다양한 게시글을 확인해보세요.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/posts/new">
                        <Plus className="mr-2 h-4 w-4" /> 글쓰기
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px] text-center">No</TableHead>
                            <TableHead>제목</TableHead>
                            <TableHead className="w-[120px] text-center">작성자</TableHead>
                            <TableHead className="w-[100px] text-center">조회수</TableHead>
                            <TableHead className="w-[150px] text-center">작성일</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading Skeleton Rows
                            [...Array(10)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24 mx-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.posts && data.posts.length > 0 ? (
                            data.posts.map((post) => (
                                <TableRow key={post.no} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-center font-medium text-muted-foreground">
                                        {post.no}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/posts/${post.no}`}
                                            className="font-medium text-foreground hover:text-primary transition-colors block py-1"
                                        >
                                            {post.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 underline decoration-muted-foreground/30 underline-offset-4">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{post.authorName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{post.views}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-muted-foreground">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <p className="text-muted-foreground">등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!</p>
                                        <Button asChild variant="outline">
                                            <Link href="/posts/new">글쓰기</Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {!isLoading && data && data.totalPages > 1 && (
                <div className="flex justify-center pt-4">
                    {/* TODO: 페이징 UI 구현 */}
                </div>
            )}
        </div>
    );
}

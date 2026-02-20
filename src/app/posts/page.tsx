'use client';

import Link from 'next/link';
import { usePosts } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Eye, Clock, User } from 'lucide-react';

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

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-6 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5 mt-2" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-4 w-24" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data?.posts.map((post) => (
                        <Card key={post.no} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center text-xs text-muted-foreground mb-2">
                                    <User className="mr-1 h-3 w-3" /> {post.authorName}
                                </div>
                                <CardTitle className="line-clamp-2 text-xl leading-tight">
                                    <Link href={`/posts/${post.no}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardFooter className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="mr-1 h-3 w-3" />
                                        {post.views}
                                    </div>
                                </div>
                                <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                                    <Link href={`/posts/${post.no}`}>상세보기</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && data?.posts.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!</p>
                    <Button asChild className="mt-4" variant="outline">
                        <Link href="/posts/new">글쓰기</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

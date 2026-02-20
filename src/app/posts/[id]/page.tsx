'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, User, Eye, Tag } from 'lucide-react';
import Link from 'next/link';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { data: post, isLoading, isError, error } = usePost(id);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-2xl font-bold text-destructive">게시글을 불러올 수 없습니다</h2>
                <p className="text-muted-foreground mt-2">{error.message}</p>
                <Button className="mt-4" onClick={() => router.push('/posts')}>
                    목록으로 돌아가기
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <Skeleton className="h-10 w-32" />
                <Card>
                    <CardHeader className="space-y-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-10 w-full" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="mb-2">
                <Link href="/posts">
                    <ChevronLeft className="mr-2 h-4 w-4" /> 목록으로
                </Link>
            </Button>

            <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30 pb-8">
                    <div className="flex items-center gap-2 text-sm text-primary font-medium mb-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">게시글</Badge>
                        {post.tags && post.tags.split(',').map(tag => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" /> {tag.trim()}
                            </Badge>
                        ))}
                    </div>
                    <CardTitle className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                        {post.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-background rounded-full border">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground">{post.authorName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            조회수 {post.views}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-10 pb-12">
                    <div className="prose prose-slate max-w-none dark:prose-invert">
                        {post.content?.split('\n').map((line, i) => (
                            <p key={i} className="mb-4 leading-relaxed text-lg text-slate-700 dark:text-slate-300">
                                {line}
                            </p>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => router.push('/posts')}>목록</Button>
                <Button variant="secondary" asChild>
                    <Link href={`/posts/${id}/edit`}>수정</Link>
                </Button>
                {/* TODO: 삭제 권한 확인 로직 추가 */}
                <Button variant="destructive" disabled>삭제</Button>
            </div>
        </div>
    );
}

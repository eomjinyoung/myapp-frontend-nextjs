'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePost, useUpdatePost } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: post, isLoading: isFetching } = usePost(id);
    const mutation = useUpdatePost();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content || '',
                tags: post.tags || '',
            });
        }
    }, [post]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        mutation.mutate({ id, data: formData }, {
            onSuccess: () => {
                router.push(`/posts/${id}`);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">게시글을 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="mb-2">
                <Link href={`/posts/${id}`}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> 상세 페이지로
                </Link>
            </Button>

            <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-2xl">게시글 수정</CardTitle>
                    <CardDescription>
                        게시글의 내용을 수정합니다.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">제목</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags">태그</Label>
                            <Input
                                id="tags"
                                name="tags"
                                placeholder="쉼표(,)로 구분"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">내용</Label>
                            <Textarea
                                id="content"
                                name="content"
                                className="min-h-[300px]"
                                value={formData.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4 px-6">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            취소
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 저장 중...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" /> 수정 완료
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {mutation.isError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm text-center">
                    수정에 실패했습니다: {mutation.error.message}
                </div>
            )}
        </div>
    );
}

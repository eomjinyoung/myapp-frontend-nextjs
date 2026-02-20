'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatePost } from '@/hooks/use-posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ChevronLeft, PenLine, Send } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

export default function CreatePostPage() {
    const router = useRouter();
    const mutation = useCreatePost();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        mutation.mutate(formData, {
            onSuccess: () => {
                router.push('/posts');
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" asChild className="mb-2">
                <Link href="/posts">
                    <ChevronLeft className="mr-2 h-4 w-4" /> 목록으로
                </Link>
            </Button>

            <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <PenLine className="h-6 w-6 text-primary" /> 새 게시글 작성
                    </CardTitle>
                    <CardDescription>
                        당신의 멋진 생각이나 소식을 사람들과 공유해보세요.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-base font-semibold">제목</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="가슴 뛰는 제목을 입력하세요"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="text-lg py-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tags" className="text-base font-semibold">태그 (선택사항)</Label>
                            <Input
                                id="tags"
                                name="tags"
                                placeholder="쉼표(,)로 구분하여 입력 (예: 일상, 여행, 코딩)"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-base font-semibold">내용</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="내용을 정성스럽게 적어주세요..."
                                className="min-h-[300px] resize-none text-base leading-relaxed p-4"
                                value={formData.content}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 py-4 px-6">
                        <Button type="button" variant="outline" onClick={() => router.push('/posts')}>
                            취소
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} className="px-6">
                            {mutation.isPending ? '등록 중...' : (
                                <>
                                    <Send className="mr-2 h-4 w-4" /> 게시하기
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {mutation.isError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm text-center">
                    게시글 등록에 실패했습니다: {mutation.error.message}
                </div>
            )}
        </div>
    );
}

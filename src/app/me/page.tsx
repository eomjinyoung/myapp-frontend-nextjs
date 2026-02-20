'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi } from '@/lib/api/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock, Loader2, Save, ShieldCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyPage() {
    const { data: user, isLoading: isFetchingUser } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: () => userApi.me(),
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    });

    const mutation = useMutation({
        mutationFn: (data: any) => userApi.changePassword(data),
        onSuccess: () => {
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                newPasswordConfirm: '',
            });
        },
        onError: (err: any) => {
            alert(err.message || '비밀번호 변경에 실패했습니다.');
        }
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        mutation.mutate(passwordData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">내 정보 관리</h1>
                <p className="text-muted-foreground mt-1">계정 정보 확인 및 보안 설정을 관리합니다.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 프로필 정보 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> 기본 정보
                        </CardTitle>
                        <CardDescription>로그인된 계정의 정보입니다.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isFetchingUser ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">이름</Label>
                                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{user?.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">이메일</Label>
                                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md border">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">{user?.email}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* 비밀번호 변경 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" /> 비밀번호 변경
                        </CardTitle>
                        <CardDescription>보안을 위해 주기적으로 비밀번호를 변경해주세요.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePasswordChange}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        placeholder="현재 비밀번호"
                                        className="pl-10"
                                        value={passwordData.currentPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">새 비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        placeholder="최소 4자 이상"
                                        className="pl-10"
                                        value={passwordData.newPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPasswordConfirm">새 비밀번호 확인</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="newPasswordConfirm"
                                        name="newPasswordConfirm"
                                        type="password"
                                        placeholder="다시 한번 입력"
                                        className="pl-10"
                                        value={passwordData.newPasswordConfirm}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 border-t bg-muted/10 px-6 py-4 mt-4">
                            <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 변경 중...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> 비밀번호 저장
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const { isAuthenticated, clearAuth } = useAuthStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl sm:text-2xl tracking-tighter text-primary">
                            VibeApp
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/posts"
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            게시글
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => clearAuth()}>
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">로그인</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/signup">시작하기</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

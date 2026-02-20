'use client';

import { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium">인증 확인 중...</p>
            </div>
        );
    }

    return <>{children}</>;
}

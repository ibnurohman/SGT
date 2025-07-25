// app/components/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/auth-context';
import { Spin } from 'antd'; 
interface AuthGuardProps {
  children: React.ReactNode;
}

const publicPaths = ['/login', '/signup']; 

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    setCheckingAuth(true);

    const isPublicPath = publicPaths.includes(pathname);

    if (user === null && !isPublicPath) {
      router.push('/login');
    } else if (user !== null && isPublicPath) {
      router.push('/products'); 
    } else {
      setCheckingAuth(false); 
    }
  }, [user, pathname, router]); 
  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return <>{children}</>;
}
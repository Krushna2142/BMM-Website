'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface RBACGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RBACGuard({ children, allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] }: RBACGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const token = Cookies.get('bmm_admin_token');
      const userStr = Cookies.get('bmm_admin_user');

      if (!token || !userStr) {
        router.push('/admin/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const userRole = user.role || 'EDITOR';

        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          alert('You do not have permission to access this page.');
          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

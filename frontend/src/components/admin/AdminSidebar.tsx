// frontend/src/components/admin/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LayoutDashboard, FileText, Image, LogOut, Settings, Users } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pages', href: '/admin/pages', icon: FileText },
  { name: 'Media', href: '/admin/media', icon: Image },
  { name: 'Members', href: '/admin/members', icon: Users }, // ✅ Added Members
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = JSON.parse(Cookies.get('admin_user') || '{}');

  const handleLogout = () => {
    Cookies.remove('admin_token');
    Cookies.remove('admin_user');
    router.push('/admin/login');
  };

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">BMM CMS</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center mb-4">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user.name || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user.email || 'admin@bmm.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
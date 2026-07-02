// frontend/app/admin/(protected)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPages: 0,
    totalMedia: 0,
    totalAdmins: 1,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = Cookies.get('bmm_admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch pages count
      const pagesRes = await fetch(`${API_BASE_URL}/api/pages`, { headers });
      if (pagesRes.ok) {
        const pagesData = await pagesRes.json();
        setStats(prev => ({ ...prev, totalPages: pagesData.length }));
      }

      // Fetch media count
      const mediaRes = await fetch(`${API_BASE_URL}/api/media/stats`, { headers });
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        setStats(prev => ({ ...prev, totalMedia: mediaData.totalFiles || 0 }));
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/pages" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Total Pages</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalPages}</p>
          <p className="text-xs text-gray-400 mt-2">Click to manage →</p>
        </Link>
        
        <Link href="/admin/media" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Media Files</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalMedia}</p>
          <p className="text-xs text-gray-400 mt-2">Click to manage →</p>
        </Link>
        
        <Link href="/admin/users" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <h3 className="text-sm font-medium text-gray-500">Admin Users</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">{stats.totalAdmins}</p>
          <p className="text-xs text-gray-400 mt-2">Click to manage →</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/pages" className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-center">
            📄 Manage Pages
          </Link>
          <Link href="/admin/media" className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-center">
            🖼️ Upload Media
          </Link>
          <Link href="/admin/users" className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-center">
            👥 Manage Users
          </Link>
          <Link href="/admin/settings" className="px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition text-center">
            ⚙️ Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

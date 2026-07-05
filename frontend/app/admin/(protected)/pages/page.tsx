"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Edit2,
  Eye,
  Layers,
} from "lucide-react";
import api from "@/src/lib/api";

interface Section {
  id: string;
  type: string;
  title: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  sections?: Section[];
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await api.get("/pages");
      setPages(response.data);
    } catch (error) {
      console.error("Failed to load pages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      await api.delete(`/pages/${id}`);
      setPages(pages.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete page:", error);
      alert("Failed to delete page");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-sm text-gray-600 mt-0.5">Manage your website pages</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">/{page.slug}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full ${page.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                    {page.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {page.sections?.length || 0} sections
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/pages/${page.id}/sections`} className="flex items-center gap-1 text-blue-600 hover:text-blue-900 text-xs font-medium">
                      <Layers className="w-3.5 h-3.5" /> Manage Sections
                    </Link>
                    <Link href={`/admin/pages/${page.id}/edit`} className="flex items-center gap-1 text-green-600 hover:text-green-900 text-xs font-medium">
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </Link>
                    {page.isPublished && (
                      <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:text-purple-900 text-xs font-medium">
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">No pages yet</h3>
            <p className="text-sm text-gray-600 mb-3">Create your first page to get started</p>
            <Link href="/admin/pages/new" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors">
              <Plus className="w-4 h-4" /> Create Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
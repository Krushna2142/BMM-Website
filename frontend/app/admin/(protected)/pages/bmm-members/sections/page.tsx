"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Plus, ArrowLeft, GripVertical, Trash2, Eye, EyeOff, Save, X, AlertTriangle,
  FileText, Users, Settings, Building2, List
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Helper for authenticated requests
async function fetchWithAuth<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = Cookies.get("bmm_admin_token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body instanceof FormData) headers.delete("Content-Type");

  const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data as T;
}

interface Section {
  id: string;
  pageId: string;
  type: string;
  isVisible: boolean;
  props: any;
  order: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  sections?: Section[];
}

// ✅ SECTION TYPES CONFIGURATION
const SECTION_TYPES: Record<string, { label: string; icon: any; color: string; description: string }> = {
  members_list: {
    label: "Regular Members List",
    icon: Users,
    color: "bg-blue-500",
    description: "Displays the grid of 58 regular member mandals with 'Visit Website' buttons."
  },
  associate_members: {
    label: "Associate Members List",
    icon: Building2,
    color: "bg-purple-500",
    description: "Displays the grid of 60 members (58 regular + 2 associate) without website buttons."
  },
  hero: { label: "Hero Banner", icon: FileText, color: "bg-gray-500", description: "Standard hero section" },
  custom_section: { label: "Custom Section", icon: Settings, color: "bg-gray-500", description: "Custom layout" }
};

export default function BMMMembersSectionsPage() {
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => { loadPage(); }, []);

  const loadPage = async () => {
    try {
      // Fetch all pages and find the one with slug 'bmm-members'
      const pages = await fetchWithAuth<Page[]>("/api/pages");
      const bmmPage = pages.find(p => p.slug === 'bmm-members');
      
      if (bmmPage) {
        setPage(bmmPage);
        setSections(bmmPage.sections || []);
      }
    } catch (error) {
      console.error("Failed to load page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (type: string) => {
    if (!page) return;
    try {
      await fetchWithAuth(`/api/pages/${page.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, isVisible: true, props: {}, order: sections.length }),
      });
      setShowAddModal(false);
      await loadPage();
    } catch (error: any) {
      alert(`Failed to add section: ${error.message}`);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await fetchWithAuth(`/api/pages/sections/${sectionId}`, { method: "DELETE" });
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
      await loadPage();
    } catch (error: any) {
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const handleToggleVisibility = async (sectionId: string, currentVisibility: boolean) => {
    try {
      await fetchWithAuth(`/api/pages/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });
      await loadPage();
    } catch (error: any) {
      alert(`Failed to update visibility: ${error.message}`);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!page) return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold mb-4">BMM Members Page Not Found</h2>
      <p className="mb-4">Please go to the "Pages" list and ensure a page with slug "bmm-members" exists.</p>
      <button onClick={() => router.push("/admin/pages")} className="px-4 py-2 bg-orange-600 text-white rounded">Back to Pages</button>
    </div>
  );

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/admin/pages")} className="p-2 hover:bg-gray-100 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Manage Sections: {page.title}</h1>
          <p className="text-sm text-gray-500">Slug: /{page.slug}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="ml-auto flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Left Panel: Section List */}
        <div className="col-span-4 bg-white rounded-lg shadow border overflow-y-auto">
          <div className="p-4 border-b bg-gray-50 font-semibold">Sections ({sections.length})</div>
          <div className="p-2 space-y-2">
            {sections.map((section) => {
              const info = SECTION_TYPES[section.type] || { label: section.type, icon: FileText, color: "bg-gray-400" };
              const Icon = info.icon;
              return (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`p-3 rounded border cursor-pointer flex items-center gap-3 ${selectedSectionId === section.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`p-2 rounded ${info.color}`}><Icon className="w-4 h-4 text-white" /></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{info.label}</div>
                    <div className="text-xs text-gray-500">Order: {section.order}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section.id, section.isVisible); }} className="p-1 text-gray-500 hover:text-blue-600">
                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
            {sections.length === 0 && <p className="text-center text-gray-500 py-10">No sections yet.</p>}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="col-span-8 bg-white rounded-lg shadow border p-6 overflow-y-auto">
          {selectedSection ? (
            <div>
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">{SECTION_TYPES[selectedSection.type]?.label || selectedSection.type}</h2>
                <button onClick={() => handleDeleteSection(selectedSection.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
              
              {/* Specific Editor Content */}
              {selectedSection.type === 'members_list' || selectedSection.type === 'associate_members' ? (
                <div className="bg-blue-50 p-4 rounded border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2">Configuration</h3>
                  <p className="text-sm text-blue-800">
                    This section automatically fetches data from the <strong>Members</strong> database table. 
                    No manual content entry is needed here. 
                    <br/><br/>
                    To add/edit members, go to the <strong>Members</strong> tab in the sidebar (if available) or manage them via the database directly.
                  </p>
                </div>
              ) : (
                <div className="text-gray-500">No specific editor for this type.</div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a section from the left to edit it.
            </div>
          )}
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">Add Section</h3>
            <div className="space-y-3">
              {Object.entries(SECTION_TYPES).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => handleAddSection(key)}
                  className="w-full text-left p-3 border rounded hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`p-2 rounded ${info.color}`}><info.icon className="w-4 h-4 text-white" /></div>
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div className="text-xs text-gray-500">{info.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddModal(false)} className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
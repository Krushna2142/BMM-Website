"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Save, X, Upload, Eye, ImageIcon, Folder, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import api from "@/src/lib/api";
import Image from "next/image";

interface Member {
  id: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string | null;
}

type SortField = "name" | "createdAt" | "updatedAt" | "city";
type SortDirection = "asc" | "desc";

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"all" | "member" | "associate">("all");
  const [saving, setSaving] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Folder states for Media Selector
  const [folders, setFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/members");
      setMembers(response.data);
    } catch (error: any) {
      console.error("Failed to fetch members:", error);
      alert(`Failed to load members: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await api.get("/media/folders");
      setFolders(response.data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const fetchMedia = async (folder?: string | null) => {
    setMediaLoading(true);
    try {
      const url = folder ? `/media?folder=${encodeURIComponent(folder)}` : '/media';
      const response = await api.get(url);
      setMediaItems(response.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({ ...member });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editingMember) return;
    setSaving(true);
    try {
      await api.put(`/members/${editingMember.id}`, formData);
      await fetchMembers();
      setShowForm(false);
      setEditingMember(null);
      setFormData({});
    } catch (error: any) {
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "member-logos");

    try {
      const response = await api.post("/media/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, logo: response.data.url });
      await fetchMedia(currentFolder);
      await fetchFolders();
    } catch (error: any) {
      alert(`Failed to upload logo: ${error.message}`);
    } finally {
      e.target.value = "";
    }
  };

  const openMediaSelector = () => {
    setShowMediaSelector(true);
    fetchFolders();
    fetchMedia(null);
    setCurrentFolder(null);
  };

  const handleFolderSelect = (folder: string | null) => {
    setCurrentFolder(folder);
    fetchMedia(folder);
  };

  // Toggle sort direction or change sort field
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Change field and reset to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sort icon based on current sort state
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-orange-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-orange-600" />
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter and sort members
  const getFilteredAndSortedMembers = () => {
    let filtered = members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || member.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "city") {
        comparison = a.city.localeCompare(b.city);
      } else if (sortField === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "updatedAt") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredMembers = getFilteredAndSortedMembers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all {members.length} member organizations - Add logos, websites, and details
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Members ({members.length})</option>
            <option value="member">Regular ({members.filter((m) => m.category === "member").length})</option>
            <option value="associate">
              Associate ({members.filter((m) => m.category === "associate").length})
            </option>
          </select>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => toggleSort("name")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortField === "name"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Name {getSortIcon("name")}
          </button>
          <button
            onClick={() => toggleSort("city")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortField === "city"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            City {getSortIcon("city")}
          </button>
          <button
            onClick={() => toggleSort("createdAt")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortField === "createdAt"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Created {getSortIcon("createdAt")}
          </button>
          <button
            onClick={() => toggleSort("updatedAt")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              sortField === "updatedAt"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Updated {getSortIcon("updatedAt")}
          </button>
          <span className="text-xs text-gray-500 ml-2">
            ({sortDirection === "asc" ? "Ascending" : "Descending"})
          </span>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {member.logo ? (
                      <div className="w-12 h-12 relative">
                        <Image
                          src={member.logo}
                          alt={member.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {member.city}
                    {member.state && `, ${member.state}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.category === "member"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {member.category === "member" ? "Regular" : "Associate"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.website ? (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {formatDate(member.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No members found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showForm && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Edit Member</h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <div className="relative w-24 h-24 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={formData.logo}
                        alt="Logo preview"
                        fill
                        className="object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo: null })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload New Logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={openMediaSelector}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Choose from Library
                    </button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (Show on website)
                </label>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingMember(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Selector Modal WITH FOLDERS */}
      {showMediaSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[85vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Folder className="w-5 h-5 text-orange-500" />
                Select Logo from Library
              </h3>
              <button
                onClick={() => setShowMediaSelector(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Folder Sidebar */}
              <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50">
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Folders</h4>
                <nav className="space-y-1">
                  <button
                    onClick={() => handleFolderSelect(null)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentFolder === null
                        ? 'bg-orange-50 text-orange-700 font-medium border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                    All Files
                  </button>
                  
                  {folders.map((folder) => (
                    <button
                      key={folder}
                      onClick={() => handleFolderSelect(folder)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        currentFolder === folder
                          ? 'bg-orange-50 text-orange-700 font-medium border border-orange-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Folder className="w-4 h-4" />
                      {folder}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Media Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {mediaLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No files found</p>
                    <p className="text-sm mt-2">
                      {currentFolder 
                        ? `This folder is empty. Upload some files!`
                        : `Upload files to see them here`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {mediaItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setFormData({ ...formData, logo: item.url });
                          setShowMediaSelector(false);
                        }}
                        className="relative aspect-square rounded-lg border-2 border-gray-200 hover:border-orange-500 overflow-hidden transition-all group"
                      >
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Select</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                          {item.originalName}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
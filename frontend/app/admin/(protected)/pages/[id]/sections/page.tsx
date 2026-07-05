"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  Plus, ArrowLeft, GripVertical, Edit2, Trash2, Eye, EyeOff, Save, X, AlertTriangle,
  Image as ImageIcon, Type, Layout, FileText, Users, Calendar, MapPin, Settings,
  Megaphone, Award, Grid3X3, List, Building2,
} from "lucide-react";
import { MediaSelector } from "@/src/components/ui/MediaSelector";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchWithAuth<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = Cookies.get("bmm_admin_token");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body instanceof FormData) headers.delete("Content-Type");

  const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  const text = await res.text();

  let data: any = null;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    const errorMsg = typeof data === 'object' && data !== null
      ? (data.message || data.error || JSON.stringify(data))
      : (data || `HTTP ${res.status}`);
    throw new Error(errorMsg);
  }

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

// ✅ UPDATED: Human-readable labels for ALL section types
const SECTION_TYPES: Record<string, { label: string; icon: any; color: string; description: string }> = {
  // Homepage sections
  hero: { label: "Hero Banner", icon: Layout, color: "bg-blue-500", description: "Main banner with background image and subtitles" },
  action_buttons: { label: "Quick Action Buttons", icon: Megaphone, color: "bg-indigo-500", description: "Buttons like 'Learn More', 'Get Involved'" },
  sponsors: { label: "Sponsors & Partners", icon: Users, color: "bg-yellow-500", description: "Sponsor logos and links" },
  image_slider: { label: "Image Slider / Gallery", icon: ImageIcon, color: "bg-pink-500", description: "Auto-sliding image carousel" },
  committee: { label: "Main Committee", icon: Users, color: "bg-purple-500", description: "President, Secretary, Treasurer" },
  executive_members: { label: "Executive Members", icon: Users, color: "bg-green-500", description: "Executive committee members" },
  trustees: { label: "Board of Trustees", icon: Users, color: "bg-orange-500", description: "Trustees of the organization" },

  // Initiative sections
  top_action_buttons: { label: "Top Action Buttons", icon: Megaphone, color: "bg-blue-600", description: "Buttons at top like 'BMM 2026 Seattle', 'Donation'" },
  initiative_grid: { label: "Initiative Grid", icon: Grid3X3, color: "bg-teal-500", description: "Grid of initiative cards" },
  initiatives_list: { label: "Initiatives List", icon: List, color: "bg-cyan-500", description: "List of all 28 initiatives" },
  bottom_action_buttons: { label: "Bottom Action Buttons", icon: Megaphone, color: "bg-blue-700", description: "Buttons at bottom like 'Donation', 'Payment'" },
  volunteer_award: { label: "Volunteer Award Section", icon: Award, color: "bg-amber-500", description: "US President's Volunteer Service Award" },

  // Members sections
  members_list: {
    label: "Members List",
    icon: Users,
    color: "bg-blue-500",
    description: "Display all regular member mandals with logos and website links"
  },
  associate_members: {
    label: "Associate Members",
    icon: Building2,
    color: "bg-purple-500",
    description: "Display associate member organizations (without website buttons)"
  },

  // Custom section
  custom_section: {
    label: "✨ Custom Section (Create Your Own)",
    icon: Settings,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Create a custom section with your own fields and layout"
  },
};

type SectionType = keyof typeof SECTION_TYPES;

// ==========================================
// REUSABLE UI COMPONENTS
// ==========================================

function TextInput({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
    </div>
  );
}

function TextAreaInput({ label, value, onChange, placeholder, rows = 3 }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
    </div>
  );
}

function ImageUploadField({ label, value, onChange }: { label: string, value?: string, onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "section");
    
    try {
      const data = await fetchWithAuth<any>("/api/media/upload", { method: "POST", body: formData });
      const imageUrl = data?.url || data?.filePath || data?.secure_url || data?.data?.url || data?.path;
      if (imageUrl) {
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        onChange(fullUrl);
      } else {
        alert("Image uploaded, but could not find the URL in the response.");
      }
    } catch (err: any) {
      alert(`Failed to upload image: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = ""; 
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      {value && (
        <div className="relative w-full h-32 rounded overflow-hidden border border-gray-200 bg-gray-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={uploading} 
          className="flex-1 text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 disabled:opacity-50 cursor-pointer" 
        />
        <button
          type="button"
          onClick={() => setShowMediaSelector(true)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
        >
          <ImageIcon className="w-4 h-4" />
          Library
        </button>
      </div>
      {uploading && <p className="text-xs text-blue-600 animate-pulse">Uploading image...</p>}
      
      <MediaSelector
        isOpen={showMediaSelector}
        onClose={() => setShowMediaSelector(false)}
        onSelect={(url) => onChange(url)}
        selectedUrl={value}
      />
    </div>
  );
}

// ==========================================
// MODALS
// ==========================================

function AddSectionModal({ onAdd, onClose }: { onAdd: (type: string) => void; onClose: () => void }) {
  const [type, setType] = useState<SectionType>("hero");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add New Section</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Section Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as SectionType)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500">
              {Object.entries(SECTION_TYPES).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{SECTION_TYPES[type].description}</p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
          <button onClick={() => onAdd(type)} className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">Add Section</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ section, onConfirm, onClose }: { section: Section | null; onConfirm: () => void; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <h2 className="text-lg font-bold text-gray-900">Delete Section</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">This will permanently delete this section.</p>
          <p className="text-xs text-gray-500 mb-1.5">Type <strong>DELETE</strong> to confirm:</p>
          <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 mb-3" placeholder="DELETE" />
          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">Cancel</button>
            <button onClick={onConfirm} disabled={confirmText !== "DELETE"} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN EDITOR
// ==========================================

function SectionEditor({ section, onSave, onDelete }: { section: Section; onSave: (data: any) => void; onDelete: (id: string) => void }) {
  const [formData, setFormData] = useState({
    type: section.type,
    isVisible: section.isVisible ?? true,
    props: section.props || {},
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateProps = (newProps: any) => {
    setFormData(prev => ({ ...prev, props: { ...prev.props, ...newProps } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const sectionInfo = SECTION_TYPES[formData.type] || { label: formData.type, icon: FileText, color: "bg-gray-500", description: "" };
  const SectionIcon = sectionInfo.icon;

  const renderSpecificFields = () => {
    // For members_list and associate_members, no specific props are needed as they fetch from DB
    if (formData.type === 'members_list' || formData.type === 'associate_members') {
      return (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            {formData.type === 'members_list' ? 'Regular Members Section' : 'Associate Members Section'}
          </h4>
          <p className="text-xs text-blue-700">
            This section automatically fetches members from the database based on their category. 
            No additional configuration is needed here. Manage members in the "Members" admin panel.
          </p>
        </div>
      );
    }

    switch (formData.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <ImageUploadField label="Background Image" value={formData.props.backgroundImage} onChange={(url) => updateProps({ backgroundImage: url })} />
            <TextInput label="Title" value={formData.props.title} onChange={(val) => updateProps({ title: val })} placeholder="Welcome to BMM..." />
            <TextInput label="Subtitle (Marathi)" value={formData.props.subtitleMarathi} onChange={(val) => updateProps({ subtitleMarathi: val })} placeholder="|| मराठी तितुका मेळवावा ||" />
            <TextInput label="Subtitle (English)" value={formData.props.subtitleEnglish} onChange={(val) => updateProps({ subtitleEnglish: val })} placeholder="Uniting the Marathi speaking community" />
          </div>
        );

      case 'action_buttons':
      case 'top_action_buttons':
      case 'bottom_action_buttons':
        const buttonKey = 'buttons';
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Buttons</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props[buttonKey] || [];
                updateProps({ [buttonKey]: [...currentList, { label: '', url: '', variant: 'primary' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Button
              </button>
            </div>
            {(formData.props[buttonKey] || []).map((btn: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props[buttonKey] || [])];
                  currentList.splice(idx, 1);
                  updateProps({ [buttonKey]: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <TextInput label="Button Label" value={btn.label} onChange={(val) => {
                  const currentList = [...(formData.props[buttonKey] || [])];
                  currentList[idx] = { ...currentList[idx], label: val };
                  updateProps({ [buttonKey]: currentList });
                }} />
                <TextInput label="URL / Link" value={btn.url} onChange={(val) => {
                  const currentList = [...(formData.props[buttonKey] || [])];
                  currentList[idx] = { ...currentList[idx], url: val };
                  updateProps({ [buttonKey]: currentList });
                }} placeholder="/donate" />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Style</label>
                  <select value={btn.variant || 'primary'} onChange={(e) => {
                    const currentList = [...(formData.props[buttonKey] || [])];
                    currentList[idx] = { ...currentList[idx], variant: e.target.value };
                    updateProps({ [buttonKey]: currentList });
                  }} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500">
                    <option value="primary">Orange (Primary)</option>
                    <option value="secondary">Blue (Secondary)</option>
                  </select>
                </div>
              </div>
            ))}
            {(formData.props[buttonKey] || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No buttons added yet.</p>}
          </div>
        );

      case 'sponsors':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Sponsors</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props.sponsors || [];
                updateProps({ sponsors: [...currentList, { name: '', logo: '', url: '' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Sponsor
              </button>
            </div>
            {(formData.props.sponsors || []).map((sp: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props.sponsors || [])];
                  currentList.splice(idx, 1);
                  updateProps({ sponsors: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <TextInput label="Sponsor Name" value={sp.name} onChange={(val) => {
                  const currentList = [...(formData.props.sponsors || [])];
                  currentList[idx] = { ...currentList[idx], name: val };
                  updateProps({ sponsors: currentList });
                }} />
                <TextInput label="Website URL" value={sp.url} onChange={(val) => {
                  const currentList = [...(formData.props.sponsors || [])];
                  currentList[idx] = { ...currentList[idx], url: val };
                  updateProps({ sponsors: currentList });
                }} placeholder="https://..." />
                <ImageUploadField label="Logo" value={sp.logo} onChange={(val) => {
                  const currentList = [...(formData.props.sponsors || [])];
                  currentList[idx] = { ...currentList[idx], logo: val };
                  updateProps({ sponsors: currentList });
                }} />
              </div>
            ))}
            {(formData.props.sponsors || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No sponsors added yet.</p>}
          </div>
        );

      case 'image_slider':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Slides</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props.slides || [];
                updateProps({ slides: [...currentList, { image: '', title: '', description: '' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Slide
              </button>
            </div>
            {(formData.props.slides || []).map((sl: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props.slides || [])];
                  currentList.splice(idx, 1);
                  updateProps({ slides: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <ImageUploadField label="Slide Image" value={sl.image} onChange={(val) => {
                  const currentList = [...(formData.props.slides || [])];
                  currentList[idx] = { ...currentList[idx], image: val };
                  updateProps({ slides: currentList });
                }} />
                <TextInput label="Title" value={sl.title} onChange={(val) => {
                  const currentList = [...(formData.props.slides || [])];
                  currentList[idx] = { ...currentList[idx], title: val };
                  updateProps({ slides: currentList });
                }} />
                <TextAreaInput label="Description" value={sl.description} onChange={(val) => {
                  const currentList = [...(formData.props.slides || [])];
                  currentList[idx] = { ...currentList[idx], description: val };
                  updateProps({ slides: currentList });
                }} />
              </div>
            ))}
            {(formData.props.slides || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No slides added yet.</p>}
          </div>
        );

      case 'committee':
      case 'executive_members':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Members</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props.members || [];
                updateProps({ members: [...currentList, { name: '', nameMarathi: '', role: '', image: '', bio: '' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Member
              </button>
            </div>
            {(formData.props.members || []).map((m: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props.members || [])];
                  currentList.splice(idx, 1);
                  updateProps({ members: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <TextInput label="Name (English)" value={m.name} onChange={(val) => {
                  const currentList = [...(formData.props.members || [])];
                  currentList[idx] = { ...currentList[idx], name: val };
                  updateProps({ members: currentList });
                }} />
                <TextInput label="Name (Marathi)" value={m.nameMarathi} onChange={(val) => {
                  const currentList = [...(formData.props.members || [])];
                  currentList[idx] = { ...currentList[idx], nameMarathi: val };
                  updateProps({ members: currentList });
                }} />
                <TextInput label="Designation / Role" value={m.role} onChange={(val) => {
                  const currentList = [...(formData.props.members || [])];
                  currentList[idx] = { ...currentList[idx], role: val };
                  updateProps({ members: currentList });
                }} />
                <ImageUploadField label="Photo" value={m.image} onChange={(val) => {
                  const currentList = [...(formData.props.members || [])];
                  currentList[idx] = { ...currentList[idx], image: val };
                  updateProps({ members: currentList });
                }} />
                <TextAreaInput label="Bio / Description" value={m.bio} onChange={(val) => {
                  const currentList = [...(formData.props.members || [])];
                  currentList[idx] = { ...currentList[idx], bio: val };
                  updateProps({ members: currentList });
                }} />
              </div>
            ))}
            {(formData.props.members || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No members added yet.</p>}
          </div>
        );

      case 'trustees':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Trustees</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props.trustees || [];
                updateProps({ trustees: [...currentList, { name: '', nameMarathi: '', role: '', image: '', bio: '' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Trustee
              </button>
            </div>
            {(formData.props.trustees || []).map((m: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList.splice(idx, 1);
                  updateProps({ trustees: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <TextInput label="Name (English)" value={m.name} onChange={(val) => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList[idx] = { ...currentList[idx], name: val };
                  updateProps({ trustees: currentList });
                }} />
                <TextInput label="Name (Marathi)" value={m.nameMarathi} onChange={(val) => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList[idx] = { ...currentList[idx], nameMarathi: val };
                  updateProps({ trustees: currentList });
                }} />
                <TextInput label="Designation / Role" value={m.role} onChange={(val) => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList[idx] = { ...currentList[idx], role: val };
                  updateProps({ trustees: currentList });
                }} />
                <ImageUploadField label="Photo" value={m.image} onChange={(val) => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList[idx] = { ...currentList[idx], image: val };
                  updateProps({ trustees: currentList });
                }} />
                <TextAreaInput label="Bio / Description" value={m.bio} onChange={(val) => {
                  const currentList = [...(formData.props.trustees || [])];
                  currentList[idx] = { ...currentList[idx], bio: val };
                  updateProps({ trustees: currentList });
                }} />
              </div>
            ))}
            {(formData.props.trustees || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No trustees added yet.</p>}
          </div>
        );

      case 'initiatives_list':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Initiatives</h3>
              <button type="button" onClick={() => {
                const currentList = formData.props.initiatives || [];
                updateProps({ initiatives: [...currentList, { nameMr: '', nameEn: '', subtitle: '', href: '' }] });
              }} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Initiative
              </button>
            </div>
            {(formData.props.initiatives || []).map((init: any, idx: number) => (
              <div key={idx} className="p-3 border border-gray-200 rounded-lg space-y-3 relative bg-gray-50">
                <button type="button" onClick={() => {
                  const currentList = [...(formData.props.initiatives || [])];
                  currentList.splice(idx, 1);
                  updateProps({ initiatives: currentList });
                }} className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <TextInput label="Name (Marathi)" value={init.nameMr} onChange={(val) => {
                  const currentList = [...(formData.props.initiatives || [])];
                  currentList[idx] = { ...currentList[idx], nameMr: val };
                  updateProps({ initiatives: currentList });
                }} />
                <TextInput label="Name (English)" value={init.nameEn} onChange={(val) => {
                  const currentList = [...(formData.props.initiatives || [])];
                  currentList[idx] = { ...currentList[idx], nameEn: val };
                  updateProps({ initiatives: currentList });
                }} />
                <TextInput label="Subtitle / Schedule" value={init.subtitle} onChange={(val) => {
                  const currentList = [...(formData.props.initiatives || [])];
                  currentList[idx] = { ...currentList[idx], subtitle: val };
                  updateProps({ initiatives: currentList });
                }} placeholder="Free session every Saturday..." />
                <TextInput label="Page URL" value={init.href} onChange={(val) => {
                  const currentList = [...(formData.props.initiatives || [])];
                  currentList[idx] = { ...currentList[idx], href: val };
                  updateProps({ initiatives: currentList });
                }} placeholder="/initiatives/marathi-school" />
              </div>
            ))}
            {(formData.props.initiatives || []).length === 0 && <p className="text-xs text-gray-500 text-center py-4">No initiatives added yet.</p>}
          </div>
        );

      case 'volunteer_award':
        return (
          <div className="space-y-4">
            <TextInput label="Title" value={formData.props.title} onChange={(val) => updateProps({ title: val })} placeholder="How to apply for the US President's Volunteer Service Award" />
            <TextInput label="Button Label" value={formData.props.buttonLabel} onChange={(val) => updateProps({ buttonLabel: val })} placeholder="Click Here" />
            <TextInput label="Button URL" value={formData.props.href} onChange={(val) => updateProps({ href: val })} placeholder="/volunteer-award" />
          </div>
        );
      
      case 'custom_section':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Custom Section Builder
              </h4>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Section Name (for your reference)</label>
                <input type="text" value={formData.props.sectionName || ''} onChange={(e) => updateProps({ sectionName: e.target.value })} placeholder="e.g., Testimonials, FAQ..." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Layout Style</label>
                <select value={formData.props.layout || 'grid'} onChange={(e) => updateProps({ layout: e.target.value })} className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500">
                  <option value="grid">Grid (2-3 columns)</option>
                  <option value="list">List (vertical)</option>
                  <option value="cards">Cards with borders</option>
                  <option value="full-width">Full width paragraphs</option>
                </select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-gray-700">Custom Fields</label>
                  <button type="button" onClick={() => {
                    const fields = formData.props.customFields || [];
                    const newField = { id: Date.now(), name: `field_${fields.length + 1}`, label: '', type: 'text', value: '', required: false, showLabel: true };
                    updateProps({ customFields: [...fields, newField] });
                  }} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </div>
                {(formData.props.customFields || []).map((field: any, index: number) => (
                  <div key={field.id} className="p-3 bg-white rounded border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Field #{index + 1}</span>
                      <button type="button" onClick={() => {
                        const fields = formData.props.customFields.filter((f: any) => f.id !== field.id);
                        updateProps({ customFields: fields });
                      }} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Field Name (key)</label>
                        <input type="text" value={field.name} onChange={(e) => {
                          const fields = [...formData.props.customFields];
                          fields[index].name = e.target.value;
                          updateProps({ customFields: fields });
                        }} placeholder="title, description, etc." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Label (Display Name)</label>
                        <input type="text" value={field.label} onChange={(e) => {
                          const fields = [...formData.props.customFields];
                          fields[index].label = e.target.value;
                          updateProps({ customFields: fields });
                        }} placeholder="Section Title" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Field Type</label>
                        <select value={field.type} onChange={(e) => {
                          const fields = [...formData.props.customFields];
                          fields[index].type = e.target.value;
                          updateProps({ customFields: fields });
                        }} className="w-full px-2 py-1 text-xs border border-gray-300 rounded">
                          <option value="text">Text Input</option>
                          <option value="textarea">Text Area</option>
                          <option value="richtext">Rich Text (HTML)</option>
                          <option value="number">Number</option>
                          <option value="url">URL/Link</option>
                          <option value="email">Email</option>
                          <option value="image">Image Upload</option>
                          <option value="color">Color Picker</option>
                          <option value="toggle">Toggle (Yes/No)</option>
                          <option value="select">Select Dropdown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Value</label>
                        {field.type === 'toggle' ? (
                          <select value={field.value || 'false'} onChange={(e) => {
                            const fields = [...formData.props.customFields];
                            fields[index].value = e.target.value;
                            updateProps({ customFields: fields });
                          }} className="w-full px-2 py-1 text-xs border border-gray-300 rounded">
                            <option value="false">No / False</option>
                            <option value="true">Yes / True</option>
                          </select>
                        ) : (
                          <input type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'} value={field.value} onChange={(e) => {
                            const fields = [...formData.props.customFields];
                            fields[index].value = e.target.value;
                            updateProps({ customFields: fields });
                          }} placeholder="Field value..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                        )}
                      </div>
                    </div>
                    {field.type === 'textarea' && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Paragraph Content</label>
                        <textarea value={field.value} onChange={(e) => {
                          const fields = [...formData.props.customFields];
                          fields[index].value = e.target.value;
                          updateProps({ customFields: fields });
                        }} rows={5} placeholder="Enter your paragraph text here..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500" />
                      </div>
                    )}
                    {field.type === 'richtext' && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">HTML Content</label>
                        <textarea value={field.value} onChange={(e) => {
                          const fields = [...formData.props.customFields];
                          fields[index].value = e.target.value;
                          updateProps({ customFields: fields });
                        }} rows={6} placeholder="<p>Your HTML content here...</p>" className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded focus:ring-2 focus:ring-purple-500" />
                      </div>
                    )}
                    {field.type === 'image' && (
                      <div>
                        <ImageUploadField label="Upload Image" value={field.value} onChange={(url) => {
                          const fields = [...formData.props.customFields];
                          fields[index].value = url;
                          updateProps({ customFields: fields });
                        }} />
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <input type="checkbox" id={`showLabel-${field.id}`} checked={field.showLabel !== false} onChange={(e) => {
                        const fields = [...formData.props.customFields];
                        fields[index].showLabel = e.target.checked;
                        updateProps({ customFields: fields });
                      }} className="w-3.5 h-3.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                      <label htmlFor={`showLabel-${field.id}`} className="text-xs text-gray-600">Show label above field</label>
                    </div>
                  </div>
                ))}
                {(formData.props.customFields || []).length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-4">No custom fields yet. Click "Add Field" to create your first field.</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No specific editor for this section type.</p>
            <TextAreaInput label="Raw JSON Properties" value={JSON.stringify(formData.props, null, 2)} onChange={(val) => {
              try { updateProps(JSON.parse(val)); } catch { }
            }} rows={10} />
          </div>
        );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded ${sectionInfo.color}`}>
              <SectionIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{sectionInfo.label}</h2>
              <p className="text-xs text-gray-500">{sectionInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 text-sm hover:bg-red-50 rounded transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button type="submit" disabled={isSaving} className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input type="checkbox" id="isVisible" checked={formData.isVisible} onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })} className="w-3.5 h-3.5 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
            <label htmlFor="isVisible" className="text-sm text-gray-700">Visible on website</label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            {renderSpecificFields()}
          </div>
        </div>
      </form>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          section={section}
          onConfirm={() => { onDelete(section.id); setShowDeleteConfirm(false); }}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

// ==========================================
// PAGE CONTENT WITH DRAG & DROP
// ==========================================

function SectionsPageContent() {
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  useEffect(() => { loadPage(); }, [pageId]);

  const loadPage = async () => {
    try {
      const data = await fetchWithAuth<Page>(`/api/pages/${pageId}`);
      setPage(data);
      const newSections = data.sections || [];
      setSections(newSections);
      return newSections;
    } catch (error) {
      console.error("Failed to load page:", error);
      return [];
    } finally { setLoading(false); }
  };

  const handleSaveSection = async (sectionData: any) => {
    try {
      const url = `/api/pages/sections/${selectedSectionId}`;
      const payload = { ...sectionData };
      delete payload.title;

      const res = await fetch(`${API_BASE_URL}${url}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Cookies.get("bmm_admin_token")}` },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = {};
      try { data = JSON.parse(text); } catch { }

      if (!res.ok) {
        throw new Error(data.message || data.error || `Save failed with status ${res.status}`);
      }

      await loadPage();
    } catch (error: any) {
      console.error("❌ Failed to save section:", error);
      alert(`Failed to save section: ${error.message}`);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/sections/${sectionId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${Cookies.get("bmm_admin_token")}` }
      });
      if (!res.ok) throw new Error("Failed to delete");

      if (selectedSectionId === sectionId) setSelectedSectionId(null);
      await loadPage();
    } catch (error: any) {
      alert(`Failed to delete section: ${error.message}`);
    }
  };

  const handleToggleVisibility = async (sectionId: string, isVisible: boolean) => {
    try {
      await fetchWithAuth(`/api/pages/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !isVisible }),
      });
      await loadPage();
    } catch (error: any) {
      alert(`Failed to toggle visibility: ${error.message}`);
    }
  };

  const handleAddSection = async (type: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${pageId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Cookies.get("bmm_admin_token")}` },
        body: JSON.stringify({ type, isVisible: true, props: {}, order: sections.length }),
      });

      if (!res.ok) throw new Error("Failed to create section");

      setShowAddModal(false);
      const updatedSections = await loadPage();

      if (updatedSections.length > 0) {
        setSelectedSectionId(updatedSections[updatedSections.length - 1].id);
      }
    } catch (error: any) {
      alert(`Failed to add section: ${error.message}`);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedIndex];
    newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, draggedSection);
    setSections(newSections);
    setDraggedIndex(index);
  };

  const handleDrop = async () => {
    if (draggedIndex === null) return;

    try {
      const updatePromises = sections.map((section, index) => {
        return fetchWithAuth(`/api/pages/sections/${section.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        });
      });

      await Promise.all(updatePromises);
      setDraggedIndex(null);
      await loadPage();
    } catch (error: any) {
      alert(`Failed to reorder sections: ${error.message}`);
      await loadPage();
    }
  };

  if (loading) return (<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div></div>);
  if (!page) return (<div className="text-center py-12"><h2 className="text-xl font-bold text-gray-900 mb-2">Page not found</h2><button onClick={() => router.push("/admin/pages")} className="text-orange-600 hover:text-orange-700 text-sm">Back to Pages</button></div>);

  const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={() => router.push("/admin/pages")} className="p-1.5 hover:bg-gray-100 rounded transition-colors"><ArrowLeft className="w-4 h-4" /></button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
          <p className="text-sm text-gray-600 mt-0.5">Manage sections for this page</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-shrink-0 min-h-0">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Sections ({sections.length})</h2>
            <span className="text-xs text-gray-500">Drag to reorder</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
            {sections.map((section, index) => {
              const sectionInfo = SECTION_TYPES[section.type] || { label: section.type, icon: FileText, color: "bg-gray-500" };
              const SectionTypeIcon = sectionInfo.icon;
              const SectionTypeColor = sectionInfo.color;
              const isSelected = selectedSectionId === section.id;

              return (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${isSelected ? 'bg-orange-50 border border-orange-200 shadow-sm' : 'hover:bg-gray-50 border border-transparent'} ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                  <div className={`p-1.5 rounded ${SectionTypeColor}`}>
                    <SectionTypeIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{sectionInfo.label}</h3>
                    <p className="text-xs text-gray-500">ID: {section.id.slice(0, 8)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleVisibility(section.id, section.isVisible); }}
                    className={`p-1 rounded transition-colors ${section.isVisible ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-200"}`}
                    title={section.isVisible ? "Hide" : "Show"}
                  >
                    {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
            {sections.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">No sections yet. Click "Add Section" to start.</div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col min-w-0 min-h-0">
          {selectedSection ? (
            <SectionEditor key={selectedSection.id} section={selectedSection} onSave={handleSaveSection} onDelete={handleDeleteSection} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Select a section to edit</p>
                <p className="text-sm">Choose a section from the left panel to view and edit its settings.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

export default function SectionsPage() {
  return <SectionsPageContent />;
}
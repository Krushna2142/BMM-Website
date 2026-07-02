// frontend/app/admin/(protected)/pages/[id]/sections/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, 
  Plus, X, Save, Loader2, Settings, Trash2, AlertTriangle,
  Layout, Edit3, FileText, Image as ImageIcon, Users, Award,
  PanelRight, PanelLeft
} from 'lucide-react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionEditor from '@/components/admin/SectionEditor';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Section {
  id: string;
  type: string;
  order: number;
  isVisible: boolean;
  props: any;
  label?: string;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section', icon: Layout, description: 'Large banner with title, subtitle, and CTA buttons' },
  { value: 'action_buttons', label: 'Action Buttons', icon: PanelRight, description: 'Grid of colorful action buttons' },
  { value: 'sponsors', label: 'Sponsors', icon: Award, description: 'Partners and sponsors showcase' },
  { value: 'image_slider', label: 'Image Slider', icon: ImageIcon, description: 'Slideshow of images' },
  { value: 'committee', label: 'Committee', icon: Users, description: 'Committee members grid' },
  { value: 'executive_members', label: 'Executive Members', icon: Users, description: 'Executive committee members' },
  { value: 'trustees', label: 'Trustees', icon: Users, description: 'Board of trustees' },
  { value: 'content', label: 'Content Block', icon: FileText, description: 'Rich text content with title and image' },
  { value: 'about', label: 'About Section', icon: FileText, description: 'About us section' },
  { value: 'cta', label: 'Call to Action', icon: PanelLeft, description: 'CTA section with button' },
  { value: 'features', label: 'Features', icon: Layout, description: 'Features grid/list' },
];

// ============ SORTABLE SECTION CARD ============
function SortableSectionCard({ 
  section, index, total, onEdit, onToggleVisibility, onMoveUp, onMoveDown,
  isDragging 
}: { 
  section: Section; index: number; total: number;
  onEdit: () => void; onToggleVisibility: () => void;
  onMoveUp: () => void; onMoveDown: () => void;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const typeInfo = SECTION_TYPES.find(t => t.value === section.type);
  const Icon = typeInfo?.icon || FileText;

  // Get preview text based on section type
  const getPreviewText = () => {
    const props = section.props || {};
    switch (section.type) {
      case 'hero':
        return props.title || 'Hero Section';
      case 'action_buttons':
        return `${(props.buttons || []).length} buttons`;
      case 'sponsors':
        return `${(props.sponsors || []).length} sponsors`;
      case 'image_slider':
        return `${(props.images || []).length} images`;
      case 'committee':
      case 'executive_members':
      case 'trustees':
        return `${(props.members || []).length} members`;
      case 'content':
      case 'about':
      case 'cta':
      case 'features':
        return props.title || 'Content block';
      default:
        return typeInfo?.label || section.type;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
        isDragging ? 'border-blue-500 shadow-lg scale-[1.02] z-50' : 
        section.isVisible ? 'border-gray-200 hover:border-blue-300' : 'border-gray-200 opacity-60'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg mt-1"
            title="Drag to reorder"
          >
            <GripVertical size={20} className="text-gray-400" />
          </div>

          {/* Section Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${section.isVisible ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Icon size={16} className={section.isVisible ? 'text-blue-600' : 'text-gray-500'} />
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {section.label || typeInfo?.label || section.type}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                section.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {section.isVisible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {getPreviewText()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Position: {index + 1} of {total}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move Up"
            >
              <ChevronUp size={18} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move Down"
            >
              <ChevronDown size={18} />
            </button>
            <button
              onClick={onToggleVisibility}
              className={`p-2 rounded-lg ${
                section.isVisible 
                  ? 'text-yellow-600 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={section.isVisible ? 'Hide Section' : 'Show Section'}
            >
              {section.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="Edit Section"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SECTION EDITOR MODAL ============
function SectionEditorModal({ 
  section, isNew, sectionTypes, onSave, onClose 
}: { 
  section: Section | null; 
  isNew: boolean;
  sectionTypes: typeof SECTION_TYPES;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    type: section?.type || 'hero',
    label: section?.label || '',
    isVisible: section?.isVisible ?? true,
    props: section?.props || {},
  });
  const [saving, setSaving] = useState(false);

  const getDefaultProps = (type: string) => {
    const defaults: any = {
      hero: {
        backgroundImage: '',
        title: 'Welcome to BMM',
        subtitleMarathi: '|| मराठी तितुका मेळवावा ||',
        subtitleEnglish: 'Uniting the Marathi speaking community',
        description: '',
        buttons: [
          { label: 'Learn More', link: '/about', variant: 'primary' },
          { label: 'Get Involved', link: '/contact', variant: 'secondary' },
        ],
      },
      action_buttons: {
        buttons: [
          { label: 'BMM 2026 Seattle', link: '/events/seattle', color: 'orange' },
          { label: 'Visiting India?', link: '/offers', color: 'red' },
        ],
      },
      sponsors: {
        title: 'Our Partners & Sponsors',
        subtitle: 'Trusted organizations supporting the Marathi community',
        sponsors: [],
      },
      image_slider: { images: [] },
      committee: {
        titleMarathi: 'बृहन्महाराष्ट्र मंडळ समिती',
        titleEnglish: 'BMM Committee',
        members: [],
      },
      executive_members: {
        titleMarathi: 'कार्यकारी समिती सदस्य',
        titleEnglish: 'Executive Committee Members',
        members: [],
      },
      trustees: {
        titleMarathi: 'बृहन्महाराष्ट्र मंडळ विश्वस्त',
        titleEnglish: 'Board of Trustees',
        members: [],
      },
      content: { title: '', subtitle: '', content: '', backgroundImage: '' },
      about: { title: '', subtitle: '', content: '', backgroundImage: '' },
      cta: { title: '', subtitle: '', content: '', backgroundImage: '' },
      features: { title: '', subtitle: '', content: '', backgroundImage: '' },
    };
    return defaults[type] || {};
  };

  useEffect(() => {
    if (isNew) {
      setFormData({
        type: 'hero',
        label: '',
        isVisible: true,
        props: getDefaultProps('hero'),
      });
    }
  }, [isNew]);

  const handleTypeChange = (newType: string) => {
    setFormData({
      ...formData,
      type: newType,
      props: getDefaultProps(newType),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNew ? 'Add New Section' : 'Edit Section'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isNew ? 'Choose a section type and configure its content' : 'Update section content and settings'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Section Type Selection (only for new sections) */}
            {isNew && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Section Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectionTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500' : 'bg-gray-100'}`}>
                          <Icon size={20} className={isSelected ? 'text-white' : 'text-gray-600'} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                            {type.label}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section Label */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section Label (Admin Only)
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Main Hero Banner"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This label is only visible in the admin panel to help identify sections
              </p>
            </div>

            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-semibold text-gray-900">Section Visibility</h4>
                <p className="text-sm text-gray-500">Toggle to show/hide this section on the website</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  formData.isVisible ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                    formData.isVisible ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Section-Specific Editor */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Section Content
              </h3>
              <SectionEditor
                sectionType={formData.type}
                props={formData.props}
                onChange={(props) => setFormData({ ...formData, props })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Section
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ DELETE CONFIRMATION MODAL ============
function DeleteConfirmModal({ 
  section, onConfirm, onClose 
}: { 
  section: Section;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const typeName = SECTION_TYPES.find(t => t.value === section.type)?.label || section.type;
  const canDelete = confirmText === typeName;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Delete Section</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              You are about to delete the <strong>{typeName}</strong> section. 
              All content in this section will be permanently removed.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{typeName}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={typeName}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!canDelete}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Section
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN PAGE COMPONENT ============
export default function SectionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchPage();
  }, [id]);

  const getAuthHeaders = () => {
    const token = Cookies.get('bmm_admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchPage = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setPageInfo(data);
      setSections(data.sections || []);
    } catch (err) {
      console.error('Failed to fetch page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      setHasChanges(true);
    }
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/api/pages/${id}/sections/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionIds: sections.map(s => s.id) }),
      });
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save order:', err);
      alert('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = () => {
    setEditingSection(null);
    setShowEditor(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setShowEditor(true);
  };

  const handleSaveSection = async (formData: any) => {
    try {
      const url = editingSection
        ? `${API_BASE_URL}/api/pages/sections/${editingSection.id}`
        : `${API_BASE_URL}/api/pages/${id}/sections`;
      const method = editingSection ? 'PUT' : 'POST';

      const payload = {
        type: formData.type,
        label: formData.label,
        isVisible: formData.isVisible,
        props: formData.props,
        order: editingSection ? editingSection.order : sections.length + 1,
      };

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      setShowEditor(false);
      setEditingSection(null);
      await fetchPage();
    } catch (err) {
      console.error('Failed to save section:', err);
      alert('Failed to save section. Please try again.');
    }
  };

  const handleToggleVisibility = async (section: Section) => {
    try {
      await fetch(`${API_BASE_URL}/api/pages/sections/${section.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVisible: !section.isVisible }),
      });
      await fetchPage();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newSections = arrayMove(sections, index, index - 1);
    setSections(newSections);
    setHasChanges(true);
  };

  const handleMoveDown = async (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = arrayMove(sections, index, index + 1);
    setSections(newSections);
    setHasChanges(true);
  };

  const handleDelete = async () => {
    if (!deletingSection) return;
    try {
      await fetch(`${API_BASE_URL}/api/pages/sections/${deletingSection.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      setDeletingSection(null);
      await fetchPage();
    } catch (err) {
      console.error('Failed to delete section:', err);
      alert('Failed to delete section. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/pages')}
          className="text-blue-600 hover:text-blue-900 mb-3 flex items-center gap-1 text-sm font-medium"
        >
          ← Back to Pages
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {pageInfo?.title || 'Page'} Sections
            </h1>
            <p className="text-gray-500 mt-1">
              Drag and drop to reorder sections. Click edit to modify content.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Order
              </button>
            )}
            <button
              onClick={handleCreate}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              Add Section
            </button>
          </div>
        </div>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 text-center">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <Layout size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start building your page by adding sections. Each section can contain different types of content.
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add Your First Section
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sections.map((section, index) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  total={sections.length}
                  isDragging={false}
                  onEdit={() => handleEdit(section)}
                  onToggleVisibility={() => handleToggleVisibility(section)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Section Editor Modal */}
      {showEditor && (
        <SectionEditorModal
          section={editingSection}
          isNew={!editingSection}
          sectionTypes={SECTION_TYPES}
          onSave={handleSaveSection}
          onClose={() => {
            setShowEditor(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingSection && (
        <DeleteConfirmModal
          section={deletingSection}
          onConfirm={handleDelete}
          onClose={() => setDeletingSection(null)}
        />
      )}
    </div>
  );
}

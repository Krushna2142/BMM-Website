// frontend/app/admin/(protected)/pages/[id]/sections/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface Section {
  id: string;
  type: string;
  order: number;
  isVisible: boolean;
  props: any;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'action_buttons', label: 'Action Buttons' },
  { value: 'sponsors', label: 'Sponsors' },
  { value: 'image_slider', label: 'Image Slider' },
  { value: 'committee', label: 'Committee' },
  { value: 'executive_members', label: 'Executive Members' },
  { value: 'trustees', label: 'Trustees' },
];

export default function SectionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({
    type: 'hero',
    order: 0,
    isVisible: true,
    props: {},
  });

  useEffect(() => {
    fetchSections();
  }, [id]);

  const getAuthHeaders = () => {
    const token = Cookies.get('bmm_admin_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchSections = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSection(null);
    setFormData({ type: 'hero', order: sections.length + 1, isVisible: true, props: getDefaultProps('hero') });
    setShowModal(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      type: section.type,
      order: section.order,
      isVisible: section.isVisible,
      props: section.props,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editingSection
        ? `${API_BASE_URL}/api/pages/sections/${editingSection.id}`
        : `${API_BASE_URL}/api/pages/${id}/sections`;
      const method = editingSection ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchSections();
    } catch (err) {
      console.error('Failed to save section:', err);
    }
  };

  const handleDelete = async (sectionId: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/pages/sections/${sectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      fetchSections();
    } catch (err) {
      console.error('Failed to delete section:', err);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    
    try {
      await fetch(`${API_BASE_URL}/api/pages/${id}/sections/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionIds: newSections.map(s => s.id) }),
      });
      fetchSections();
    } catch (err) {
      console.error('Failed to reorder sections:', err);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    
    try {
      await fetch(`${API_BASE_URL}/api/pages/${id}/sections/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sectionIds: newSections.map(s => s.id) }),
      });
      fetchSections();
    } catch (err) {
      console.error('Failed to reorder sections:', err);
    }
  };

  const handleToggleVisibility = async (section: Section) => {
    try {
      await fetch(`${API_BASE_URL}/api/pages/sections/${section.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isVisible: !section.isVisible }),
      });
      fetchSections();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const getDefaultProps = (type: string) => {
    const defaults: any = {
      hero: {
        backgroundImage: '',
        title: 'Welcome to BMM',
        subtitleMarathi: '|| मराठी तितुका मेळवावा ||',
        subtitleEnglish: 'Uniting the Marathi speaking community',
        buttons: [
          { label: 'Learn More', link: '/about', variant: 'primary' },
          { label: 'Get Involved', link: '/contact', variant: 'secondary' },
        ],
      },
      action_buttons: {
        buttons: [
          { label: 'BMM 2026 Seattle', link: '/events/seattle', color: 'orange' },
          { label: 'Visiting India? BMM BVG offers!', link: '/offers', color: 'red' },
          { label: 'BMM 2026 Elections', link: '/elections', color: 'orange' },
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
    };
    return defaults[type] || {};
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => router.push('/admin/pages')}
            className="text-blue-600 hover:text-blue-900 mb-2"
          >
            ← Back to Pages
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Sections</h1>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 text-lg mb-4">No sections yet</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">
                      {SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      section.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {section.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Order: {section.order}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
                    title="Move Up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sections.length - 1}
                    className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
                    title="Move Down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(section)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title={section.isVisible ? 'Hide' : 'Show'}
                  >
                    {section.isVisible ? '👁️' : '🚫'}
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(section.props, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingSection ? 'Edit Section' : 'Add Section'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({
                      ...formData,
                      type: newType,
                      props: getDefaultProps(newType),
                    });
                  }}
                  className="w-full px-3 py-2 border rounded"
                >
                  {SECTION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  />
                  <span className="text-sm font-medium">Visible</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Props (JSON)</label>
                <textarea
                  value={JSON.stringify(formData.props, null, 2)}
                  onChange={(e) => {
                    try {
                      setFormData({ ...formData, props: JSON.parse(e.target.value) });
                    } catch (err) {
                      // Invalid JSON, ignore
                    }
                  }}
                  rows={15}
                  className="w-full px-3 py-2 border rounded font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Upload, X, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface SectionEditorProps {
  sectionType: string;
  props: any;
  onChange: (props: any) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}

// Reusable form components
function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  );
}

function ImageUploader({ value, onChange, onUploadingChange }: { 
  value: string; 
  onChange: (v: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setToast({ message: 'Please select an image file', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'File size must be less than 5MB', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setUploading(true);
    setProgress(0);
    onUploadingChange?.(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = document.cookie.split('; ').find(r => r.startsWith('bmm_admin_token='))?.split('=')[1];
      
      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded * 100) / e.total);
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              onChange(data.url);
              setToast({ message: 'Image uploaded successfully!', type: 'success' });
              setTimeout(() => setToast(null), 3000);
              resolve();
            } catch (err) {
              reject(new Error('Invalid response from server'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        xhr.open('POST', `${API_BASE_URL}/api/media/upload`);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
      });
    } catch (err: any) {
      console.error('Upload failed:', err);
      setToast({ message: err.message || 'Upload failed. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploading(false);
      setProgress(0);
      onUploadingChange?.(false);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="max-h-40 rounded-lg border" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
          uploading ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 hover:bg-gray-200'
        }`}>
          <Upload size={16} />
          <span>{uploading ? `Uploading ${progress}%...` : 'Upload Image'}</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            className="hidden" 
            disabled={uploading} 
          />
        </label>
        <span className="text-sm text-gray-500">or</span>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />
      </div>
      
      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ============ HERO SECTION EDITOR ============
function HeroEditor({ props, onChange, onUploadingChange }: { 
  props: any; 
  onChange: (p: any) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const updateProps = (key: string, value: any) => {
    onChange({ ...props, [key]: value });
  };

  const updateButton = (index: number, key: string, value: string) => {
    const buttons = [...(props.buttons || [])];
    buttons[index] = { ...buttons[index], [key]: value };
    updateProps('buttons', buttons);
  };

  const addButton = () => {
    const buttons = [...(props.buttons || []), { label: 'New Button', link: '/', variant: 'primary' }];
    updateProps('buttons', buttons);
  };

  const removeButton = (index: number) => {
    const buttons = (props.buttons || []).filter((_: any, i: number) => i !== index);
    updateProps('buttons', buttons);
  };

  return (
    <div className="space-y-4">
      <FormField label="Background Image">
        <ImageUploader 
          value={props.backgroundImage} 
          onChange={(v) => updateProps('backgroundImage', v)} 
          onUploadingChange={onUploadingChange}
        />
      </FormField>

      <FormField label="Title" required>
        <TextInput value={props.title} onChange={(v) => updateProps('title', v)} placeholder="Welcome to BMM" />
      </FormField>

      <FormField label="Subtitle (Marathi)">
        <TextInput value={props.subtitleMarathi} onChange={(v) => updateProps('subtitleMarathi', v)} placeholder="|| मराठी तितुका मेळवावा ||" />
      </FormField>

      <FormField label="Subtitle (English)">
        <TextInput value={props.subtitleEnglish} onChange={(v) => updateProps('subtitleEnglish', v)} placeholder="Uniting the Marathi speaking community" />
      </FormField>

      <FormField label="Description">
        <RichTextEditor 
          content={props.description || ''} 
          onChange={(v) => updateProps('description', v)}
          placeholder="Enter hero description..."
        />
      </FormField>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-700">Buttons</h4>
          <button type="button" onClick={addButton} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus size={16} /> Add Button
          </button>
        </div>
        
        {(props.buttons || []).map((btn: any, index: number) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Button {index + 1}</span>
              <button type="button" onClick={() => removeButton(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Label</label>
                <TextInput value={btn.label} onChange={(v) => updateButton(index, 'label', v)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Link</label>
                <TextInput value={btn.link} onChange={(v) => updateButton(index, 'link', v)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Variant</label>
              <select
                value={btn.variant || 'primary'}
                onChange={(e) => updateButton(index, 'variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ ACTION BUTTONS EDITOR ============
function ActionButtonsEditor({ props, onChange }: { props: any; onChange: (p: any) => void }) {
  const updateButton = (index: number, key: string, value: string) => {
    const buttons = [...(props.buttons || [])];
    buttons[index] = { ...buttons[index], [key]: value };
    onChange({ ...props, buttons });
  };

  const addButton = () => {
    const buttons = [...(props.buttons || []), { label: 'New Button', link: '/', color: 'blue' }];
    onChange({ ...props, buttons });
  };

  const removeButton = (index: number) => {
    const buttons = (props.buttons || []).filter((_: any, i: number) => i !== index);
    onChange({ ...props, buttons });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">Action Buttons</h4>
        <button type="button" onClick={addButton} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <Plus size={16} /> Add Button
        </button>
      </div>
      
      {(props.buttons || []).map((btn: any, index: number) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Button {index + 1}</span>
            <button type="button" onClick={() => removeButton(index)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Label</label>
              <TextInput value={btn.label} onChange={(v) => updateButton(index, 'label', v)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Link</label>
              <TextInput value={btn.link} onChange={(v) => updateButton(index, 'link', v)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Color</label>
            <select
              value={btn.color || 'blue'}
              onChange={(e) => updateButton(index, 'color', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="blue">Blue</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ SPONSORS EDITOR ============
function SponsorsEditor({ props, onChange, onUploadingChange }: { 
  props: any; 
  onChange: (p: any) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const updateSponsor = (index: number, key: string, value: string) => {
    const sponsors = [...(props.sponsors || [])];
    sponsors[index] = { ...sponsors[index], [key]: value };
    onChange({ ...props, sponsors });
  };

  const addSponsor = () => {
    const sponsors = [...(props.sponsors || []), { name: '', logo: '', website: '' }];
    onChange({ ...props, sponsors });
  };

  const removeSponsor = (index: number) => {
    const sponsors = (props.sponsors || []).filter((_: any, i: number) => i !== index);
    onChange({ ...props, sponsors });
  };

  return (
    <div className="space-y-4">
      <FormField label="Section Title">
        <TextInput value={props.title} onChange={(v) => onChange({ ...props, title: v })} placeholder="Our Partners & Sponsors" />
      </FormField>

      <FormField label="Subtitle">
        <TextInput value={props.subtitle} onChange={(v) => onChange({ ...props, subtitle: v })} placeholder="Trusted organizations..." />
      </FormField>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-700">Sponsors</h4>
          <button type="button" onClick={addSponsor} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus size={16} /> Add Sponsor
          </button>
        </div>
        
        {(props.sponsors || []).map((sponsor: any, index: number) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Sponsor {index + 1}</span>
              <button type="button" onClick={() => removeSponsor(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <TextInput value={sponsor.name} onChange={(v) => updateSponsor(index, 'name', v)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Logo</label>
              <ImageUploader 
                value={sponsor.logo} 
                onChange={(v) => updateSponsor(index, 'logo', v)} 
                onUploadingChange={onUploadingChange}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Website URL</label>
              <TextInput value={sponsor.website} onChange={(v) => updateSponsor(index, 'website', v)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ COMMITTEE / MEMBERS EDITOR ============
function MembersEditor({ props, onChange, titlePrefix, onUploadingChange }: { 
  props: any; 
  onChange: (p: any) => void; 
  titlePrefix: string;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const updateMember = (index: number, key: string, value: string) => {
    const members = [...(props.members || [])];
    members[index] = { ...members[index], [key]: value };
    onChange({ ...props, members });
  };

  const addMember = () => {
    const members = [...(props.members || []), { name: '', designation: '', image: '', bio: '' }];
    onChange({ ...props, members });
  };

  const removeMember = (index: number) => {
    const members = (props.members || []).filter((_: any, i: number) => i !== index);
    onChange({ ...props, members });
  };

  return (
    <div className="space-y-4">
      <FormField label={`Title (Marathi)`}>
        <TextInput value={props.titleMarathi} onChange={(v) => onChange({ ...props, titleMarathi: v })} placeholder={`${titlePrefix} (मराठी)`} />
      </FormField>

      <FormField label={`Title (English)`}>
        <TextInput value={props.titleEnglish} onChange={(v) => onChange({ ...props, titleEnglish: v })} placeholder={`${titlePrefix} (English)`} />
      </FormField>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-700">Members</h4>
          <button type="button" onClick={addMember} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
            <Plus size={16} /> Add Member
          </button>
        </div>
        
        {(props.members || []).map((member: any, index: number) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Member {index + 1}</span>
              <button type="button" onClick={() => removeMember(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">Name</label>
                <TextInput value={member.name} onChange={(v) => updateMember(index, 'name', v)} />
              </div>
              <div>
                <label className="text-xs text-gray-500">Designation</label>
                <TextInput value={member.designation} onChange={(v) => updateMember(index, 'designation', v)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">Photo</label>
              <ImageUploader 
                value={member.image} 
                onChange={(v) => updateMember(index, 'image', v)} 
                onUploadingChange={onUploadingChange}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Bio</label>
              <TextArea value={member.bio} onChange={(v) => updateMember(index, 'bio', v)} rows={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ IMAGE SLIDER EDITOR ============
function ImageSliderEditor({ props, onChange, onUploadingChange }: { 
  props: any; 
  onChange: (p: any) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const updateImage = (index: number, key: string, value: string) => {
    const images = [...(props.images || [])];
    images[index] = { ...images[index], [key]: value };
    onChange({ ...props, images });
  };

  const addImage = () => {
    const images = [...(props.images || []), { url: '', alt: '', caption: '' }];
    onChange({ ...props, images });
  };

  const removeImage = (index: number) => {
    const images = (props.images || []).filter((_: any, i: number) => i !== index);
    onChange({ ...props, images });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-700">Slider Images</h4>
        <button type="button" onClick={addImage} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
          <Plus size={16} /> Add Image
        </button>
      </div>
      
      {(props.images || []).map((img: any, index: number) => (
        <div key={index} className="bg-gray-50 p-3 rounded-lg mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Image {index + 1}</span>
            <button type="button" onClick={() => removeImage(index)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
          <div>
            <label className="text-xs text-gray-500">Image</label>
            <ImageUploader 
              value={img.url} 
              onChange={(v) => updateImage(index, 'url', v)} 
              onUploadingChange={onUploadingChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Alt Text</label>
              <TextInput value={img.alt} onChange={(v) => updateImage(index, 'alt', v)} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Caption</label>
              <TextInput value={img.caption} onChange={(v) => updateImage(index, 'caption', v)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ GENERIC CONTENT SECTION EDITOR ============
function GenericContentEditor({ props, onChange, onUploadingChange }: { 
  props: any; 
  onChange: (p: any) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <FormField label="Title">
        <TextInput value={props.title} onChange={(v) => onChange({ ...props, title: v })} />
      </FormField>

      <FormField label="Subtitle">
        <TextInput value={props.subtitle} onChange={(v) => onChange({ ...props, subtitle: v })} />
      </FormField>

      <FormField label="Content">
        <RichTextEditor 
          content={props.content || ''} 
          onChange={(v) => onChange({ ...props, content: v })}
          placeholder="Enter section content..."
        />
      </FormField>

      <FormField label="Background Image">
        <ImageUploader 
          value={props.backgroundImage} 
          onChange={(v) => onChange({ ...props, backgroundImage: v })} 
          onUploadingChange={onUploadingChange}
        />
      </FormField>
    </div>
  );
}

// ============ MAIN SECTION EDITOR ============
export default function SectionEditor({ sectionType, props, onChange, onUploadingChange }: SectionEditorProps) {
  switch (sectionType) {
    case 'hero':
      return <HeroEditor props={props} onChange={onChange} onUploadingChange={onUploadingChange} />;
    case 'action_buttons':
      return <ActionButtonsEditor props={props} onChange={onChange} />;
    case 'sponsors':
      return <SponsorsEditor props={props} onChange={onChange} onUploadingChange={onUploadingChange} />;
    case 'image_slider':
      return <ImageSliderEditor props={props} onChange={onChange} onUploadingChange={onUploadingChange} />;
    case 'committee':
      return <MembersEditor props={props} onChange={onChange} titlePrefix="BMM Committee" onUploadingChange={onUploadingChange} />;
    case 'executive_members':
      return <MembersEditor props={props} onChange={onChange} titlePrefix="Executive Members" onUploadingChange={onUploadingChange} />;
    case 'trustees':
      return <MembersEditor props={props} onChange={onChange} titlePrefix="Board of Trustees" onUploadingChange={onUploadingChange} />;
    case 'content':
    case 'about':
    case 'cta':
    case 'features':
      return <GenericContentEditor props={props} onChange={onChange} onUploadingChange={onUploadingChange} />;
    default:
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">
            Unknown section type: <code>{sectionType}</code>
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Falling back to generic editor. Please contact developer to add support for this section type.
          </p>
          <div className="mt-4">
            <GenericContentEditor props={props} onChange={onChange} onUploadingChange={onUploadingChange} />
          </div>
        </div>
      );
  }
}

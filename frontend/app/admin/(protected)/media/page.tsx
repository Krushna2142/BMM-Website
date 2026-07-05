"use client";

import { useState, useEffect } from "react";
import { 
  Upload, Search, Trash2, Image as ImageIcon, 
  Check, X, Download, AlertTriangle, 
  Folder, FolderPlus, Copy, Scissors, ClipboardPaste, 
  Pencil, Home, ZoomIn, Menu, Grid3x3, List, ChevronLeft, MousePointer2
} from "lucide-react";
import api, { uploadFile } from "@/src/lib/api";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string | null;
  createdAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [pendingFolders, setPendingFolders] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectMode, setSelectMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selection & Clipboard
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [clipboard, setClipboard] = useState<{ ids: string[], action: 'copy' | 'cut' } | null>(null);

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  // Modals
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [renameItem, setRenameItem] = useState<MediaItem | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    fetchMedia();
    fetchFolders();
  }, [currentFolder]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewItem(null);
        setShowDeleteModal(false);
        setRenameItem(null);
        setShowNewFolderModal(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = currentFolder ? `/media?folder=${encodeURIComponent(currentFolder)}` : '/media';
      const response = await api.get(url);
      setMedia(response.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await api.get("/media/folders");
      const folderList = response.data || [];
      // Merge database folders with pending folders
      const allFolders = [...new Set([...folderList, ...pendingFolders])];
      setFolders(allFolders);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus(`Preparing ${files.length} file(s)...`);

    const filesArray = Array.from(files);
    let completed = 0;

    try {
      for (const file of filesArray) {
        setUploadStatus(`Uploading ${file.name}...`);
        await uploadFile(file, currentFolder || undefined, (progress) => {
          const overallProgress = Math.round(((completed + progress / 100) / filesArray.length) * 100);
          setUploadProgress(overallProgress);
        });
        completed++;
      }
      setUploadStatus(`✅ Upload complete!`);
      await fetchMedia();
      
      // Clear pending folder if we just uploaded to it
      if (currentFolder && pendingFolders.includes(currentFolder)) {
        setPendingFolders(pendingFolders.filter(f => f !== currentFolder));
      }
      
      await fetchFolders();
      setTimeout(() => { setUploading(false); setUploadProgress(0); setUploadStatus(""); }, 2000);
    } catch (error: any) {
      setUploadStatus(`❌ Upload failed: ${error.message}`);
      setUploading(false);
    }
    event.target.value = "";
  };

  const handleCopy = () => {
    setClipboard({ ids: Array.from(selectedMedia), action: 'copy' });
    setSelectedMedia(new Set());
    setSelectMode(false);
  };

  const handleCut = () => {
    setClipboard({ ids: Array.from(selectedMedia), action: 'cut' });
    setSelectedMedia(new Set());
    setSelectMode(false);
  };

  const handlePaste = async () => {
    if (!clipboard) return;
    try {
      if (clipboard.action === 'cut') {
        await api.post('/media/move', { ids: clipboard.ids, targetFolder: currentFolder || '' });
      } else {
        await api.post('/media/copy', { ids: clipboard.ids, targetFolder: currentFolder || '' });
      }
      setClipboard(null);
      await fetchMedia();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const handleRenameSubmit = async () => {
    if (!renameItem || !renameValue.trim()) return;
    try {
      await api.post('/media/rename', { id: renameItem.id, newName: renameValue.trim() });
      setRenameItem(null);
      await fetchMedia();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const safeName = newFolderName.trim().replace(/[^a-zA-Z0-9\-_]/g, '');
    
    if (!folders.includes(safeName) && !pendingFolders.includes(safeName)) {
      setPendingFolders([...pendingFolders, safeName]);
      setFolders([...folders, safeName]);
    }
    
    setNewFolderName("");
    setShowNewFolderModal(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await Promise.all(Array.from(selectedMedia).map((id) => api.delete(`/media/${id}`)));
      setMedia(media.filter((m) => !selectedMedia.has(m.id)));
      setSelectedMedia(new Set());
      setShowDeleteModal(false);
      setSelectMode(false);
      await fetchFolders();
    } catch (error: any) {
      alert(`Failed: ${error.message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredMedia = media.filter((item) =>
    item.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedMedia);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedMedia(newSelection);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 p-4 flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs & Menu */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 text-sm min-w-0">
              <button 
                onClick={() => setCurrentFolder(null)}
                className="hover:text-orange-600 flex items-center gap-1 flex-shrink-0 font-medium"
              >
                <Home className="w-4 h-4" /> Media Library
              </button>
              {currentFolder && (
                <>
                  <ChevronLeft className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="font-bold text-gray-900 truncate">{currentFolder}</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Select Mode Toggle */}
            <button
              onClick={() => {
                setSelectMode(!selectMode);
                if (selectMode) setSelectedMedia(new Set());
              }}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectMode
                  ? "bg-orange-100 text-orange-700 border border-orange-500"
                  : "bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200"
              }`}
            >
              <MousePointer2 className="w-4 h-4" />
              <span>{selectMode ? "Exit Select" : "Select Mode"}</span>
              {selectMode && selectedMedia.size > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {selectedMedia.size}
                </span>
              )}
            </button>

            {/* Clipboard Actions */}
            {clipboard && (
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200"
              >
                <ClipboardPaste className="w-4 h-4" /> Paste ({clipboard.ids.length})
              </button>
            )}
            
            {/* Selection Actions */}
            {selectedMedia.size > 0 && (
              <>
                <button onClick={handleCopy} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={handleCut} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Cut">
                  <Scissors className="w-4 h-4" />
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block" />

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 hidden sm:flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? "bg-white shadow-sm text-orange-600" : "text-gray-500"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Upload Button */}
            <label className="flex items-center gap-2 px-4 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 cursor-pointer shadow-sm">
              <Upload className="w-4 h-4" /> 
              <span className="hidden sm:inline">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div className="flex-1 bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
            <span className="text-xs font-medium text-blue-900">{uploadStatus}</span>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        {showSidebar && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowSidebar(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          w-64 h-full
          bg-white border-r border-gray-200 
          flex flex-col
          z-50
          transition-transform duration-300
        `}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-5 h-5 text-orange-500" /> Folders
            </h2>
            <button 
              onClick={() => setShowNewFolderModal(true)}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-orange-600 border border-gray-200"
              title="Create Folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => { setCurrentFolder(null); setShowSidebar(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFolder === null ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" /> All Files
            </button>
            
            {folders.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-400 italic">No folders yet. Create one or upload a file.</p>
            ) : (
              folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => { setCurrentFolder(folder); setShowSidebar(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors truncate ${
                    currentFolder === folder ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Folder className="w-4 h-4 flex-shrink-0 text-gray-400" /> 
                  <span className="truncate">{folder}</span>
                </button>
              ))
            )}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No files found</p>
              <p className="text-sm mt-2">Upload files or check your search term</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedMedia.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => selectMode ? toggleSelection(item.id) : setPreviewItem(item)}
                    className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                      isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="aspect-square relative bg-gray-100">
                      <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" loading="lazy" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {!selectMode && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                          >
                            <ZoomIn className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-2 flex items-center justify-between bg-white border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-900 truncate flex-1" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenameItem(item); setRenameValue(item.originalName); }}
                        className="p-1 text-gray-400 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectMode && <th className="px-6 py-3 w-10"></th>}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedMedia.has(item.id);
                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => selectMode && toggleSelection(item.id)}
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-orange-50' : ''}`}
                      >
                        {selectMode && (
                          <td className="px-6 py-4">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{item.originalName}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(item.size)}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col" onClick={() => setPreviewItem(null)}>
          <div className="flex items-center justify-between p-4 text-white">
            <h3 className="font-semibold truncate">{previewItem.originalName}</h3>
            <div className="flex gap-2">
              <a href={previewItem.url} target="_blank" className="p-2 hover:bg-white/20 rounded"><Download className="w-5 h-5" /></a>
              <button onClick={() => setPreviewItem(null)} className="p-2 hover:bg-white/20 rounded"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img src={previewItem.url} alt={previewItem.originalName} className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}

      {renameItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRenameItem(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Rename File</h3>
            <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-4" autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenameItem(null)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleRenameSubmit} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewFolderModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Create Folder</h3>
            <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder Name" className="w-full px-3 py-2 border rounded-lg mb-4" autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNewFolderModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleCreateFolder} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Create</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Delete {selectedMedia.size} file(s)?</h3>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
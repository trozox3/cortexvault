"use client";

import { useState, useEffect } from 'react';
import { FileText, Folder, MoreVertical, Search, UploadCloud, Loader2 } from 'lucide-react';

type Document = {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  status: string;
  tags: string[];
  excerpt: string;
};

export default function WorkspacePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments(); // Refresh list
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed due to network error.');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Workspace</h1>
          <p className="text-slate-400 text-sm mt-1">Manage, organize, and explore your indexed documents.</p>
        </div>
        <div className="flex space-x-3">
          <label className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {isUploading ? 'Processing...' : 'Upload Document'}
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-[#334155] rounded-xl flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0F172A]">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full bg-[#1E293B] border border-[#334155] rounded-md pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-auto p-0">
          {isLoading ? (
             <div className="flex justify-center items-center h-40">
               <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
             </div>
          ) : documents.length === 0 ? (
             <div className="flex flex-col justify-center items-center h-40 text-slate-400">
               <FileText className="h-10 w-10 mb-2 opacity-20" />
               <p>No documents uploaded yet. Upload a PDF to get started.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#334155] bg-[#0B1120] text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#1E293B]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-[#1E293B] border border-[#334155] flex items-center justify-center text-cyan-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{doc.title}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[300px]">{doc.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{doc.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{doc.uploadDate}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md text-[10px] font-medium bg-[#1E293B] text-slate-300 border border-[#334155]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#334155] transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

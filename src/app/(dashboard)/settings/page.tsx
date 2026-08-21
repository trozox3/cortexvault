"use client";

import { Save, Shield, HardDrive, User, Bell } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() { 
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="max-w-4xl mx-auto h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings & Administration</h1>
        <p className="text-slate-400 mt-2">Manage your profile, application preferences, and data storage.</p>
      </div>

      <div className="flex gap-6 mt-8">
        {/* Sidebar Nav */}
        <div className="w-64 space-y-1">
          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'profile' ? 'bg-[#1E293B] text-cyan-400' : 'text-slate-300 hover:bg-[#1E293B]/50 hover:text-white'}`}>
            <User className="h-4 w-4" /> Profile Settings
          </button>
          <button onClick={() => setActiveTab('storage')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'storage' ? 'bg-[#1E293B] text-cyan-400' : 'text-slate-300 hover:bg-[#1E293B]/50 hover:text-white'}`}>
            <HardDrive className="h-4 w-4" /> Data & Storage
          </button>
          <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'security' ? 'bg-[#1E293B] text-cyan-400' : 'text-slate-300 hover:bg-[#1E293B]/50 hover:text-white'}`}>
            <Shield className="h-4 w-4" /> Security
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'notifications' ? 'bg-[#1E293B] text-cyan-400' : 'text-slate-300 hover:bg-[#1E293B]/50 hover:text-white'}`}>
            <Bell className="h-4 w-4" /> Notifications
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl p-6">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-[#334155] pb-2">Recommended Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                  <input type="text" defaultValue="Active User" className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-white focus:border-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                  <input type="email" defaultValue="user@example.com" disabled className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-md px-3 py-2 text-slate-400 cursor-not-allowed" />
                  <p className="text-xs text-slate-500 mt-1">Email addresses cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role / Designation</label>
                  <select className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-3 py-2 text-white focus:border-cyan-500 focus:outline-none">
                    <option>Administrator</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* STORAGE SETTINGS */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-[#334155] pb-2">Where is my data stored?</h2>
              
              <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <HardDrive className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Local JSON Database</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Because this is a locally run instance of CortexVault, all of your user accounts, document metadata, and generated vector embeddings are stored locally on your machine.
                    </p>
                    <div className="mt-3 p-2 bg-[#0B1120] rounded border border-[#334155] font-mono text-xs text-cyan-300">
                      R:\RAG\cortexvault\data\db.json
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B] border border-[#334155] rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Data Privacy & LLM</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      During Intelligence Chat and Document Processing, text chunks are sent securely over HTTPS to the Google Gemini API (gemini-2.5-flash and text-embedding-004) to generate responses and vectors. Your files are not retained for training by Google.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER TABS (Placeholders) */}
          {(activeTab === 'security' || activeTab === 'notifications') && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <p>This section is under construction.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

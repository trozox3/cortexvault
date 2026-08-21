"use client";

import { useState } from 'react';
import { Scale, FileText, ArrowRightLeft, Download } from 'lucide-react';
import { mockDocuments } from '@/lib/db/mockData';

export default function ComparePage() {
  const [doc1, setDoc1] = useState(mockDocuments[0].id);
  const [doc2, setDoc2] = useState(mockDocuments[2].id);

  const getDoc = (id: string) => mockDocuments.find(d => d.id === id);
  const selectedDoc1 = getDoc(doc1);
  const selectedDoc2 = getDoc(doc2);

  // Mock comparison logic
  const isRetentionConflict = doc1 === 'd1' && doc2 === 'd3' || doc1 === 'd3' && doc2 === 'd1';

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compare Studio</h1>
          <p className="text-slate-400 text-sm mt-1">Side-by-side analysis of clauses, versions, and obligations.</p>
        </div>
        <button className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
          <Download className="h-4 w-4" />
          Export Matrix
        </button>
      </div>

      <div className="bg-[#0F172A] border border-[#334155] rounded-xl flex-1 flex flex-col overflow-hidden">
        {/* Compare Toolbar */}
        <div className="p-4 border-b border-[#334155] bg-[#0B1120] flex items-center justify-between gap-4">
          <div className="flex-1">
            <select 
              value={doc1}
              onChange={(e) => setDoc1(e.target.value)}
              className="w-full bg-[#1E293B] border border-[#334155] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-cyan-500"
            >
              {mockDocuments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div className="shrink-0 bg-[#1E293B] p-2 rounded-full border border-[#334155]">
            <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex-1">
            <select 
              value={doc2}
              onChange={(e) => setDoc2(e.target.value)}
              className="w-full bg-[#1E293B] border border-[#334155] text-white text-sm rounded-md px-3 py-2 outline-none focus:border-cyan-500"
            >
              {mockDocuments.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
        </div>

        {/* Comparison Result */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Doc */}
          <div className="flex-1 border-r border-[#334155] p-6 overflow-y-auto bg-[#020617]">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-cyan-400" />
              <h2 className="font-semibold text-white">{selectedDoc1?.title}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4">
                <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Summary</h3>
                <p className="text-sm text-slate-300">{selectedDoc1?.excerpt}</p>
              </div>

              {isRetentionConflict && selectedDoc1?.id === 'd1' && (
                <div className="bg-[#1E293B] border-l-2 border-red-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Data Retention Clause (Pg 12)</h3>
                  <p className="text-sm text-slate-300">
                    <span className="bg-red-900/30 text-red-200 px-1 rounded">User data must be retained for 7 years</span> for compliance with financial regulations.
                  </p>
                </div>
              )}
              {isRetentionConflict && selectedDoc1?.id === 'd3' && (
                <div className="bg-[#1E293B] border-l-2 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Termination Clause (Pg 4)</h3>
                  <p className="text-sm text-slate-300">
                    Upon termination of services, <span className="bg-yellow-900/30 text-yellow-200 px-1 rounded">all personal data shall be deleted within 30 days.</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Doc */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#020617]">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-cyan-400" />
              <h2 className="font-semibold text-white">{selectedDoc2?.title}</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0F172A] border border-[#334155] rounded-lg p-4">
                <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Summary</h3>
                <p className="text-sm text-slate-300">{selectedDoc2?.excerpt}</p>
              </div>

              {isRetentionConflict && selectedDoc2?.id === 'd3' && (
                <div className="bg-[#1E293B] border-l-2 border-yellow-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Termination Clause (Pg 4)</h3>
                  <p className="text-sm text-slate-300">
                    Upon termination of services, <span className="bg-yellow-900/30 text-yellow-200 px-1 rounded">all personal data shall be deleted within 30 days.</span>
                  </p>
                </div>
              )}
              {isRetentionConflict && selectedDoc2?.id === 'd1' && (
                <div className="bg-[#1E293B] border-l-2 border-red-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Data Retention Clause (Pg 12)</h3>
                  <p className="text-sm text-slate-300">
                    <span className="bg-red-900/30 text-red-200 px-1 rounded">User data must be retained for 7 years</span> for compliance with financial regulations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isRetentionConflict && (
          <div className="bg-red-900/20 border-t border-red-900/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-200">Conflict Detected</p>
                <p className="text-xs text-red-300/70">The retention period (7 years) in {getDoc('d1')?.title} conflicts with the deletion timeline (30 days) in {getDoc('d3')?.title}.</p>
              </div>
            </div>
            <button className="bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 px-3 py-1.5 rounded text-xs font-medium transition-colors">
              Create Conflict Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

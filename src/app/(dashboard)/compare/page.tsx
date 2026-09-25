"use client";

import { useState, useEffect } from 'react';
import { Scale, FileText, ArrowRightLeft, Download, Loader2 } from 'lucide-react';

type Document = {
  id: string;
  title: string;
  excerpt: string;
};

type Conflict = {
  topic: string;
  doc1Excerpt: string;
  doc2Excerpt: string;
  severity: string;
};

type ComparisonResult = {
  summary: string;
  conflicts: Conflict[];
};

export default function ComparePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [doc1, setDoc1] = useState<string>('');
  const [doc2, setDoc2] = useState<string>('');
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          setDocuments(data.documents);
          if (data.documents.length >= 1) setDoc1(data.documents[0].id);
          if (data.documents.length >= 2) setDoc2(data.documents[1].id);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const getDoc = (id: string) => documents.find(d => d.id === id);
  const selectedDoc1 = doc1 ? getDoc(doc1) : null;
  const selectedDoc2 = doc2 ? getDoc(doc2) : null;

  const runComparison = async () => {
    if (!doc1 || !doc2) return;
    setIsComparing(true);
    setResult(null);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc1Id: doc1, doc2Id: doc2 })
      });
      const data = await res.json();
      if (!data.error) {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compare Studio</h1>
          <p className="text-slate-400 text-sm mt-1">Side-by-side analysis of clauses, versions, and obligations.</p>
        </div>
        <button 
          onClick={runComparison}
          disabled={isComparing || !doc1 || !doc2 || doc1 === doc2}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
          {isComparing ? 'Analyzing...' : 'Run AI Comparison'}
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
              {documents.length === 0 && <option value="">No documents uploaded</option>}
              {documents.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
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
              {documents.length === 0 && <option value="">No documents uploaded</option>}
              {documents.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
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
                <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Original Excerpt</h3>
                <p className="text-sm text-slate-300">{selectedDoc1?.excerpt || 'Select a document.'}</p>
              </div>

              {result && result.conflicts.map((conflict, idx) => (
                <div key={idx} className="bg-[#1E293B] border-l-2 border-amber-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">{conflict.topic}</h3>
                  <p className="text-sm text-slate-300">
                    <span className="bg-amber-900/30 text-amber-200 px-1 rounded">{conflict.doc1Excerpt}</span>
                  </p>
                </div>
              ))}
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
                <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">Original Excerpt</h3>
                <p className="text-sm text-slate-300">{selectedDoc2?.excerpt || 'Select a document.'}</p>
              </div>

              {result && result.conflicts.map((conflict, idx) => (
                <div key={idx} className="bg-[#1E293B] border-l-2 border-red-500 p-4 rounded-r-lg">
                  <h3 className="text-xs uppercase text-slate-500 font-semibold mb-2">{conflict.topic}</h3>
                  <p className="text-sm text-slate-300">
                    <span className="bg-red-900/30 text-red-200 px-1 rounded">{conflict.doc2Excerpt}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {result && (
          <div className="bg-cyan-900/20 border-t border-cyan-900/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-sm font-semibold text-cyan-200">AI Comparison Summary</p>
                <p className="text-xs text-cyan-300/70">{result.summary}</p>
              </div>
            </div>
            <button className="bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 px-3 py-1.5 rounded text-xs font-medium transition-colors">
              Export Matrix
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

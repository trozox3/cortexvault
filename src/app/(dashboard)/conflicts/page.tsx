"use client";

import { useState } from 'react';
import { AlertTriangle, FileText, CheckCircle2, Loader2, Radar } from 'lucide-react';
import { cn } from '@/lib/utils';

type Conflict = {
  id: string;
  description: string;
  severity: string;
  affectedDocuments: string[];
  excerpt1: string;
  excerpt2: string;
  suggestedResolution: string;
};

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const runScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/conflicts', { method: 'POST' });
      const data = await res.json();
      if (data.conflicts) {
        setConflicts(data.conflicts);
      }
      setHasScanned(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Conflict Radar</h1>
          <p className="text-slate-400 text-sm mt-1">Review and resolve contradictions detected across your workspace.</p>
        </div>
        <button 
          onClick={runScan}
          disabled={isScanning}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
        >
          {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
          {isScanning ? 'Scanning Workspace...' : 'Run Full Workspace Scan'}
        </button>
      </div>

      {!hasScanned && !isScanning && (
        <div className="flex flex-col items-center justify-center h-64 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-400">
          <Radar className="h-12 w-12 mb-4 opacity-50 text-cyan-500" />
          <p>Run a workspace scan to detect policy contradictions.</p>
        </div>
      )}

      {hasScanned && conflicts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-[#0F172A] border border-[#334155] rounded-xl text-slate-400">
          <CheckCircle2 className="h-12 w-12 mb-4 opacity-50 text-green-500" />
          <p>No conflicts detected in your workspace.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {conflicts.map(conflict => (
          <div key={conflict.id} className="bg-[#0F172A] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
            <div className={cn(
              "p-4 border-b flex justify-between items-center",
              conflict.severity === 'High' ? "bg-red-900/10 border-red-900/30" : "bg-yellow-900/10 border-yellow-900/30"
            )}>
              <div className="flex items-center gap-2">
                <AlertTriangle className={cn(
                  "h-5 w-5",
                  conflict.severity === 'High' ? "text-red-400" : "text-yellow-400"
                )} />
                <h2 className="font-semibold text-white">{conflict.description}</h2>
              </div>
              <span className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-medium border",
                conflict.severity === 'High' ? "bg-red-900/30 text-red-400 border-red-900/50" : "bg-yellow-900/30 text-yellow-400 border-yellow-900/50"
              )}>
                {conflict.severity} Severity
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="h-4 w-4" />
                  <span>{conflict.affectedDocuments?.[0] || 'Doc 1'}</span>
                </div>
                <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-lg relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l"></div>
                  <p className="text-sm text-slate-300 pl-2">"{conflict.excerpt1}"</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="h-4 w-4" />
                  <span>{conflict.affectedDocuments?.[1] || 'Doc 2'}</span>
                </div>
                <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-lg relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l"></div>
                  <p className="text-sm text-slate-300 pl-2">"{conflict.excerpt2}"</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0B1120] border-t border-[#334155] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">AI Suggested Resolution</p>
                <p className="text-sm text-slate-300">{conflict.suggestedResolution}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Assign to Legal
                </button>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

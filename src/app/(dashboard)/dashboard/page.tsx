"use client";

import { Activity, AlertCircle, CheckCircle2, FileText, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ healthScore: 0, totalDocuments: 0 });

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setMetrics(data);
        }
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of your workspace intelligence and risks.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/workspace" className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Upload Documents
          </Link>
          <Link href="/chat" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            Ask Copilot
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Workspace Health</h3>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{metrics.healthScore}</span>
            <span className="text-sm text-green-400">/ 100</span>
          </div>
        </div>
        
        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Indexed Documents</h3>
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{metrics.totalDocuments}</span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Realtime Conflicts</h3>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Processing...</span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Knowledge Gaps</h3>
            <Target className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

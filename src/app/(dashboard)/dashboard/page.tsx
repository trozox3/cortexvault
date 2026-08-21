import { mockWorkspace, mockConflicts, mockKnowledgeGaps } from '@/lib/db/mockData';
import { Activity, AlertCircle, CheckCircle2, FileText, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const highSeverityConflicts = mockConflicts.filter(c => c.severity === 'High');
  
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
            <span className="text-3xl font-bold text-white">{mockWorkspace.healthScore}</span>
            <span className="text-sm text-green-400">/ 100</span>
          </div>
        </div>
        
        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Indexed Documents</h3>
            <FileText className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{mockWorkspace.totalDocuments}</span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-red-900/50 p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">High Severity Conflicts</h3>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-400">{highSeverityConflicts.length}</span>
            <span className="text-sm text-slate-400">requires review</span>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#334155] p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-400">Knowledge Gaps</h3>
            <Target className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-yellow-400">{mockKnowledgeGaps.length}</span>
            <span className="text-sm text-slate-400">unanswered queries</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Action Items */}
        <div className="bg-[#0F172A] border border-[#334155] rounded-xl flex flex-col">
          <div className="p-5 border-b border-[#334155] flex justify-between items-center">
            <h3 className="font-semibold text-white">Action Items</h3>
            <Link href="/conflicts" className="text-xs text-cyan-400 hover:text-cyan-300">View All</Link>
          </div>
          <div className="p-5 flex-1 space-y-4">
            {highSeverityConflicts.map(conflict => (
              <div key={conflict.id} className="flex gap-4 items-start p-3 bg-[#1E293B] rounded-lg border border-red-900/30">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200">{conflict.description}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">Affects: {conflict.affectedDocuments.join(', ')}</p>
                  <Link href={`/conflicts`} className="text-xs text-cyan-400 mt-2 inline-block hover:underline">Review Conflict &rarr;</Link>
                </div>
              </div>
            ))}
            {mockKnowledgeGaps.map(gap => (
              <div key={gap.id} className="flex gap-4 items-start p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                <Target className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-200">Missing Information Detected</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">Query: "{gap.query}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0F172A] border border-[#334155] rounded-xl flex flex-col">
          <div className="p-5 border-b border-[#334155]">
            <h3 className="font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="p-5 flex-1">
            <div className="relative border-l border-[#334155] ml-3 space-y-6 pb-4">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#1E293B] border-2 border-cyan-500 flex items-center justify-center">
                  <Zap className="h-2 w-2 text-cyan-500" />
                </span>
                <p className="text-sm text-slate-300">Workflow <span className="font-medium text-white">Vendor Due Diligence</span> completed.</p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#1E293B] border-2 border-slate-500 flex items-center justify-center">
                  <CheckCircle2 className="h-2 w-2 text-slate-400" />
                </span>
                <p className="text-sm text-slate-300">Document <span className="font-medium text-white">Privacy Compliance Checklist</span> indexed.</p>
                <p className="text-xs text-slate-500 mt-1">Yesterday</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#1E293B] border-2 border-slate-500 flex items-center justify-center">
                  <Activity className="h-2 w-2 text-slate-400" />
                </span>
                <p className="text-sm text-slate-300">Alice Admin resolved <span className="font-medium text-white">1 conflict</span> in HR policies.</p>
                <p className="text-xs text-slate-500 mt-1">Aug 18, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

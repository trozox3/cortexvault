import { Workflow, Plus, Play } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligent Workflows</h1>
          <p className="text-slate-400 text-sm mt-1">Automate document review and data extraction pipelines.</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Vendor Due Diligence', desc: 'Analyzes master service agreements and DPAs for compliance gaps.', runs: 12 },
          { name: 'Policy Comparison', desc: 'Compares new policy drafts against existing approved versions.', runs: 5 },
          { name: 'Security Audit Prep', desc: 'Extracts ISO27001 evidence from security documentation.', runs: 1 },
        ].map(workflow => (
          <div key={workflow.name} className="bg-[#0F172A] border border-[#334155] rounded-xl p-5 hover:border-cyan-500/50 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-lg bg-[#1E293B] flex items-center justify-center text-cyan-400">
                <Workflow className="h-5 w-5" />
              </div>
              <button className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-[#1E293B] opacity-0 group-hover:opacity-100 transition-all">
                <Play className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-semibold text-white mb-1">{workflow.name}</h3>
            <p className="text-sm text-slate-400 mb-4 h-10">{workflow.desc}</p>
            <div className="flex items-center text-xs text-slate-500 font-medium">
              <span>{workflow.runs} previous runs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

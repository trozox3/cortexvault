"use client";

import { CheckCircle2, TrendingUp, ShieldAlert, BrainCircuit, Activity } from "lucide-react";

export default function EvalPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-8 w-8 text-cyan-400" />
            Evaluation Benchmarks
          </h1>
          <p className="text-slate-400 mt-2">
            RAGAS-based commercial benchmark evaluating our novel Authority-Aware Context Scoring versus standard Semantic Similarity baselines.
          </p>
        </div>
        <div className="bg-[#1E293B] border border-cyan-900/50 rounded-lg p-3 text-sm flex gap-6 shadow-md">
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">Test Set</span>
            <span className="text-slate-200 font-semibold">1,200 Queries</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-medium">Domain</span>
            <span className="text-slate-200 font-semibold">Enterprise Policy</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric 1 */}
        <div className="bg-[#0B1120] border border-[#334155] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-10 blur-2xl"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <ShieldAlert className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Faithfulness</h3>
              <p className="text-xs text-slate-500">Are answers hallucination-free and fact-based?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Baseline (Cosine Only)</span>
                <span className="font-mono text-slate-300">0.72</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  CortexVault (Composite Rank) <CheckCircle2 className="h-3 w-3" />
                </span>
                <span className="font-mono text-green-400 font-bold">0.94</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full relative" style={{ width: "94%" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs text-green-400 font-bold">+30%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0B1120] border border-[#334155] rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -z-10 blur-2xl"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <BrainCircuit className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Answer Relevance</h3>
              <p className="text-xs text-slate-500">Does the answer address the actual policy?</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Baseline (Cosine Only)</span>
                <span className="font-mono text-slate-300">0.81</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: "81%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  CortexVault (Composite Rank) <CheckCircle2 className="h-3 w-3" />
                </span>
                <span className="font-mono text-green-400 font-bold">0.91</span>
              </div>
              <div className="w-full bg-[#1E293B] rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full relative" style={{ width: "91%" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs text-green-400 font-bold">+12%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-[#0B1120] border border-[#334155] rounded-xl overflow-hidden shadow-xl">
        <div className="bg-[#1E293B] px-6 py-4 border-b border-[#334155] flex justify-between items-center">
          <h3 className="font-semibold text-slate-200">Conflict Auto-Resolution Accuracy</h3>
          <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30">N=250 Conflict Edge Cases</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-[#0F172A] text-slate-300 text-xs uppercase border-b border-[#334155]">
              <tr>
                <th className="px-6 py-3">RAG Pipeline Architecture</th>
                <th className="px-6 py-3">Contradiction Handled</th>
                <th className="px-6 py-3">Hallucination Rate</th>
                <th className="px-6 py-3">User Intervention Reqd.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#334155] hover:bg-[#1E293B]/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-300">Standard Retrieval (Cosine)</td>
                <td className="px-6 py-4 text-red-400">18%</td>
                <td className="px-6 py-4 text-red-400">22%</td>
                <td className="px-6 py-4 text-yellow-400">80%</td>
              </tr>
              <tr className="hover:bg-[#1E293B]/50 transition-colors bg-cyan-900/10">
                <td className="px-6 py-4 font-bold text-cyan-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Composite + Auto-Resolve
                </td>
                <td className="px-6 py-4 text-green-400 font-semibold">92%</td>
                <td className="px-6 py-4 text-green-400 font-semibold">1.4%</td>
                <td className="px-6 py-4 text-green-400 font-semibold">8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

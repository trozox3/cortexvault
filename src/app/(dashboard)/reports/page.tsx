"use client";

import { useState } from 'react';
import { FileText, Loader2, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ReportsPage() {
  const [topic, setTopic] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateReport = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setReport(data.report || data.error);
    } catch (e) {
      console.error(e);
      setReport('Failed to generate report.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports Generator</h1>
        <p className="text-slate-400 mt-2">Generate comprehensive business reports based on your indexed documents.</p>
      </div>

      <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Report Topic</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Q3 Financial Risk Assessment" 
            className="w-full bg-[#1E293B] border border-[#334155] rounded-md px-4 py-2 text-white focus:border-cyan-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && generateReport()}
          />
        </div>
        <button 
          onClick={generateReport}
          disabled={isLoading || !topic}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 text-white px-6 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors h-[42px]"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {isLoading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {report && (
        <div className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl p-8 overflow-y-auto prose prose-invert prose-cyan max-w-none">
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { Shield, Search, Layers, Workflow, Network, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans">
      {/* Navigation */}
      <nav className="border-b border-[#1E293B] bg-[#0B1120]/80 backdrop-blur fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">CortexVault</span>
            </div>
            <div className="flex gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md transition-colors">
                Sign In
              </Link>
              <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-800/50 text-cyan-400 text-xs font-medium tracking-wide uppercase mb-4">
            <SparklesIcon className="w-4 h-4" />
            Enterprise Document Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
            Your Documents. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Now a Living Brain.
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover hidden knowledge, compare policies, detect risks, and generate evidence-backed insights across your entire organization's documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2">
              Start Workspace <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="#features" className="bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white px-8 py-4 rounded-lg text-base font-semibold transition-colors flex items-center justify-center">
              Explore Features
            </Link>
          </div>
          
          <p className="text-sm text-slate-500 mt-8 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" /> Enterprise-grade security. SOC2 Type II Certified.
          </p>
        </div>

        {/* Feature Grid */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-cyan-400" />}
            title="Evidence-First RAG"
            description="Every answer includes exact page citations. No hallucinations, only traceable facts."
          />
          <FeatureCard 
            icon={<Layers className="w-6 h-6 text-cyan-400" />}
            title="Conflict Radar"
            description="Automatically detect contradictions and policy discrepancies across thousands of documents."
          />
          <FeatureCard 
            icon={<Network className="w-6 h-6 text-cyan-400" />}
            title="Knowledge Graph"
            description="Visualize relationships between contracts, organizations, and obligations."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl hover:border-[#334155] transition-colors relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900/10 rounded-bl-full -z-10 group-hover:bg-cyan-900/20 transition-colors"></div>
      <div className="bg-[#1E293B] w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  )
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  )
}

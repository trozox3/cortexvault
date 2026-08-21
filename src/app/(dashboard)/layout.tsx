import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#020617] text-slate-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-[#334155] bg-[#0F172A] flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center">
            {/* Context aware breadcrumbs could go here */}
            <h2 className="text-lg font-semibold">Northstar Dynamics Workspace</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">
              Demo Mode
            </span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 bg-[#020617]">
          {children}
        </div>
      </main>
    </div>
  );
}

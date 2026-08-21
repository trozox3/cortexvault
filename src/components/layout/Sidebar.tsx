import Link from 'next/link';
import { LayoutDashboard, FileText, MessageSquare, Scale, AlertTriangle, Network, Workflow, FileBarChart, Settings } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Knowledge Workspace', href: '/workspace', icon: FileText },
  { name: 'Intelligence Chat', href: '/chat', icon: MessageSquare },
  { name: 'Compare Studio', href: '/compare', icon: Scale },
  { name: 'Conflict Radar', href: '/conflicts', icon: AlertTriangle },
  { name: 'Knowledge Graph', href: '/graph', icon: Network },
  { name: 'Workflow Builder', href: '/workflows', icon: Workflow },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-[#0B1120] border-r border-[#334155] min-h-screen">
      <div className="flex items-center justify-center h-16 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">CortexVault</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white group transition-colors"
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-[#334155]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
            AA
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Alice Admin</p>
            <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">Northstar Dynamics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, Scale, AlertTriangle, Network, Workflow, FileBarChart, Settings, LogOut } from 'lucide-react';

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
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error(e);
    }
  };

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
              className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-[#1E293B] hover:text-white group transition-colors"
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
      <div className="p-4 border-t border-[#334155] flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
            U
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Active User</p>
            <p className="text-xs font-medium text-slate-400">Online</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#334155] transition-colors" title="Log out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

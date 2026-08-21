"use client";

import { useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mockGraphNodes, mockGraphEdges } from '@/lib/db/mockData';

const initialNodes: Node[] = mockGraphNodes.map((node, i) => ({
  id: node.id,
  position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 }, // Simple random layout for demo
  data: { label: node.label },
  style: { 
    background: node.group === 'Organization' ? '#1E293B' : node.group === 'Document' ? '#0F172A' : '#334155',
    color: '#F8FAFC',
    border: `1px solid ${node.group === 'Organization' ? '#06B6D4' : '#334155'}`,
    borderRadius: '8px',
    padding: '10px 15px',
    fontSize: '12px'
  }
}));

const initialEdges: Edge[] = mockGraphEdges.map(edge => ({
  id: `e-${edge.source}-${edge.target}`,
  source: edge.source,
  target: edge.target,
  label: edge.label,
  animated: edge.animated,
  style: edge.style || { stroke: '#64748B' },
  labelStyle: { fill: '#94A3B8', fontSize: 10, fontWeight: 500 },
  labelBgStyle: { fill: '#0B1120' }
}));

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Graph</h1>
        <p className="text-slate-400 text-sm mt-1">Interactive visualization of entity relationships and policy dependencies.</p>
      </div>

      <div className="bg-[#0B1120] border border-[#334155] rounded-xl flex-1 overflow-hidden shadow-lg relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Background color="#334155" gap={16} />
          <Controls className="bg-[#1E293B] border border-[#334155] fill-white" />
        </ReactFlow>
        <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur border border-[#334155] p-3 rounded-lg text-xs space-y-2">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#1E293B] border border-[#06B6D4]"></div><span className="text-slate-300">Organization</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#0F172A] border border-[#334155]"></div><span className="text-slate-300">Document</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-[#334155] border border-[#334155]"></div><span className="text-slate-300">Obligation</span></div>
        </div>
      </div>
    </div>
  );
}

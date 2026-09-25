"use client";

import { useCallback, useState, useEffect } from 'react';
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

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => {
        if (data.documents) {
          const newNodes: Node[] = [
            {
              id: 'root',
              position: { x: 400, y: 100 },
              data: { label: 'CortexVault Knowledge Base' },
              style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #06B6D4', borderRadius: '8px', padding: '10px' }
            }
          ];
          const newEdges: Edge[] = [];

          data.documents.forEach((doc: any, index: number) => {
            newNodes.push({
              id: doc.id,
              position: { x: 200 + (index * 200), y: 300 },
              data: { label: doc.title },
              style: { background: '#0F172A', color: '#F8FAFC', border: '1px solid #334155', borderRadius: '8px', padding: '10px' }
            });
            newEdges.push({
              id: `e-root-${doc.id}`,
              source: 'root',
              target: doc.id,
              animated: true,
              style: { stroke: '#06B6D4' }
            });
          });

          setNodes(newNodes);
          setEdges(newEdges);
        }
      });
  }, [setNodes, setEdges]);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Knowledge Graph</h1>
        <p className="text-slate-400 text-sm mt-1">Visualizing {nodes.length - 1 > 0 ? nodes.length - 1 : 0} documents in your workspace.</p>
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
      </div>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import {
  Share2,
  Filter,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { KnowledgeGraphNode, KnowledgeGraphEdge } from '../types/index.ts';

interface KnowledgeGraphViewProps {
  onSelectDoctorByName?: (name: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  onSelectDoctorByName,
}) => {
  const [graphData, setGraphData] = useState<{ nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] }>({
    nodes: [],
    edges: [],
  });
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    fetch('/api/knowledge-graph')
      .then((res) => res.json())
      .then((data) => setGraphData(data))
      .catch((err) => console.error(err));
  }, []);

  const nodeTypes = useMemo(() => {
    return Array.from(new Set(graphData.nodes.map((n) => n.type)));
  }, [graphData]);

  // Color mapping by node type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Doctor':
        return '#0d9488'; // Teal
      case 'Specialization':
        return '#4f46e5'; // Indigo
      case 'Hospital':
        return '#0284c7'; // Sky
      case 'City':
        return '#e11d48'; // Rose
      case 'Qualification':
        return '#d97706'; // Amber
      case 'Organization':
        return '#059669'; // Emerald
      default:
        return '#64748b'; // Slate
    }
  };

  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      if (selectedType !== 'all' && node.type !== selectedType) return false;
      if (searchFilter.trim() && !node.label.toLowerCase().includes(searchFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [graphData.nodes, selectedType, searchFilter]);

  // Compute positions in an orderly circular/cluster layout for SVG visualization
  const positionedNodes = useMemo(() => {
    const width = 800;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    const count = filteredNodes.length;
    return filteredNodes.map((node, i) => {
      // Stratify by type
      let radius = 220;
      if (node.type === 'Doctor') radius = 120;
      else if (node.type === 'Specialization') radius = 170;
      else if (node.type === 'Hospital') radius = 240;
      else radius = 270;

      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      return {
        ...node,
        x,
        y,
        color: getNodeColor(node.type),
      };
    });
  }, [filteredNodes]);

  const positionedNodeMap = useMemo(() => {
    const map = new Map<string, typeof positionedNodes[0]>();
    positionedNodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [positionedNodes]);

  // Edges that connect visible nodes
  const visibleEdges = useMemo(() => {
    return graphData.edges
      .filter((edge) => positionedNodeMap.has(edge.source) && positionedNodeMap.has(edge.target))
      .map((edge) => ({
        ...edge,
        sourceNode: positionedNodeMap.get(edge.source)!,
        targetNode: positionedNodeMap.get(edge.target)!,
      }));
  }, [graphData.edges, positionedNodeMap]);

  // Connected nodes of selected node
  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return graphData.edges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
  }, [selectedNode, graphData.edges]);

  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    connectedEdges.forEach((e) => {
      set.add(e.source);
      set.add(e.target);
    });
    return set;
  }, [connectedEdges]);

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-full max-w-7xl mx-auto flex flex-col">
      {/* Top Title and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Knowledge Graph Explorer & Semantic Traversal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Traverse entities (Doctors, Hospitals, Specialties, Cities, Qualifications) and multi-hop clinical links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-slate-400 px-1">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedNode(null);
                setSearchFilter('');
                setSelectedType('all');
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-600"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-7 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Entity Types ({graphData.nodes.length})</option>
            {nodeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span>Doctor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>Specialization</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>Hospital</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>City</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>Qualification</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Graph View & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px]">
        {/* Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg
              viewBox="0 0 800 550"
              className="w-full h-full max-h-[550px] select-none"
            >
              {/* Edges */}
              {visibleEdges.map((edge) => {
                const isHighlighted =
                  selectedNode &&
                  (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={edge.sourceNode.x}
                      y1={edge.sourceNode.y}
                      x2={edge.targetNode.x}
                      y2={edge.targetNode.y}
                      stroke={isHighlighted ? '#2dd4bf' : '#334155'}
                      strokeWidth={isHighlighted ? 2 : 1}
                      strokeDasharray={edge.relationship === 'offers' ? '3 3' : undefined}
                      opacity={selectedNode && !isHighlighted ? 0.2 : 0.7}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {positionedNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = selectedNode && connectedNodeIds.has(node.id);
                const opacity = selectedNode && !isSelected && !isConnected ? 0.3 : 1;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-all duration-150"
                    opacity={opacity}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.type === 'Doctor' ? 18 : 13}
                      fill={node.color}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="hover:scale-110 transition-transform origin-center"
                    />
                    <text
                      x={node.x}
                      y={node.y + (node.type === 'Doctor' ? 28 : 22)}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize={node.type === 'Doctor' ? 10 : 9}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="pointer-events-none drop-shadow-md"
                    >
                      {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            Click any node to inspect relationship hops
          </div>
        </div>

        {/* Node Inspector & Multi-Hop Traversal Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase inline-block mb-1"
                  style={{ backgroundColor: getNodeColor(selectedNode.type) }}
                >
                  {selectedNode.type}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {selectedNode.label}
                </h3>
              </div>

              {/* Node Properties */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-700">Entity Properties</div>
                {Object.keys(selectedNode.properties).length === 0 ? (
                  <span className="text-slate-400 text-[11px]">No custom properties</span>
                ) : (
                  Object.entries(selectedNode.properties).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] text-slate-600">
                      <span className="capitalize">{k}:</span>
                      <span className="font-semibold text-slate-800">{String(v)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>Connected Relations ({connectedEdges.length})</span>
                  <span className="text-[10px] text-teal-700 font-semibold">1-Hop Distance</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {connectedEdges.map((e) => {
                    const isOutgoing = e.source === selectedNode.id;
                    const otherNodeId = isOutgoing ? e.target : e.source;
                    const otherNode = graphData.nodes.find((n) => n.id === otherNodeId);

                    return (
                      <div
                        key={e.id}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="text-teal-700 font-bold block">{e.relationship}</span>
                          <span className="text-slate-800 font-medium">
                            {otherNode?.label || otherNodeId}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-white border border-slate-200 text-slate-500">
                          {otherNode?.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedNode.type === 'Doctor' && onSelectDoctorByName && (
                <button
                  onClick={() => onSelectDoctorByName(selectedNode.label)}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  Open Full Doctor Dossier
                </button>
              )}
            </div>
          ) : (
            <div className="p-8 text-center my-auto space-y-3">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Select an Entity Node</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click any Doctor, Hospital, Specialty, or City in the knowledge graph to view clinical relationships and traversal paths.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Multi-hop queries enrich vector retrieval with structural hospital links.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

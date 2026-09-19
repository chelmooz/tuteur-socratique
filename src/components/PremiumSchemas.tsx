/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';

export interface SchemaConfig {
  type: 'flow' | 'loop' | 'compare' | 'balance' | 'stack' | 'timeline' | 'architecture' | 'pipeline' | 'decision_tree' | 'iceberg' | 'matrix' | 'pyramid';
  title: string;
  nodes: Array<{ 
    label: string; 
    detail?: string; 
    badge?: string;
    color?: string;
    position?: { x: number; y: number };
  }>;
  edges?: Array<{ from: number; to: number; label?: string; animated?: boolean }>;
  config?: {
    width?: number;
    height?: number;
    animated?: boolean;
    interactive?: boolean;
  };
}

export const PremiumSchema: React.FC<{ 
  config: SchemaConfig; 
  className?: string;
  interactive?: boolean;
  onNodeClick?: (nodeIndex: number, node: SchemaConfig['nodes'][0]) => void;
}> = ({ 
  config, 
  className = '', 
  interactive = false,
  onNodeClick 
}) => {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { nodes, edges = [], title, config: schemaConfig } = config;
  const { width = 900, height = 400, animated = true, interactive: configInteractive = true } = schemaConfig || {};

  const isInteractive = interactive && configInteractive;

  const nodePositions = useMemo(() => {
    return calculatePositions(nodes, width, height, config.type);
  }, [nodes, width, height, config.type]);

  function calculatePositions(nodes: SchemaConfig['nodes'], w: number, h: number, type: string) {
    const positions: Array<{ x: number; y: number }> = [];
    const n = nodes.length;
    
    switch (type) {
      case 'flow':
      case 'pipeline':
        const startX = 60;
        const endX = w - 60;
        const y = h / 2;
        nodes.forEach((_, i) => {
          const x = startX + (i / Math.max(1, n - 1)) * (endX - startX);
          positions.push({ x, y });
        });
        break;
        
      case 'loop':
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = Math.min(w, h) * 0.3;
        nodes.forEach((_, i) => {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2;
          positions.push({ 
            x: centerX + Math.cos(angle) * radius, 
            y: centerY + Math.sin(angle) * radius * 0.7 
          });
        });
        break;
        
      case 'compare':
        nodes.forEach((_, i) => {
          const x = i === 0 ? w * 0.25 : w * 0.75;
          const y = h / 2;
          positions.push({ x, y });
        });
        break;
        
      case 'balance':
        nodes.forEach((_, i) => {
          const x = i === 0 ? w * 0.25 : w * 0.75;
          const y = h / 2;
          positions.push({ x, y });
        });
        break;
        
      case 'stack':
        const stackH = 80;
        const startY = (h - (n - 1) * stackH) / 2;
        nodes.forEach((_, i) => {
          positions.push({ x: w / 2, y: startY + i * stackH });
        });
        break;
        
      case 'timeline':
        const startXt = 60;
        const endXt = w - 60;
        nodes.forEach((_, i) => {
          const x = startXt + (i / Math.max(1, n - 1)) * (endXt - startXt);
          const y = h / 2 + (i % 2 === 0 ? -60 : 60);
          positions.push({ x, y });
        });
        break;
        
      case 'architecture':
        const layerH = 60;
        const startYa = (h - (n - 1) * layerH) / 2;
        nodes.forEach((_, i) => {
          positions.push({ x: w / 2, y: startYa + i * layerH });
        });
        break;
        
      case 'decision_tree':
        const rootY = 60;
        positions.push({ x: w / 2, y: rootY });
        if (n > 1) {
          const childCount = n - 1;
          const spacing = w / (childCount + 1);
          for (let i = 1; i < n; i++) {
            positions.push({ x: i * spacing, y: 200 });
          }
        }
        break;
        
      case 'iceberg':
        nodes.forEach((_, i) => {
          const x = w / 2;
          const y = h * (0.15 + i * 0.8 / Math.max(1, n - 1));
          positions.push({ x, y });
        });
        break;
        
      case 'matrix':
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const cellW = w / (cols + 1);
        const cellH = h / (rows + 1);
        nodes.forEach((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          positions.push({ x: (col + 1) * cellW, y: (row + 1) * cellH });
        });
        break;
        
      case 'pyramid':
        let idx = 0;
        for (let level = 0; level < n; level++) {
          const count = Math.min(n - idx, level + 1);
          const spacing = w / (count + 1);
          const y = 60 + level * 80;
          for (let j = 0; j < count && idx < n; j++) {
            positions.push({ x: (j + 1) * spacing, y });
            idx++;
          }
        }
        break;
        
      default:
        nodes.forEach((_, i) => {
          const x = 60 + (i / Math.max(1, n - 1)) * (w - 120);
          const y = h / 2;
          positions.push({ x, y });
        });
    }
    
    return positions;
  }

  const getNodeColor = (color?: string) => {
    const colors: Record<string, { fill: string; stroke: string; glow: string }> = {
      default: { fill: '#0f172a', stroke: '#64748b', glow: '#64748b' },
      green: { fill: '#052e16', stroke: '#22c55e', glow: '#22c55e' },
      red: { fill: '#450a0a', stroke: '#ef4444', glow: '#ef4444' },
      yellow: { fill: '#422006', stroke: '#f59e0b', glow: '#f59e0b' },
      purple: { fill: '#2e1065', stroke: '#a855f7', glow: '#a855f7' },
      cyan: { fill: '#0c1d3a', stroke: '#22d3ee', glow: '#22d3ee' },
      indigo: { fill: '#1e1b4b', stroke: '#6366f1', glow: '#6366f1' },
      rose: { fill: '#4a044e', stroke: '#f43f5e', glow: '#f43f5e' },
    };
    return colors[color || 'default'] || colors.default;
  }

  const nodeStyle = (index: number, node: SchemaConfig['nodes'][0]) => {
    const color = getNodeColor(node.color);
    const isActive = activeNode === index;
    const isHovered = hoveredNode === index;
    const scale = isActive ? 1.05 : isHovered ? 1.02 : 1;
    
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'center',
      transition: 'all 0.2s ease',
      filter: isActive ? 'drop-shadow(0 0 12px ' + color.glow + ')' : 'none',
    };
  };

  const edgePaths = edges.map((edge, i) => {
    const from = nodePositions[edge.from];
    const to = nodePositions[edge.to];
    if (!from || !to) return null;
    
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    
    const fromX = from.x + 50 * Math.cos(angle);
    const fromY = from.y + 50 * Math.sin(angle);
    const toX = to.x - 50 * Math.cos(angle);
    const toY = to.y - 50 * Math.sin(angle);
    
    return {
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      label: edge.label,
      animated: edge.animated,
      angle,
    };
  }).filter(Boolean) as Array<{ from: { x: number; y: number }; to: { x: number; y: number }; label?: string; animated?: boolean; angle: number }>;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-full"
        role="img"
        aria-label={title}
      >
        <defs>
          {/* Arrow markers */}
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
          </marker>
          <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#22c55e" />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
          </marker>
          
          {/* Gradient definitions for node fills */}
          <linearGradient id="node-gradient-default" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="node-gradient-green" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="node-gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <linearGradient id="node-gradient-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#713f12" />
            <stop offset="100%" stopColor="#422006" />
          </linearGradient>
          <linearGradient id="node-gradient-purple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b0764" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>
          <linearGradient id="node-gradient-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#164e63" />
            <stop offset="100%" stopColor="#0c1d3a" />
          </linearGradient>
          <linearGradient id="node-gradient-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="node-gradient-rose" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#701a75" />
            <stop offset="100%" stopColor="#4a044e" />
          </linearGradient>
          
          {/* Animated dash pattern */}
          <style>
            {`@keyframes dash-move { to { stroke-dashoffset: -16; } }`}
          </style>
        </defs>
        
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.03)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Edges */}
        <g>
          {edgePaths.map((edge, i) => {
            const originalEdge = edges[i];
            const fromColor = getNodeColor(nodes[originalEdge?.from]?.color);
            const toColor = getNodeColor(nodes[originalEdge?.to]?.color);
            
            return (
              <motion.path
                key={`edge-${i}`}
                d={`M ${edge.from.x} ${edge.from.y} Q ${(edge.from.x + edge.to.x) / 2} ${(edge.from.y + edge.to.y) / 2 + 20} ${edge.to.x} ${edge.to.y}`}
                stroke="url(#edge-gradient)"
                strokeWidth={2}
                fill="none"
                strokeDasharray={edge.animated ? "8 8" : "none"}
                style={{
                  strokeDasharray: edge.animated ? "8 8" : "none",
                  animation: edge.animated ? 'dashMove 1s linear infinite' : 'none',
                }}
                markerEnd={`url(#arrowhead-${i % 2 === 0 ? '' : 'green'})`}
              >
                {edge.animated && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-16"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </motion.path>
            );
          })}
        </g>
        
        {/* Edge labels */}
        {edges.map((edge, i) => {
          const from = nodePositions[edge.from];
          const to = nodePositions[edge.to];
          if (!from || !to || !edge.label) return null;
          
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2 - 15;
          
          return (
            <text key={`edge-label-${i}`} x={mx} y={my} textAnchor="middle" fontSize="11" fontWeight="600" fill="#94a3b8" fontFamily="system-ui, sans-serif" paintOrder="stroke" stroke="#0f172a" strokeWidth="3">
              {edge.label}
            </text>
          );
        })}
        
        {/* Nodes */}
        <g>
          {nodes.map((node, i) => {
            const pos = nodePositions[i];
            if (!pos) return null;
            
            const colors = getNodeColor(node.color);
            const isActive = activeNode === i;
            const isHovered = hoveredNode === i;
            const scale = activeNode === i ? 1.05 : hoveredNode === i ? 1.02 : 1;
            
            return (
              <g
                key={`node-${i}`}
                transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => { if (onNodeClick) onNodeClick(i, node); setActiveNode(prev => prev === i ? null : i); }}
                style={{ cursor: onNodeClick ? 'pointer' : 'default', transition: 'transform 0.2s ease' }}
                filter={activeNode === i ? `drop-shadow(0 0 16px ${colors.glow})` : 'none'}
              >
                {/* Node shape */}
                <motion.rect
                  x="-100"
                  y="-35"
                  width="200"
                  height="70"
                  rx="16"
                  fill={`url(#node-gradient-${node.color || 'default'})`}
                  stroke={colors.stroke}
                  strokeWidth={isActive ? 3 : 2}
                  strokeDasharray="none"
                  className="node-shape"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    filter: activeNode === i ? `drop-shadow(0 0 16px ${colors.glow})` : 'none',
                    transition: 'filter 0.2s ease',
                  }}
                />
                
                {/* Badge */}
                {node.badge && (
                  <text x="0" y="-45" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f59e0b" fontFamily="system-ui, sans-serif" paintOrder="stroke" stroke="#0f172a" strokeWidth="2">
                    {node.badge}
                  </text>
                )}
                
                {/* Main label */}
                <text x="0" y="-2" textAnchor="middle" fontSize="13" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui, sans-serif" paintOrder="stroke" stroke="#0f172a" strokeWidth="2">
                  {node.label}
                </text>
                
                {/* Detail */}
                {node.detail && (
                  <text x="0" y="18" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="system-ui, sans-serif">
                    {node.detail}
                  </text>
                )}
                
                {/* Active indicator */}
                {activeNode === i && (
                  <motion.circle
                    cx="0"
                    cy="40"
                    r={6}
                    fill="#22c55e"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </g>
            );
          })}
        </g>
        
        {/* Title */}
        <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="700" fill="#e2e8f0" fontFamily="system-ui, sans-serif" paintOrder="stroke" stroke="#0f172a" strokeWidth="2">
          {title}
        </text>
      </svg>
      
      {/* Node detail panel */}
      {activeNode !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl animate-slideIn"
        >
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-xl bg-${nodes[activeNode].color || 'slate'}-500/20 text-${nodes[activeNode].color || 'slate'}-400 border border-${nodes[activeNode].color || 'slate'}-500/30`}>
              {config.nodes[activeNode].badge && <span className="text-xs font-bold mr-2">{config.nodes[activeNode].badge}</span>}
              <span className="font-bold">{config.nodes[activeNode].label}</span>
            </div>
            <button
              onClick={() => setActiveNode(null)}
              className="ml-auto p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">{config.nodes[activeNode].detail}</p>
          <div className="mt-3 flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Type: {config.type}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
              {config.nodes.length} nœuds
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Specific schema components for common patterns
export const FlowSchema: React.FC<{ 
  nodes: Array<{ label: string; detail?: string; badge?: string; color?: string }>;
  title: string;
  className?: string;
}> = ({ nodes, title, className }) => (
  <PremiumSchema 
    config={{ type: 'flow', title, nodes }} 
    className={className} 
    interactive={true}
  />
);

export const CompareSchema: React.FC<{ 
  left: { label: string; detail?: string; items?: string[] };
  right: { label: string; detail?: string; items?: string[] };
  title: string;
  className?: string;
}> = ({ left, right, title, className }) => (
  <PremiumSchema 
    config={{ 
      type: 'compare', 
      title, 
      nodes: [
        { label: left.label, detail: left.detail, color: 'red', badge: 'Avant' },
        { label: right.label, detail: right.detail, color: 'green', badge: 'Après' }
      ]
    }} 
    className={className} 
    interactive={true}
  />
);

export const LoopSchema: React.FC<{ 
  nodes: Array<{ label: string; detail?: string; badge?: string; color?: string }>;
  title: string;
  className?: string;
}> = ({ nodes, title, className }) => (
  <PremiumSchema 
    config={{ type: 'loop', title, nodes }} 
    className={className} 
    interactive={true}
  />
);

export const StackSchema: React.FC<{ 
  layers: Array<{ label: string; detail?: string; badge?: string; color?: string }>;
  title: string;
  className?: string;
}> = ({ layers, title, className }) => (
  <PremiumSchema 
    config={{ type: 'stack', title, nodes: layers }} 
    className={className} 
    interactive={true}
  />
);

export const TimelineSchema: React.FC<{ 
  events: Array<{ label: string; detail?: string; badge?: string; color?: string; date?: string }>;
  title: string;
  className?: string;
}> = ({ events, title, className }) => (
  <PremiumSchema 
    config={{ type: 'timeline', title, nodes: events }} 
    className={className} 
    interactive={true}
  />
);

export const ArchitectureSchema: React.FC<{ 
  layers: Array<{ label: string; detail?: string; badge?: string; color?: string }>;
  title: string;
  className?: string;
}> = ({ layers, title, className }) => (
  <PremiumSchema 
    config={{ type: 'architecture', title, nodes: layers }} 
    className={className} 
    interactive={true}
  />
);

export const PipelineSchema: React.FC<{ 
  steps: Array<{ label: string; detail?: string; badge?: string; color?: string; metric?: string }>;
  title: string;
  className?: string;
}> = ({ steps, title, className }) => (
  <PremiumSchema 
    config={{ 
      type: 'pipeline', 
      title, 
      nodes: steps.map(s => ({ 
        label: s.label, 
        detail: s.detail, 
        badge: s.badge || s.metric, 
        color: s.color 
      }))
    }} 
    className={className} 
    interactive={true}
  />
);

export const BalanceSchema: React.FC<{ 
  left: { label: string; detail?: string; weight?: number };
  right: { label: string; detail?: string; weight?: number };
  title: string;
  className?: string;
}> = ({ left, right, title, className }) => (
  <PremiumSchema 
    config={{ 
      type: 'balance', 
      title, 
      nodes: [
        { label: left.label, detail: left.detail, color: 'red', badge: `Poids: ${left.weight || '?'}` },
        { label: right.label, detail: right.detail, color: 'green', badge: `Poids: ${right.weight || '?'}` }
      ]
    }} 
    className={className} 
    interactive={true}
  />
);

export const IcebergSchema: React.FC<{ 
  visible: { label: string; detail?: string };
  hidden: { label: string; detail?: string };
  title: string;
  className?: string;
}> = ({ visible, hidden, title, className }) => (
  <PremiumSchema 
    config={{ 
      type: 'iceberg', 
      title, 
      nodes: [
        { label: visible.label, detail: visible.detail, color: 'cyan', badge: 'Visible' },
        { label: hidden.label, detail: hidden.detail, color: 'indigo', badge: 'Caché' }
      ]
    }} 
    className={className} 
    interactive={true}
  />
);

export const MatrixSchema: React.FC<{ 
  cells: Array<{ label: string; detail?: string; row: number; col: number; color?: string }>;
  rows: number;
  cols: number;
  title: string;
  className?: string;
}> = ({ cells, rows, cols, title, className }) => (
  <PremiumSchema 
    config={{ 
      type: 'matrix', 
      title, 
      nodes: cells 
    }} 
    className={className} 
    interactive={true}
  />
);

export const PyramidSchema: React.FC<{ 
  levels: Array<{ label: string; detail?: string; count: number; color?: string }>;
  title: string;
  className?: string;
}> = ({ levels, title, className }) => {
  const nodes = levels.flatMap((level, i) => 
    Array(level.count).fill(null).map((_, j) => ({
      label: level.label + (level.count > 1 ? ` ${j + 1}` : ''),
      detail: level.detail,
      color: level.color,
      badge: `Niveau ${i + 1}`
    }))
  );
  
  return <PremiumSchema config={{ type: 'pyramid', title, nodes }} className={className} interactive={true} />;
};

export { PremiumSchema as default };
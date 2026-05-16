'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEditorStore, type SavedTemplate } from '../store/editor';
import { ECOMMERCE_TEMPLATE } from '../templates/ecommerce';
import {
  Layers2, Plus, Search, ShoppingCart, Clock, Trash2,
  ChevronRight, Zap, GitBranch, FileSpreadsheet,
  Database, Star, ArrowRight, Package,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BUILTIN: SavedTemplate[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    icon: '🛒',
    description: 'User auth, Product catalog, Category tree, Order processing, Inventory management, Reviews — with hooks, file registries, CRUD, and aggregations.',
    nodes: ECOMMERCE_TEMPLATE.nodes as SavedTemplate['nodes'],
    edges: ECOMMERCE_TEMPLATE.edges,
    savedAt: 0,
    isBuiltIn: true,
    tags: ['mongoose', 'e-commerce', 'production', 'full-stack'],
    models: ['User', 'Product', 'Category', 'Order', 'Inventory', 'Review'],
  },
];

const MODEL_COLORS: Record<string, string> = {
  User: '#6366f1', Product: '#f59e0b', Category: '#34d399',
  Order: '#38bdf8', Inventory: '#fb923c', Review: '#f472b6',
};

function NodeTypePill({ label, color, count }: { label: string; color: string; count: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 9, padding: '2px 6px', borderRadius: 4,
      background: `${color}12`, color, border: `1px solid ${color}20`,
    }}>
      {label}
      <span style={{ background: `${color}25`, borderRadius: 2, padding: '0 3px', fontWeight: 700 }}>{count}</span>
    </span>
  );
}

function TemplateCard({ tpl, isBuiltIn = false, onOpen, onDelete }: {
  tpl: SavedTemplate; isBuiltIn?: boolean;
  onOpen: (t: SavedTemplate) => void;
  onDelete?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const nodeTypes = tpl.nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.type ?? 'unknown'] = (acc[n.type ?? 'unknown'] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(tpl)}
      style={{
        background: hovered ? '#111113' : '#0d0d10',
        border: `1px solid ${hovered ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.2s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)' : '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Preview */}
      <div style={{
        height: 116, background: '#09090b', padding: 14,
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {(tpl.models ?? []).slice(0, 6).map((m) => (
            <div key={m} style={{
              background: `${MODEL_COLORS[m] ?? '#6366f1'}10`,
              border: `1px solid ${MODEL_COLORS[m] ?? '#6366f1'}20`,
              borderRadius: 6, padding: '3px 8px',
              fontSize: 9, color: MODEL_COLORS[m] ?? '#818cf8', fontWeight: 600,
            }}>
              {m}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 28, lineHeight: 1 }}>
          {tpl.icon}
        </div>
        {isBuiltIn && (
          <div style={{
            position: 'absolute', bottom: 8, left: 10,
            display: 'flex', alignItems: 'center', gap: 3,
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)',
            borderRadius: 4, padding: '2px 6px',
            fontSize: 8, color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <Star size={7} fill="currentColor" /> Built-in
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', flex: 1 }}>
        <h3 style={{ color: '#f4f4f5', fontSize: 13, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          {tpl.name}
        </h3>
        <p style={{
          color: '#52525b', fontSize: 10, margin: '0 0 10px', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {tpl.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {(nodeTypes['modelNode'] ?? 0) > 0 && <NodeTypePill label="models" color="#6366f1" count={nodeTypes['modelNode']} />}
          {(nodeTypes['hookNode'] ?? 0) > 0 && <NodeTypePill label="hooks" color="#f59e0b" count={nodeTypes['hookNode']} />}
          {(nodeTypes['fileRegistryNode'] ?? 0) > 0 && <NodeTypePill label="registries" color="#34d399" count={nodeTypes['fileRegistryNode']} />}
          {(nodeTypes['controlNode'] ?? 0) > 0 && <NodeTypePill label="control" color="#f472b6" count={nodeTypes['controlNode']} />}
          {(nodeTypes['crudNode'] ?? 0) > 0 && <NodeTypePill label="crud" color="#38bdf8" count={nodeTypes['crudNode']} />}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 9, color: '#3f3f46' }}>
          {isBuiltIn ? 'Ready to use' : new Date(tpl.savedAt).toLocaleDateString()}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {!isBuiltIn && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(tpl.id); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3f3f46', display: 'flex', padding: 2, borderRadius: 4, transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#f87171'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#3f3f46'}
            >
              <Trash2 size={11} />
            </button>
          )}
          <span style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: 2, fontSize: 10 }}>
            Open <ChevronRight size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { savedTemplates, loadTemplate, deleteTemplate } = useEditorStore();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
const router = useRouter();

  useEffect(() => setMounted(true), []);

  const allTemplates = [...BUILTIN, ...(mounted ? savedTemplates : [])];
  const filtered = allTemplates.filter((t) =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.tags ?? []).some((tag) => tag.includes(search.toLowerCase()))
  );

  const handleOpen = (tpl: SavedTemplate) => {
    loadTemplate(tpl);
      router.push('/editor'); // ← in-memory state preserved

  };

  const features = [
    { icon: <Database size={14} />, color: '#6366f1', label: 'Model Schemas', desc: 'Mongoose schemas with typed fields, indexes, and relations' },
    { icon: <Zap size={14} />, color: '#f59e0b', label: 'Hook Registry', desc: 'pre/post middleware with watch-field triggers and conditions' },
    { icon: <GitBranch size={14} />, color: '#f472b6', label: 'Control Flow', desc: 'if/else, map, filter, reduce, forEach, try-catch nodes' },
    { icon: <FileSpreadsheet size={14} />, color: '#34d399', label: 'File Registries', desc: 'CSV/XLSX → MongoDB with batch dispatch and transforms' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#e4e4e7', fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>

      {/* Nav */}
      <nav style={{
        height: 52, borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px',
        background: 'rgba(9,9,11,0.98)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers2 size={13} color="white" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.03em', color: '#f4f4f5' }}>BackFlow</span>
          <span style={{ fontSize: 8, padding: '1px 5px', borderRadius: 3, background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', letterSpacing: '0.05em' }}>beta</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ position: 'relative', width: 220 }}>
          <Search size={11} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#52525b' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e4e4e7', fontSize: 11, borderRadius: 8, padding: '6px 10px 6px 26px', outline: 'none',
            }}
          />
        </div>

        <Link href="/editor" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          color: 'white', fontSize: 11, fontWeight: 700,
          borderRadius: 8, padding: '6px 14px', textDecoration: 'none',
          boxShadow: '0 0 20px rgba(99,102,241,0.3)',
        }}>
          <Plus size={11} /> New blank
        </Link>
      </nav>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '48px 24px' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', marginBottom: 60 }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.06)',
              borderRadius: 999, padding: '4px 12px', fontSize: 10, color: '#818cf8', marginBottom: 20,
            }}>
              <Package size={10} /> Visual backend builder
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: '#f4f4f5', letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 16px' }}>
              Design backends<br />
              <span style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7 50%, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                like a canvas.
              </span>
            </h1>
            <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, maxWidth: 460, margin: '0 0 24px' }}>
              Schema nodes, hooks, control flow, and file pipelines. Wire them visually and export production-ready TypeScript.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/editor" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 18px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', fontSize: 12,
                fontWeight: 700, borderRadius: 9, textDecoration: 'none', boxShadow: '0 0 20px rgba(99,102,241,0.3)',
              }}>
                Start building <ArrowRight size={12} />
              </Link>
              <button
                onClick={() => handleOpen(BUILTIN[0])}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 18px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#a1a1aa', fontSize: 12, borderRadius: 9, cursor: 'pointer',
                }}
              >
                <ShoppingCart size={12} /> E-commerce demo
              </button>
            </div>
          </div>

          {/* Feature grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 360 }}>
            {features.map((f) => (
              <div key={f.label} style={{
                background: '#0d0d10', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '12px',
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: `${f.color}12`, border: `1px solid ${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 8 }}>
                  {f.icon}
                </div>
                <p style={{ color: '#e4e4e7', fontSize: 11, fontWeight: 700, margin: '0 0 3px' }}>{f.label}</p>
                <p style={{ color: '#52525b', fontSize: 9, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 700, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
              {search ? `Results for "${search}"` : 'All Templates'}
            </h2>
            <p style={{ color: '#52525b', fontSize: 10, margin: 0 }}>{filtered.length} template{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/editor" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#71717a', fontSize: 10, borderRadius: 7, padding: '6px 12px', textDecoration: 'none',
          }}>
            <Plus size={10} /> Blank canvas
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              isBuiltIn={tpl.isBuiltIn}
              onOpen={handleOpen}
              onDelete={!tpl.isBuiltIn ? deleteTemplate : undefined}
            />
          ))}
        </div>

        {/* Recent saved */}
        {mounted && savedTemplates.length > 0 && !search && (
          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Clock size={11} style={{ color: '#52525b' }} />
              <h2 style={{ color: '#71717a', fontSize: 12, fontWeight: 600, margin: 0 }}>Your saved templates</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12 }}>
              {savedTemplates.map((tpl) => (
                <TemplateCard key={tpl.id} tpl={tpl} onOpen={handleOpen} onDelete={deleteTemplate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
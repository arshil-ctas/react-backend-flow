'use client';

import React, { useState } from 'react';
import { useEditorStore, type SavedTemplate } from '../../store/editor';
import { ECOMMERCE_TEMPLATE } from '../../templates/ecommerce';
import {
  X, Plus, Save, FlaskConical, ChevronDown,
  Layers2, ShoppingCart, FileText,
} from 'lucide-react';

const BUILTIN_ICONS: Record<string, React.ReactNode> = {
  ecommerce: <ShoppingCart size={11} />,
};

function getTabLabel(id: string, savedTemplates: SavedTemplate[]): { label: string; icon: React.ReactNode } {
  if (id === 'ecommerce') return { label: 'E-Commerce', icon: BUILTIN_ICONS.ecommerce };
  const tpl = savedTemplates.find((t) => t.id === id);
  if (tpl) return { label: tpl.name, icon: <span style={{ fontSize: 12 }}>{tpl.icon}</span> };
  return { label: id, icon: <FileText size={11} /> };
}

export function TabBar() {
  const {
    tabs, activeTab, openTab, closeTab,
    savedTemplates, loadTemplate, nodes, edges,
    saveCurrentAs, testPanelOpen, setTestPanelOpen,
  } = useEditorStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveIcon, setSaveIcon] = useState('📁');
  const [saveDesc, setSaveDesc] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const allTemplates: SavedTemplate[] = [
    {
      id: 'ecommerce',
      name: 'E-Commerce Platform',
      icon: '🛒',
      description: 'Full e-commerce backend with 6 models',
      nodes: ECOMMERCE_TEMPLATE.nodes as SavedTemplate['nodes'],
      edges: ECOMMERCE_TEMPLATE.edges,
      savedAt: 0,
      isBuiltIn: true,
      tags: ['built-in'],
      models: ECOMMERCE_TEMPLATE.models,
    },
    ...savedTemplates,
  ];

  const handleTabClick = (id: string) => {
    const tpl = allTemplates.find((t) => t.id === id);
    if (tpl) loadTemplate(tpl);
    else openTab(id);
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveCurrentAs(saveName.trim(), saveIcon, saveDesc);
    setSaveModalOpen(false);
    setSaveName('');
    setSaveDesc('');
  };

  return (
    <>
      <div style={{
        height: 36,
        background: 'rgba(9,9,11,0.99)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        zIndex: 30,
      }}>
        {/* Logo mark */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 14px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 5,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers2 size={10} color="white" />
          </div>
          <span style={{ color: '#f4f4f5', fontSize: 11, fontWeight: 800, letterSpacing: '-0.02em' }}>
            BackFlow
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', alignItems: 'stretch', flex: 1,
          overflowX: 'auto', overflowY: 'hidden',
        }}
          className="tabs-scroll"
        >
          {tabs.map((id) => {
            const { label, icon } = getTabLabel(id, savedTemplates);
            const isActive = id === activeTab;
            return (
              <div
                key={id}
                onClick={() => handleTabClick(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0 12px 0 10px',
                  borderRight: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  minWidth: 0, flexShrink: 0,
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                  borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                <span style={{ color: isActive ? '#818cf8' : '#52525b' }}>{icon}</span>
                <span style={{
                  color: isActive ? '#e4e4e7' : '#71717a',
                  fontSize: 11, whiteSpace: 'nowrap',
                  maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {label}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(id); }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#52525b', display: 'flex', alignItems: 'center',
                    padding: '1px', borderRadius: 3, marginLeft: 2,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#e4e4e7'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#52525b'}
                >
                  <X size={10} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          padding: '0 8px',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {/* Open template dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#71717a', fontSize: 10, padding: '4px 8px', borderRadius: 5,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e4e4e7';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'none';
                (e.currentTarget as HTMLButtonElement).style.color = '#71717a';
              }}
            >
              <Plus size={11} />
              <span>Open</span>
              <ChevronDown size={9} />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: '#18181b', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: 6, minWidth: 220,
                boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
              }}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <p style={{ color: '#3f3f46', fontSize: 9, padding: '2px 6px 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Templates
                </p>
                {allTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => { loadTemplate(tpl); setDropdownOpen(false); }}
                    style={{
                      width: '100%', textAlign: 'left', background: 'none',
                      border: 'none', cursor: 'pointer', padding: '7px 8px',
                      borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
                  >
                    <span style={{ fontSize: 14 }}>{tpl.icon}</span>
                    <div>
                      <p style={{ color: '#e4e4e7', fontSize: 11, margin: 0, fontWeight: 600 }}>{tpl.name}</p>
                      <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>{tpl.nodes.length} nodes · {tpl.isBuiltIn ? 'built-in' : 'saved'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={() => setSaveModalOpen(true)}
            disabled={nodes.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              color: nodes.length > 0 ? '#71717a' : '#3f3f46',
              fontSize: 10, padding: '4px 8px', borderRadius: 5,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (nodes.length > 0) {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e4e4e7';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = nodes.length > 0 ? '#71717a' : '#3f3f46';
            }}
          >
            <Save size={11} />
            <span>Save</span>
          </button>

          {/* Test */}
          <button
            onClick={() => setTestPanelOpen(!testPanelOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: testPanelOpen ? 'rgba(52,211,153,0.1)' : 'none',
              border: 'none', cursor: 'pointer',
              color: testPanelOpen ? '#34d399' : '#71717a',
              fontSize: 10, padding: '4px 8px', borderRadius: 5,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <FlaskConical size={11} />
            <span>Test</span>
          </button>
        </div>
      </div>

      {/* Save modal */}
      {saveModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={() => setSaveModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: 24, width: 360,
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ color: '#f4f4f5', fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>
              Save template
            </h3>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={saveIcon}
                onChange={(e) => setSaveIcon(e.target.value)}
                style={{
                  width: 44, background: '#09090b', border: '1px solid #27272a',
                  color: '#f4f4f5', borderRadius: 8, padding: '8px', fontSize: 18,
                  textAlign: 'center', outline: 'none',
                }}
              />
              <input
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Template name"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                style={{
                  flex: 1, background: '#09090b', border: '1px solid #27272a',
                  color: '#f4f4f5', borderRadius: 8, padding: '8px 12px',
                  fontSize: 13, outline: 'none',
                }}
              />
            </div>

            <textarea
              value={saveDesc}
              onChange={(e) => setSaveDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              style={{
                width: '100%', background: '#09090b', border: '1px solid #27272a',
                color: '#a1a1aa', borderRadius: 8, padding: '8px 12px',
                fontSize: 12, outline: 'none', resize: 'none', marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSaveModalOpen(false)}
                style={{
                  background: 'none', border: '1px solid #27272a', color: '#71717a',
                  borderRadius: 8, padding: '7px 16px', fontSize: 12, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  border: 'none', color: 'white',
                  borderRadius: 8, padding: '7px 16px', fontSize: 12,
                  cursor: saveName.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tabs-scroll::-webkit-scrollbar { height: 2px; }
        .tabs-scroll::-webkit-scrollbar-thumb { background: #27272a; }
      `}</style>
    </>
  );
}
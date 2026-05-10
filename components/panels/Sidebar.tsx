'use client';

import React from 'react';
import { useEditorStore } from '../../store/editor';
import {
    Database, Zap, GitBranch, FileSpreadsheet, Terminal,
    ChevronLeft, ChevronRight, Layers2,
} from 'lucide-react';

const NODE_PALETTE = [
    {
        type: 'modelNode',
        label: 'Model / Schema',
        description: 'Mongoose schema with fields',
        icon: <Database size={15} />,
        color: '#6366f1',
    },
    {
        type: 'hookNode',
        label: 'Hook Registry',
        description: 'pre/post middleware',
        icon: <Zap size={15} />,
        color: '#f59e0b',
    },
    {
        type: 'controlNode',
        label: 'Control Flow',
        description: 'if, map, filter, reduce…',
        icon: <GitBranch size={15} />,
        color: '#f472b6',
    },
    {
        type: 'fileRegistryNode',
        label: 'File Registry',
        description: 'CSV/Excel upload pipeline',
        icon: <FileSpreadsheet size={15} />,
        color: '#34d399',
    },
    {
        type: 'crudNode',
        label: 'CRUD Operation',
        description: 'find, create, update, delete',
        icon: <Terminal size={15} />,
        color: '#38bdf8',
    },
];

export function Sidebar() {
    const { addNode, sidebarOpen, setSidebarOpen } = useEditorStore();

    const handleAdd = (type: string) => {
        // Place in center-ish of canvas
        addNode(type, {
            x: 200 + Math.random() * 100,
            y: 100 + Math.random() * 200,
        });
    };

    return (
        <div
            style={{
                width: sidebarOpen ? 220 : 48,
                minWidth: sidebarOpen ? 220 : 48,
                background: 'rgba(9,9,11,0.98)',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.2s ease, min-width 0.2s ease',
                overflow: 'hidden',
                backdropFilter: 'blur(16px)',
                zIndex: 10,
                flexShrink: 0,
            }}
        >
            {/* Toggle button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#71717a', display: 'flex', alignItems: 'center',
                    justifyContent: sidebarOpen ? 'flex-end' : 'center',
                    padding: '12px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'justify-content 0.2s',
                }}
                title={sidebarOpen ? 'Collapse' : 'Expand'}
            >
                {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {sidebarOpen && (
                <>
                    {/* Logo */}
                    <div style={{ padding: '16px 14px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 9,
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Layers2 size={14} color="white" />
                            </div>
                            <div>
                                <p style={{ color: '#f4f4f5', fontSize: 12, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>BackFlow</p>
                                <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>visual backend builder</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Nodes */}
                    <div style={{ padding: '0 10px' }}>
                        <p style={{
                            color: '#3f3f46', fontSize: 9, fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            padding: '8px 4px 6px',
                        }}>
                            Add Nodes
                        </p>

                        {NODE_PALETTE.map((item) => (
                            <button
                                key={item.type}
                                onClick={() => handleAdd(item.type)}
                                style={{
                                    width: '100%', background: 'none', border: 'none',
                                    cursor: 'pointer', textAlign: 'left',
                                    padding: '8px 8px',
                                    borderRadius: 10, marginBottom: 2,
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = `${item.color}10`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = 'none';
                                }}
                            >
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                                    background: `${item.color}15`, border: `1px solid ${item.color}25`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.color,
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <p style={{ color: '#e4e4e7', fontSize: 11, fontWeight: 600, margin: 0 }}>
                                        {item.label}
                                    </p>
                                    <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Tips */}
                    <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: '#3f3f46', fontSize: 9, lineHeight: 1.6, margin: 0 }}>
                            Click any node to add it to canvas. Drag handles to connect nodes. ObjectId fields create relation edges.
                        </p>
                    </div>
                </>
            )}

            {/* Collapsed: icon-only */}
            {!sidebarOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 8 }}>
                    {NODE_PALETTE.map((item) => (
                        <button
                            key={item.type}
                            onClick={() => handleAdd(item.type)}
                            title={item.label}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                width: 32, height: 32, borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: item.color, transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = `${item.color}15`;
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLButtonElement).style.background = 'none';
                            }}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
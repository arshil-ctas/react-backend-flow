'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { FileRegistryNodeData, ColumnBehaviour, FileOperation, FileDataShape, EmptyRowHandling } from '../../types';
import { useEditorStore } from '../../store/editor';
import { FileSpreadsheet, Plus, Trash2, ChevronDown, ChevronRight, Fingerprint, ArrowUpDown } from 'lucide-react';

const OPERATIONS: FileOperation[] = ['create', 'update', 'upsert', 'delete', 'bulkWrite'];
const SHAPES: FileDataShape[] = ['array-of-objects', 'flat-csv', 'array-of-arrays'];
const EMPTY_ROW: EmptyRowHandling[] = ['skip', 'error', 'useDefault'];
const OP_COLORS: Record<FileOperation, string> = {
    create: '#34d399', update: '#38bdf8', upsert: '#a78bfa',
    delete: '#f87171', bulkWrite: '#fbbf24',
};

function ColumnRow({ col, onUpdate, onDelete }: {
    col: ColumnBehaviour;
    onUpdate: (id: string, patch: Partial<ColumnBehaviour>) => void;
    onDelete: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', cursor: 'pointer' }}
                onClick={() => setExpanded((e) => !e)}
            >
                {col.isIdentity && (
                    <Fingerprint size={9} style={{ color: '#fbbf24', flexShrink: 0 }} />
                )}
                <input
                    value={col.header}
                    onChange={(e) => onUpdate(col.header, { header: e.target.value })}
                    onClick={(ev) => ev.stopPropagation()}
                    placeholder="CSV header"
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        color: '#e4e4e7', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                    }}
                />
                <span style={{ color: '#52525b', fontSize: 9 }}>→</span>
                <input
                    value={col.fieldPath}
                    onChange={(e) => onUpdate(col.header, { fieldPath: e.target.value })}
                    onClick={(ev) => ev.stopPropagation()}
                    placeholder="model.field"
                    style={{
                        width: 90, background: 'transparent', border: 'none', outline: 'none',
                        color: '#38bdf8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                    }}
                />
                <span style={{ color: '#52525b' }}>{expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(col.header); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', display: 'flex', padding: 2 }}
                >
                    <Trash2 size={10} />
                </button>
            </div>
            {expanded && (
                <div style={{
                    padding: '6px 10px 10px', background: 'rgba(0,0,0,0.2)',
                    display: 'flex', flexWrap: 'wrap', gap: 6,
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a' }}>
                        <input type="checkbox" checked={!!col.isIdentity} onChange={(e) => onUpdate(col.header, { isIdentity: e.target.checked })} style={{ accentColor: '#fbbf24' }} />
                        <span>identity key</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a' }}>
                        <input type="checkbox" checked={!!col.required} onChange={(e) => onUpdate(col.header, { required: e.target.checked })} style={{ accentColor: '#f87171' }} />
                        <span>required</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a' }}>
                        <input type="checkbox" checked={!!col.skip} onChange={(e) => onUpdate(col.header, { skip: e.target.checked })} />
                        <span>skip col</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a' }}>
                        <input type="checkbox" checked={!!col.autoIncrement} onChange={(e) => onUpdate(col.header, { autoIncrement: e.target.checked })} style={{ accentColor: '#fb923c' }} />
                        <span>auto-increment</span>
                    </label>
                    {col.autoIncrement && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a', width: '100%' }}>
                            <span style={{ width: 60 }}>start</span>
                            <input
                                type="number"
                                value={col.autoIncrementStart ?? 1}
                                onChange={(e) => onUpdate(col.header, { autoIncrementStart: Number(e.target.value) })}
                                style={{ width: 50, background: '#09090b', border: '1px solid #27272a', color: '#fb923c', fontSize: 10, borderRadius: 4, padding: '2px 4px', outline: 'none' }}
                            />
                            <span>step</span>
                            <input
                                type="number"
                                value={col.autoIncrementStep ?? 1}
                                onChange={(e) => onUpdate(col.header, { autoIncrementStep: Number(e.target.value) })}
                                style={{ width: 50, background: '#09090b', border: '1px solid #27272a', color: '#fb923c', fontSize: 10, borderRadius: 4, padding: '2px 4px', outline: 'none' }}
                            />
                        </label>
                    )}
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a', width: '100%' }}>
                        <span style={{ width: 60, flexShrink: 0 }}>transform</span>
                        <input
                            value={col.transform ?? ''}
                            onChange={(e) => onUpdate(col.header, { transform: e.target.value })}
                            placeholder="(v) => v.trim().toLowerCase()"
                            style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', color: '#fbbf24', fontFamily: 'monospace', fontSize: 10, borderRadius: 4, padding: '2px 5px', outline: 'none' }}
                        />
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a', width: '100%' }}>
                        <span style={{ width: 60, flexShrink: 0 }}>default</span>
                        <input
                            value={col.defaultValue ?? ''}
                            onChange={(e) => onUpdate(col.header, { defaultValue: e.target.value })}
                            placeholder="null"
                            style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', color: '#a1a1aa', fontSize: 10, borderRadius: 4, padding: '2px 5px', outline: 'none' }}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}

export function FileRegistryNode({ id, data, selected }: NodeProps) {
    const nodeData = data as FileRegistryNodeData;
    const { updateNodeData } = useEditorStore();
    const opColor = OP_COLORS[nodeData.operation];

    const addColumn = () => {
        const col: ColumnBehaviour = {
            header: `col_${Date.now()}`,
            fieldPath: '',
        };
        updateNodeData(id, { columns: [...nodeData.columns, col] });
    };

    const updateColumn = (header: string, patch: Partial<ColumnBehaviour>) => {
        updateNodeData(id, {
            columns: nodeData.columns.map((c) =>
                c.header === header ? { ...c, ...patch } : c,
            ),
        });
    };

    const deleteColumn = (header: string) => {
        updateNodeData(id, { columns: nodeData.columns.filter((c) => c.header !== header) });
    };

    return (
        <div style={{
            background: 'rgba(9,9,11,0.97)',
            border: selected ? `1.5px solid ${opColor}88` : `1px solid ${opColor}20`,
            borderRadius: 16, width: 320, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
            <Handle type="target" position={Position.Left}
                style={{ background: opColor, width: 10, height: 10, border: '2px solid #09090b' }} />

            {/* Header */}
            <div style={{
                padding: '12px 12px 8px', borderBottom: `1px solid ${opColor}15`,
                background: `${opColor}07`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 26, height: 26, borderRadius: 8,
                        background: `${opColor}15`, border: `1px solid ${opColor}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: opColor,
                    }}>
                        <FileSpreadsheet size={13} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            value={nodeData.registryName}
                            onChange={(e) => updateNodeData(id, { registryName: e.target.value })}
                            style={{
                                background: 'transparent', border: 'none', outline: 'none',
                                color: '#f4f4f5', fontSize: 13, fontWeight: 700,
                                width: '100%', letterSpacing: '-0.02em',
                            }}
                            placeholder="Registry Name"
                        />
                        <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>file upload registry</p>
                    </div>
                </div>

                {/* Operation + shape row */}
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <select
                        value={nodeData.operation}
                        onChange={(e) => updateNodeData(id, { operation: e.target.value as FileOperation })}
                        style={{
                            background: `${opColor}15`, border: `1px solid ${opColor}25`,
                            color: opColor, fontSize: 10, fontWeight: 600, borderRadius: 6,
                            padding: '3px 8px', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        {OPERATIONS.map((o) => <option key={o} value={o} style={{ background: '#18181b', color: OP_COLORS[o] }}>{o}</option>)}
                    </select>

                    <select
                        value={nodeData.arrayConfig.shape}
                        onChange={(e) => updateNodeData(id, { arrayConfig: { ...nodeData.arrayConfig, shape: e.target.value as FileDataShape } })}
                        style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a',
                            color: '#a1a1aa', fontSize: 10, borderRadius: 6,
                            padding: '3px 8px', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        {SHAPES.map((s) => <option key={s} value={s} style={{ background: '#18181b' }}>{s}</option>)}
                    </select>

                    <select
                        value={nodeData.arrayConfig.emptyRowHandling}
                        onChange={(e) => updateNodeData(id, { arrayConfig: { ...nodeData.arrayConfig, emptyRowHandling: e.target.value as EmptyRowHandling } })}
                        style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a',
                            color: '#71717a', fontSize: 10, borderRadius: 6,
                            padding: '3px 8px', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        {EMPTY_ROW.map((e) => <option key={e} value={e} style={{ background: '#18181b' }}>empty→{e}</option>)}
                    </select>
                </div>

                {/* Batch + conditional dispatch */}
                <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#71717a' }}>
                        <ArrowUpDown size={10} />
                        <span>batch</span>
                        <input
                            type="number"
                            value={nodeData.batchSize ?? 500}
                            onChange={(e) => updateNodeData(id, { batchSize: Number(e.target.value) })}
                            style={{
                                width: 52, background: '#09090b', border: '1px solid #27272a',
                                color: '#a1a1aa', fontSize: 10, borderRadius: 4, padding: '2px 4px',
                                outline: 'none', textAlign: 'center',
                            }}
                        />
                    </label>
                    <input
                        value={nodeData.conditionalDispatch ?? ''}
                        onChange={(e) => updateNodeData(id, { conditionalDispatch: e.target.value })}
                        placeholder="row.type === 'new' ? 'create' : 'update'"
                        title="Conditional dispatch expression"
                        style={{
                            flex: 1, background: '#09090b', border: '1px solid #27272a',
                            color: '#fbbf24', fontFamily: 'monospace', fontSize: 9,
                            borderRadius: 4, padding: '3px 6px', outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Column count bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 10px', background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 10, color: '#52525b',
            }}>
                <span>{nodeData.columns.length} columns mapped</span>
                <button
                    onClick={addColumn}
                    style={{
                        background: `${opColor}10`, border: `1px solid ${opColor}20`,
                        color: opColor, borderRadius: 5, padding: '2px 8px', fontSize: 10,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                    }}
                >
                    <Plus size={10} /> column
                </button>
            </div>

            {/* Columns */}
            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {nodeData.columns.map((col) => (
                    <ColumnRow key={col.header} col={col} onUpdate={updateColumn} onDelete={deleteColumn} />
                ))}
                {nodeData.columns.length === 0 && (
                    <p style={{ padding: 14, textAlign: 'center', color: '#52525b', fontSize: 11 }}>
                        Map CSV/Excel headers → model fields
                    </p>
                )}
            </div>

            <Handle type="source" position={Position.Right}
                style={{ background: opColor, width: 10, height: 10, border: '2px solid #09090b' }} />
        </div>
    );
}
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { CrudNodeData, CrudOperation } from '../../types';
import { useEditorStore } from '../../store/editor';
import { Terminal } from 'lucide-react';

const OPERATIONS: CrudOperation[] = [
    'find', 'findOne', 'create', 'updateOne', 'updateMany',
    'deleteOne', 'deleteMany', 'aggregate',
];

const OP_STYLES: Record<CrudOperation, { color: string; label: string }> = {
    find: { color: '#38bdf8', label: 'GET many' },
    findOne: { color: '#67e8f9', label: 'GET one' },
    create: { color: '#34d399', label: 'POST' },
    updateOne: { color: '#fbbf24', label: 'PATCH one' },
    updateMany: { color: '#fb923c', label: 'PATCH many' },
    deleteOne: { color: '#f87171', label: 'DELETE one' },
    deleteMany: { color: '#ef4444', label: 'DELETE many' },
    aggregate: { color: '#a78bfa', label: 'AGGREGATE' },
};

export function CrudNode({ id, data, selected }: NodeProps) {
    const nodeData = data as CrudNodeData;
    const { updateNodeData } = useEditorStore();
    const style = OP_STYLES[nodeData.operation];

    return (
        <div style={{
            background: 'rgba(9,9,11,0.97)',
            border: selected ? `1.5px solid ${style.color}88` : `1px solid ${style.color}20`,
            borderRadius: 14, width: 240, overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}>
            <Handle type="target" position={Position.Left}
                style={{ background: style.color, width: 10, height: 10, border: '2px solid #09090b' }} />

            {/* Header */}
            <div style={{
                padding: '10px 12px 8px', borderBottom: `1px solid ${style.color}15`,
                background: `${style.color}07`,
                display: 'flex', alignItems: 'center', gap: 8,
            }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 7,
                    background: `${style.color}18`, border: `1px solid ${style.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: style.color,
                }}>
                    <Terminal size={12} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <select
                            value={nodeData.operation}
                            onChange={(e) => updateNodeData(id, { operation: e.target.value as CrudOperation })}
                            style={{
                                background: 'transparent', border: 'none', outline: 'none',
                                color: style.color, fontSize: 13, fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                            }}
                        >
                            {OPERATIONS.map((op) => (
                                <option key={op} value={op} style={{ background: '#18181b', color: OP_STYLES[op].color }}>
                                    {op}
                                </option>
                            ))}
                        </select>
                        <span style={{
                            fontSize: 9, padding: '1px 5px', borderRadius: 3,
                            background: `${style.color}15`, color: style.color,
                        }}>
                            {style.label}
                        </span>
                    </div>
                    <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>CRUD operation</p>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 10, color: '#71717a', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span>model</span>
                    <input
                        value={nodeData.model ?? ''}
                        onChange={(e) => updateNodeData(id, { model: e.target.value })}
                        placeholder="User"
                        style={{
                            background: '#09090b', border: '1px solid #27272a',
                            color: '#e4e4e7', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
                            borderRadius: 5, padding: '4px 7px', outline: 'none',
                        }}
                    />
                </label>
                <label style={{ fontSize: 10, color: '#71717a', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span>filter</span>
                    <input
                        value={nodeData.filter ?? '{}'}
                        onChange={(e) => updateNodeData(id, { filter: e.target.value })}
                        placeholder='{ active: true }'
                        style={{
                            background: '#09090b', border: '1px solid #27272a',
                            color: '#38bdf8', fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                            borderRadius: 5, padding: '4px 7px', outline: 'none',
                        }}
                    />
                </label>
                {!['find', 'findOne', 'deleteOne', 'deleteMany'].includes(nodeData.operation) && (
                    <label style={{ fontSize: 10, color: '#71717a', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span>payload</span>
                        <textarea
                            rows={2}
                            value={nodeData.payload ?? '{}'}
                            onChange={(e) => updateNodeData(id, { payload: e.target.value })}
                            placeholder='{ $set: { status: "active" } }'
                            style={{
                                background: '#09090b', border: '1px solid #27272a',
                                color: '#34d399', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                                borderRadius: 5, padding: '4px 7px', outline: 'none', resize: 'vertical',
                            }}
                        />
                    </label>
                )}
            </div>

            <Handle type="source" position={Position.Right}
                style={{ background: style.color, width: 10, height: 10, border: '2px solid #09090b' }} />
        </div>
    );
}
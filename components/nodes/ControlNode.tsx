'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { ControlNodeData, ControlFlowType } from '../../types';
import { useEditorStore } from '../../store/editor';
import {
    GitBranch, Repeat, Filter, Layers, ArrowRight, Shuffle,
    AlertTriangle, List,
} from 'lucide-react';

const CONTROL_CONFIG: Record<ControlFlowType, {
    label: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    fields: string[];
}> = {
    if: {
        label: 'if', color: '#f472b6',
        icon: <GitBranch size={13} />,
        description: 'Conditional branch',
        fields: ['condition'],
    },
    else: {
        label: 'else', color: '#fb923c',
        icon: <GitBranch size={13} style={{ transform: 'scaleX(-1)' }} />,
        description: 'Fallback branch',
        fields: [],
    },
    map: {
        label: 'map', color: '#38bdf8',
        icon: <Repeat size={13} />,
        description: 'Transform each item',
        fields: ['iteratorVar', 'body'],
    },
    filter: {
        label: 'filter', color: '#34d399',
        icon: <Filter size={13} />,
        description: 'Keep matching items',
        fields: ['iteratorVar', 'condition'],
    },
    reduce: {
        label: 'reduce', color: '#a78bfa',
        icon: <Layers size={13} />,
        description: 'Accumulate to single value',
        fields: ['iteratorVar', 'accumulator', 'body'],
    },
    forEach: {
        label: 'forEach', color: '#fb923c',
        icon: <Repeat size={13} />,
        description: 'Side-effect iteration',
        fields: ['iteratorVar', 'body'],
    },
    objectKeys: {
        label: 'Object.keys', color: '#fbbf24',
        icon: <List size={13} />,
        description: 'Iterate object keys',
        fields: ['iteratorVar'],
    },
    objectValues: {
        label: 'Object.values', color: '#fbbf24',
        icon: <List size={13} />,
        description: 'Iterate object values',
        fields: ['iteratorVar'],
    },
    objectEntries: {
        label: 'Object.entries', color: '#fbbf24',
        icon: <Shuffle size={13} />,
        description: 'Iterate [key, value] pairs',
        fields: ['iteratorVar'],
    },
    switch: {
        label: 'switch', color: '#c084fc',
        icon: <ArrowRight size={13} />,
        description: 'Multi-case dispatch',
        fields: ['condition'],
    },
    'try-catch': {
        label: 'try/catch', color: '#f87171',
        icon: <AlertTriangle size={13} />,
        description: 'Error boundary',
        fields: ['body'],
    },
};

const ALL_TYPES = Object.keys(CONTROL_CONFIG) as ControlFlowType[];

const FIELD_LABELS: Record<string, string> = {
    condition: 'condition',
    iteratorVar: 'as',
    accumulator: 'acc',
    body: 'body',
};

export function ControlNode({ id, data, selected }: NodeProps) {
    const nodeData = data as ControlNodeData;
    const { updateNodeData } = useEditorStore();
    const cfg = CONTROL_CONFIG[nodeData.controlType];

    return (
        <div style={{
            background: 'rgba(9,9,11,0.97)',
            border: selected
                ? `1.5px solid ${cfg.color}99`
                : `1px solid ${cfg.color}22`,
            borderRadius: 14, width: 220, overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}>
            <Handle type="target" position={Position.Left}
                style={{ background: cfg.color, width: 10, height: 10, border: '2px solid #09090b' }} />

            {/* Header */}
            <div style={{
                padding: '10px 12px 8px',
                borderBottom: `1px solid ${cfg.color}15`,
                background: `${cfg.color}08`,
                display: 'flex', alignItems: 'center', gap: 8,
            }}>
                <div style={{
                    width: 24, height: 24, borderRadius: 7,
                    background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cfg.color, flexShrink: 0,
                }}>
                    {cfg.icon}
                </div>
                <div style={{ flex: 1 }}>
                    <select
                        value={nodeData.controlType}
                        onChange={(e) => updateNodeData(id, { controlType: e.target.value as ControlFlowType })}
                        style={{
                            background: 'transparent', border: 'none', outline: 'none',
                            color: cfg.color, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {ALL_TYPES.map((t) => (
                            <option key={t} value={t} style={{ background: '#18181b', color: '#e4e4e7' }}>
                                {CONTROL_CONFIG[t].label}
                            </option>
                        ))}
                    </select>
                    <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>{cfg.description}</p>
                </div>
            </div>

            {/* Fields */}
            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cfg.fields.map((field) => (
                    <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
                        <span style={{ color: '#52525b', width: 48, flexShrink: 0, textAlign: 'right' }}>
                            {FIELD_LABELS[field] ?? field}
                        </span>
                        {field === 'body' ? (
                            <textarea
                                rows={2}
                                value={(nodeData as Record<string, string>)[field] ?? ''}
                                onChange={(e) => updateNodeData(id, { [field]: e.target.value })}
                                placeholder={field === 'body' ? 'return item * 2' : ''}
                                style={{
                                    flex: 1, background: '#09090b', border: `1px solid ${cfg.color}20`,
                                    color: cfg.color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                                    borderRadius: 5, padding: '3px 6px', outline: 'none', resize: 'vertical',
                                }}
                            />
                        ) : (
                            <input
                                value={(nodeData as Record<string, string>)[field] ?? ''}
                                onChange={(e) => updateNodeData(id, { [field]: e.target.value })}
                                placeholder={field === 'condition' ? 'item.active === true' : field === 'iteratorVar' ? 'item' : '0'}
                                style={{
                                    flex: 1, background: '#09090b', border: `1px solid ${cfg.color}20`,
                                    color: cfg.color, fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                                    borderRadius: 5, padding: '3px 6px', outline: 'none',
                                }}
                            />
                        )}
                    </label>
                ))}
            </div>

            {/* Handles */}
            <Handle type="source" position={Position.Right}
                style={{ background: cfg.color, width: 10, height: 10, border: '2px solid #09090b' }}
                id="default" />
            {nodeData.controlType === 'if' && (
                <Handle type="source" position={Position.Bottom}
                    style={{ background: '#fb923c', width: 10, height: 10, border: '2px solid #09090b' }}
                    id="else" />
            )}
        </div>
    );
}
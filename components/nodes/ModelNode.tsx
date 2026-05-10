'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { ModelNodeData, ModelField, FieldType } from '../../types';
import { useEditorStore } from '../../store/editor';
import {
    Database, Plus, Trash2, Key, Link2, ChevronDown, ChevronRight,
    ToggleLeft, Hash, AlignLeft, Calendar, Binary, Layers, Fingerprint,
} from 'lucide-react';

const FIELD_TYPE_COLORS: Record<FieldType, string> = {
    String: '#22d3ee',
    Number: '#f59e0b',
    Boolean: '#84cc16',
    Date: '#f472b6',
    ObjectId: '#818cf8',
    Array: '#fb923c',
    Mixed: '#a1a1aa',
    Buffer: '#6ee7b7',
    Decimal128: '#fbbf24',
    Map: '#c084fc',
};

const FIELD_TYPE_ICONS: Record<FieldType, React.ReactNode> = {
    String: <AlignLeft size={10} />,
    Number: <Hash size={10} />,
    Boolean: <ToggleLeft size={10} />,
    Date: <Calendar size={10} />,
    ObjectId: <Link2 size={10} />,
    Array: <Layers size={10} />,
    Mixed: <Binary size={10} />,
    Buffer: <Binary size={10} />,
    Decimal128: <Hash size={10} />,
    Map: <Layers size={10} />,
};

const ALL_TYPES: FieldType[] = [
    'String', 'Number', 'Boolean', 'Date', 'ObjectId',
    'Array', 'Mixed', 'Buffer', 'Decimal128', 'Map',
];

type FieldRowProps = {
    field: ModelField;
    onUpdate: (id: string, patch: Partial<ModelField>) => void;
    onDelete: (id: string) => void;
    allModels: string[];
};

function FieldRow({ field, onUpdate, onDelete, allModels }: FieldRowProps) {
    const [expanded, setExpanded] = useState(false);
    const color = FIELD_TYPE_COLORS[field.type];

    return (
        <div className="field-row">
            <div
                className="field-main"
                onClick={() => setExpanded((e) => !e)}
            >
                {/* Identity indicator */}
                {field.isIdentity && (
                    <span className="identity-badge" title="Identity field">
                        <Fingerprint size={9} />
                    </span>
                )}

                {/* Field name */}
                <input
                    className="field-name-input"
                    value={field.name}
                    onChange={(e) => onUpdate(field.id, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="fieldName"
                />

                {/* Type badge */}
                <span className="type-badge" style={{ background: `${color}18`, color }}>
                    {FIELD_TYPE_ICONS[field.type]}
                    <select
                        value={field.type}
                        onChange={(e) => onUpdate(field.id, { type: e.target.value as FieldType })}
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: 'transparent', border: 'none', color, fontSize: 10, cursor: 'pointer', outline: 'none' }}
                    >
                        {ALL_TYPES.map((t) => (
                            <option key={t} value={t} style={{ background: '#18181b' }}>{t}</option>
                        ))}
                    </select>
                </span>

                {/* Expand toggle */}
                <span className="expand-toggle">
                    {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                </span>

                {/* Delete */}
                <button
                    className="delete-field-btn"
                    onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
                    title="Remove field"
                >
                    <Trash2 size={10} />
                </button>
            </div>

            {/* Expanded options */}
            {expanded && (
                <div className="field-options">
                    <label className="opt-row">
                        <input
                            type="checkbox"
                            checked={!!field.options.required}
                            onChange={(e) => onUpdate(field.id, { options: { ...field.options, required: e.target.checked } })}
                        />
                        <span>required</span>
                    </label>
                    <label className="opt-row">
                        <input
                            type="checkbox"
                            checked={!!field.options.unique}
                            onChange={(e) => onUpdate(field.id, { options: { ...field.options, unique: e.target.checked } })}
                        />
                        <span>unique</span>
                    </label>
                    <label className="opt-row">
                        <input
                            type="checkbox"
                            checked={!!field.isIdentity}
                            onChange={(e) => onUpdate(field.id, { isIdentity: e.target.checked })}
                        />
                        <span>identity (SKU / _id)</span>
                    </label>
                    <label className="opt-row">
                        <input
                            type="checkbox"
                            checked={!!field.options.autoIncrement}
                            onChange={(e) => onUpdate(field.id, { options: { ...field.options, autoIncrement: e.target.checked } })}
                        />
                        <span>auto-increment</span>
                    </label>
                    <label className="opt-row">
                        <input
                            type="checkbox"
                            checked={!!field.options.index}
                            onChange={(e) => onUpdate(field.id, { options: { ...field.options, index: e.target.checked } })}
                        />
                        <span>index</span>
                    </label>
                    {field.type === 'ObjectId' && (
                        <label className="opt-row full">
                            <span>ref →</span>
                            <select
                                value={field.options.ref ?? ''}
                                onChange={(e) => onUpdate(field.id, { options: { ...field.options, ref: e.target.value } })}
                                style={{ background: '#09090b', border: '1px solid #27272a', color: '#a1a1aa', borderRadius: 4, fontSize: 10, padding: '2px 4px' }}
                            >
                                <option value="">— none —</option>
                                {allModels.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                    )}
                    <label className="opt-row full">
                        <span>default</span>
                        <input
                            className="inline-text-input"
                            value={field.options.default ?? ''}
                            onChange={(e) => onUpdate(field.id, { options: { ...field.options, default: e.target.value } })}
                            placeholder="value"
                        />
                    </label>
                </div>
            )}

            {/* Handle for relation drawing — only on ObjectId fields */}
            {field.type === 'ObjectId' && (
                <Handle
                    type="source"
                    position={Position.Right}
                    id={`field-${field.id}`}
                    style={{
                        right: -6,
                        background: color,
                        width: 8,
                        height: 8,
                        border: '2px solid #18181b',
                    }}
                />
            )}

            <style>{`
        .field-row { border-bottom: 1px solid rgba(255,255,255,0.04); }
        .field-main {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 8px; cursor: pointer;
          transition: background 0.15s;
        }
        .field-main:hover { background: rgba(255,255,255,0.03); }
        .identity-badge {
          color: #fbbf24; display: flex; align-items: center;
          flex-shrink: 0;
        }
        .field-name-input {
          flex: 1; min-width: 0;
          background: transparent; border: none; outline: none;
          color: #e4e4e7; font-size: 11px; font-family: 'JetBrains Mono', monospace;
        }
        .field-name-input::placeholder { color: #52525b; }
        .type-badge {
          display: flex; align-items: center; gap: 3px;
          padding: 2px 6px; border-radius: 4px;
          font-size: 10px; font-weight: 500;
          white-space: nowrap; flex-shrink: 0;
        }
        .expand-toggle { color: #52525b; flex-shrink: 0; }
        .delete-field-btn {
          background: none; border: none; cursor: pointer;
          color: #52525b; display: flex; align-items: center;
          padding: 2px; border-radius: 3px; flex-shrink: 0;
          transition: color 0.15s;
        }
        .delete-field-btn:hover { color: #ef4444; }
        .field-options {
          display: flex; flex-wrap: wrap; gap: 6px;
          padding: 6px 10px 8px;
          background: rgba(0,0,0,0.2);
        }
        .opt-row {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: #71717a; cursor: pointer;
        }
        .opt-row input[type=checkbox] { accent-color: #6366f1; cursor: pointer; }
        .opt-row.full { width: 100%; }
        .inline-text-input {
          background: #09090b; border: 1px solid #27272a;
          color: #a1a1aa; border-radius: 4px; font-size: 10px;
          padding: 2px 5px; outline: none; width: 80px;
        }
      `}</style>
        </div>
    );
}

// ─── Model Node ──────────────────────────────────────────────────────────────
export function ModelNode({ id, data, selected }: NodeProps) {
    const nodeData = data as ModelNodeData;
    const { updateNodeData, nodes } = useEditorStore();

    const allModels = nodes
        .filter((n: any) => n.type === 'modelNode')
        .map((n: any) => (n.data as ModelNodeData).modelName);

    const addField = () => {
        const newField: ModelField = {
            id: `f_${Date.now()}`,
            name: 'newField',
            type: 'String',
            options: {},
        };
        updateNodeData(id, { fields: [...nodeData.fields, newField] });
    };

    const updateField = (fieldId: string, patch: Partial<ModelField>) => {
        updateNodeData(id, {
            fields: nodeData.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
        });
    };

    const deleteField = (fieldId: string) => {
        updateNodeData(id, {
            fields: nodeData.fields.filter((f) => f.id !== fieldId),
        });
    };

    return (
        <div
            className="model-node"
            style={{
                border: selected
                    ? '1.5px solid rgba(99,102,241,0.7)'
                    : '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Input handle */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#6366f1', width: 10, height: 10, border: '2px solid #09090b' }}
            />

            {/* Header */}
            <div className="model-header">
                <div className="model-icon">
                    <Database size={13} />
                </div>
                <div className="model-title-area">
                    <input
                        className="model-name-input"
                        value={nodeData.modelName}
                        onChange={(e) => updateNodeData(id, { modelName: e.target.value })}
                        placeholder="ModelName"
                    />
                    <span className="model-subtitle">mongoose schema</span>
                </div>
                <label className="ts-toggle" title="timestamps">
                    <input
                        type="checkbox"
                        checked={!!nodeData.timestamps}
                        onChange={(e) => updateNodeData(id, { timestamps: e.target.checked })}
                    />
                    <span>ts</span>
                </label>
            </div>

            {/* Field count bar */}
            <div className="field-count-bar">
                <span>{nodeData.fields.length} fields</span>
                <button className="add-field-btn" onClick={addField}>
                    <Plus size={10} /> add field
                </button>
            </div>

            {/* Fields */}
            <div className="fields-list">
                {nodeData.fields.map((field) => (
                    <FieldRow
                        key={field.id}
                        field={field}
                        onUpdate={updateField}
                        onDelete={deleteField}
                        allModels={allModels}
                    />
                ))}
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#6366f1', width: 10, height: 10, border: '2px solid #09090b' }}
            />

            <style>{`
        .model-node {
          background: rgba(9,9,11,0.97);
          border-radius: 16px;
          width: 280px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
          transition: border-color 0.2s;
        }
        .model-header {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 12px 8px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(99,102,241,0.06);
        }
        .model-icon {
          width: 26px; height: 26px;
          border-radius: 8px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #818cf8; flex-shrink: 0;
        }
        .model-title-area { flex: 1; min-width: 0; }
        .model-name-input {
          background: transparent; border: none; outline: none;
          color: #f4f4f5; font-size: 13px; font-weight: 700;
          width: 100%; font-family: inherit;
          letter-spacing: -0.02em;
        }
        .model-name-input::placeholder { color: #52525b; }
        .model-subtitle { display: block; font-size: 9px; color: #52525b; margin-top: 1px; }
        .ts-toggle {
          display: flex; align-items: center; gap: 3px;
          font-size: 9px; color: #6366f1; cursor: pointer;
          flex-shrink: 0;
        }
        .ts-toggle input { accent-color: #6366f1; }
        .field-count-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 5px 10px;
          background: rgba(255,255,255,0.02);
          font-size: 10px; color: #52525b;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .add-field-btn {
          display: flex; align-items: center; gap: 3px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8; font-size: 10px; cursor: pointer;
          border-radius: 5px; padding: 2px 7px;
          transition: all 0.15s;
        }
        .add-field-btn:hover { background: rgba(99,102,241,0.2); }
        .fields-list { max-height: 300px; overflow-y: auto; }
        .fields-list::-webkit-scrollbar { width: 3px; }
        .fields-list::-webkit-scrollbar-thumb { background: #27272a; border-radius: 2px; }
      `}</style>
        </div>
    );
}
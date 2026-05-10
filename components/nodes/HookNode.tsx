'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import type { HookNodeData, Hook, HookTiming, HookEvent, HookAction } from '../../types';
import { useEditorStore } from '../../store/editor';
import { Zap, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const EVENTS: HookEvent[] = ['save', 'update', 'findOneAndUpdate', 'remove', 'validate', 'init', 'deleteOne', 'insertMany'];
const ACTIONS: HookAction[] = ['hashPassword', 'generateSlug', 'autoIncrement', 'sendEmail', 'updateTimestamp', 'validateUnique', 'populateVirtuals', 'custom'];
const TIMINGS: HookTiming[] = ['pre', 'post'];

const TIMING_COLORS = { pre: '#f59e0b', post: '#34d399' };
const ACTION_COLORS: Record<HookAction, string> = {
    hashPassword: '#f472b6',
    generateSlug: '#38bdf8',
    autoIncrement: '#fb923c',
    sendEmail: '#a78bfa',
    updateTimestamp: '#4ade80',
    validateUnique: '#fbbf24',
    populateVirtuals: '#67e8f9',
    custom: '#94a3b8',
};

function HookRow({ hook, onUpdate, onDelete }: {
    hook: Hook;
    onUpdate: (id: string, patch: Partial<Hook>) => void;
    onDelete: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const timingColor = TIMING_COLORS[hook.timing];
    const actionColor = ACTION_COLORS[hook.action];

    return (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 10px', cursor: 'pointer',
                }}
                onClick={() => setExpanded((e) => !e)}
            >
                {/* Timing pill */}
                <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                    background: `${timingColor}18`, color: timingColor, flexShrink: 0,
                }}>
                    <select
                        value={hook.timing}
                        onChange={(e) => onUpdate(hook.id, { timing: e.target.value as HookTiming })}
                        onClick={(ev) => ev.stopPropagation()}
                        style={{ background: 'transparent', border: 'none', color: timingColor, fontSize: 9, cursor: 'pointer', outline: 'none', fontWeight: 700 }}
                    >
                        {TIMINGS.map((t) => <option key={t} value={t} style={{ background: '#18181b' }}>{t}</option>)}
                    </select>
                </span>

                {/* Event */}
                <select
                    value={hook.event}
                    onChange={(e) => onUpdate(hook.id, { event: e.target.value as HookEvent })}
                    onClick={(ev) => ev.stopPropagation()}
                    style={{
                        background: '#18181b', border: '1px solid #27272a',
                        color: '#a1a1aa', fontSize: 10, borderRadius: 4, padding: '2px 4px',
                        cursor: 'pointer', outline: 'none',
                    }}
                >
                    {EVENTS.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>

                {/* Action */}
                <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    background: `${actionColor}15`, color: actionColor, flex: 1, textAlign: 'right',
                }}>
                    {hook.action}
                </span>

                <span style={{ color: '#52525b', flexShrink: 0 }}>
                    {expanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(hook.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', display: 'flex', padding: 2 }}
                >
                    <Trash2 size={10} />
                </button>
            </div>

            {expanded && (
                <div style={{ padding: '6px 10px 10px', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* Action selector */}
                    <label style={{ fontSize: 10, color: '#71717a', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ width: 60, flexShrink: 0 }}>action</span>
                        <select
                            value={hook.action}
                            onChange={(e) => onUpdate(hook.id, { action: e.target.value as HookAction })}
                            style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', color: '#a1a1aa', fontSize: 10, borderRadius: 4, padding: '2px 4px', outline: 'none' }}
                        >
                            {ACTIONS.map((a) => <option key={a} value={a} style={{ background: '#18181b' }}>{a}</option>)}
                        </select>
                    </label>

                    {/* Watch fields */}
                    <label style={{ fontSize: 10, color: '#71717a', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ width: 60, flexShrink: 0 }}>watch</span>
                        <input
                            value={(hook.watchFields ?? []).join(',')}
                            onChange={(e) => onUpdate(hook.id, { watchFields: e.target.value.split(',').map((s) => s.trim()) })}
                            placeholder="field1, field2"
                            style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', color: '#a1a1aa', fontSize: 10, borderRadius: 4, padding: '2px 5px', outline: 'none' }}
                        />
                    </label>

                    {/* Condition */}
                    <label style={{ fontSize: 10, color: '#71717a', display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ width: 60, flexShrink: 0 }}>if</span>
                        <input
                            value={hook.condition ?? ''}
                            onChange={(e) => onUpdate(hook.id, { condition: e.target.value })}
                            placeholder="this.isModified('field')"
                            style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', color: '#fbbf24', fontFamily: 'monospace', fontSize: 10, borderRadius: 4, padding: '2px 5px', outline: 'none' }}
                        />
                    </label>

                    {/* Custom code */}
                    {hook.action === 'custom' && (
                        <label style={{ fontSize: 10, color: '#71717a', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span>custom code</span>
                            <textarea
                                value={hook.customCode ?? ''}
                                onChange={(e) => onUpdate(hook.id, { customCode: e.target.value })}
                                rows={3}
                                placeholder="async function(next) { ... }"
                                style={{
                                    background: '#09090b', border: '1px solid #27272a',
                                    color: '#67e8f9', fontFamily: 'monospace', fontSize: 10,
                                    borderRadius: 4, padding: '5px', outline: 'none',
                                    resize: 'vertical', width: '100%',
                                }}
                            />
                        </label>
                    )}
                </div>
            )}
        </div>
    );
}

export function HookNode({ id, data, selected }: NodeProps) {
    const nodeData = data as HookNodeData;
    const { updateNodeData } = useEditorStore();

    const addHook = () => {
        const newHook: Hook = {
            id: `h_${Date.now()}`,
            timing: 'pre',
            event: 'save',
            action: 'hashPassword',
        };
        updateNodeData(id, { hooks: [...nodeData.hooks, newHook] });
    };

    const updateHook = (hookId: string, patch: Partial<Hook>) => {
        updateNodeData(id, {
            hooks: nodeData.hooks.map((h) => (h.id === hookId ? { ...h, ...patch } : h)),
        });
    };

    const deleteHook = (hookId: string) => {
        updateNodeData(id, { hooks: nodeData.hooks.filter((h) => h.id !== hookId) });
    };

    return (
        <div style={{
            background: 'rgba(9,9,11,0.97)',
            border: selected ? '1.5px solid rgba(245,158,11,0.6)' : '1px solid rgba(245,158,11,0.15)',
            borderRadius: 16, width: 300, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
            <Handle type="target" position={Position.Left}
                style={{ background: '#f59e0b', width: 10, height: 10, border: '2px solid #09090b' }} />

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 12px 8px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(245,158,11,0.05)',
            }}>
                <div style={{
                    width: 26, height: 26, borderRadius: 8,
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#f59e0b',
                }}>
                    <Zap size={13} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ color: '#f4f4f5', fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                        Hook Registry
                    </p>
                    <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>pre · post middleware</p>
                </div>
                <button
                    onClick={addHook}
                    style={{
                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                        color: '#f59e0b', borderRadius: 6, padding: '3px 8px', fontSize: 10,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3,
                    }}
                >
                    <Plus size={10} /> hook
                </button>
            </div>

            {/* Hooks */}
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {nodeData.hooks.map((hook) => (
                    <HookRow key={hook.id} hook={hook} onUpdate={updateHook} onDelete={deleteHook} />
                ))}
                {nodeData.hooks.length === 0 && (
                    <p style={{ padding: 16, textAlign: 'center', color: '#52525b', fontSize: 11 }}>
                        No hooks yet — click + hook
                    </p>
                )}
            </div>

            <Handle type="source" position={Position.Right}
                style={{ background: '#f59e0b', width: 10, height: 10, border: '2px solid #09090b' }} />
        </div>
    );
}
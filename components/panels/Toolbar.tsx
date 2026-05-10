'use client';

import React, { useRef, useState } from 'react';
import { useEditorStore } from '../../store/editor';
import { Download, Upload, Code2, Loader2, CheckCircle } from 'lucide-react';
import type { ModelNodeData, FileRegistryNodeData } from '../../types';

export function Toolbar() {
    const { nodes } = useEditorStore();
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
    const [selectedRegistry, setSelectedRegistry] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const registries = nodes
        .filter((n: any) => n.type === 'fileRegistryNode')
        .map((n: any) => ({ id: n.id, name: (n.data as FileRegistryNodeData).registryName }));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedRegistry) return;

        const registry = nodes.find((n: any) => n.id === selectedRegistry);
        if (!registry) return;

        setUploading(true);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('registry', JSON.stringify(registry.data));

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            setUploadResult({ success: data.success, failed: data.failed });
        } catch {
            setUploadResult({ success: 0, failed: -1 });
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const handleGenerateSchema = async () => {
        const modelNodes = nodes.filter((n: any) => n.type === 'modelNode');
        if (modelNodes.length === 0) return;

        setGenerating(true);
        try {
            const res = await fetch('/api/generate-schema', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ models: modelNodes.map((n: any) => n.data) }),
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated-schemas.zip';
            a.click();
            setGenerated(true);
            setTimeout(() => setGenerated(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleExportGraph = () => {
        const state = useEditorStore.getState();
        const json = JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backflow-graph.json';
        a.click();
    };

    return (
        <div style={{
            height: 50, background: 'rgba(9,9,11,0.98)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 16px',
            backdropFilter: 'blur(16px)',
            zIndex: 20, flexShrink: 0,
        }}>
            {/* Left: brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <Code2 size={11} color="white" />
                </div>
                <span style={{ color: '#f4f4f5', fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    BackFlow
                </span>
                <span style={{
                    fontSize: 9, padding: '1px 6px', borderRadius: 4,
                    background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)',
                }}>
                    beta
                </span>
            </div>

            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }} />

            {/* File upload section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {registries.length > 0 ? (
                    <select
                        value={selectedRegistry}
                        onChange={(e) => setSelectedRegistry(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid #27272a',
                            color: '#a1a1aa', fontSize: 10, borderRadius: 6,
                            padding: '4px 8px', outline: 'none', cursor: 'pointer',
                        }}
                    >
                        <option value="">select registry…</option>
                        {registries.map((r: any) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                ) : (
                    <span style={{ color: '#3f3f46', fontSize: 10 }}>Add a File Registry node to upload</span>
                )}

                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={!selectedRegistry || uploading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: selectedRegistry ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selectedRegistry ? 'rgba(52,211,153,0.25)' : '#27272a'}`,
                        color: selectedRegistry ? '#34d399' : '#52525b',
                        fontSize: 10, fontWeight: 600, borderRadius: 7,
                        padding: '5px 10px', cursor: selectedRegistry ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s',
                    }}
                >
                    {uploading ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={11} />}
                    {uploading ? 'Processing…' : 'Upload CSV / XLSX'}
                </button>

                <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />

                {uploadResult && (
                    <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 5,
                        background: uploadResult.failed > 0 ? 'rgba(248,113,113,0.1)' : 'rgba(52,211,153,0.1)',
                        color: uploadResult.failed > 0 ? '#f87171' : '#34d399',
                        border: `1px solid ${uploadResult.failed > 0 ? 'rgba(248,113,113,0.2)' : 'rgba(52,211,153,0.2)'}`,
                    }}>
                        ✓ {uploadResult.success} · ✗ {uploadResult.failed}
                    </span>
                )}
            </div>

            <div style={{ flex: 1 }} />

            {/* Right actions */}
            <button
                onClick={handleGenerateSchema}
                disabled={generating}
                style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: generated ? 'rgba(52,211,153,0.12)' : 'rgba(99,102,241,0.12)',
                    border: `1px solid ${generated ? 'rgba(52,211,153,0.25)' : 'rgba(99,102,241,0.25)'}`,
                    color: generated ? '#34d399' : '#818cf8',
                    fontSize: 10, fontWeight: 600, borderRadius: 7,
                    padding: '5px 12px', cursor: 'pointer', transition: 'all 0.2s',
                }}
            >
                {generating
                    ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
                    : generated
                        ? <CheckCircle size={11} />
                        : <Code2 size={11} />
                }
                {generated ? 'Generated!' : 'Generate Schema'}
            </button>

            <button
                onClick={handleExportGraph}
                style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid #27272a',
                    color: '#71717a',
                    fontSize: 10, borderRadius: 7,
                    padding: '5px 10px', cursor: 'pointer',
                    transition: 'all 0.15s',
                }}
            >
                <Download size={11} />
                Export Graph
            </button>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
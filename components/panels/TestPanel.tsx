'use client';

import React, { useState } from 'react';
import { useEditorStore } from '../../store/editor';
import type { ModelNodeData } from '../../types';
import {
  FlaskConical, X, Play, Loader2, Database,
  CheckCircle, AlertCircle, ChevronDown, ChevronRight,
} from 'lucide-react';

const OPERATIONS = ['find', 'findOne', 'aggregate', 'countDocuments', 'distinct'];
const OP_COLORS: Record<string, string> = {
  find: '#38bdf8', findOne: '#67e8f9', aggregate: '#a78bfa',
  countDocuments: '#34d399', distinct: '#fbbf24',
};

function JsonTree({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 1);

  if (data === null) return <span style={{ color: '#f87171' }}>null</span>;
  if (data === undefined) return <span style={{ color: '#71717a' }}>undefined</span>;
  if (typeof data === 'boolean') return <span style={{ color: '#f59e0b' }}>{String(data)}</span>;
  if (typeof data === 'number') return <span style={{ color: '#fb923c' }}>{data}</span>;
  if (typeof data === 'string') return <span style={{ color: '#86efac' }}>"{data}"</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: '#71717a' }}>[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 0, display: 'inline-flex', alignItems: 'center' }}>
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        </button>
        <span style={{ color: '#71717a' }}>[</span>
        {collapsed ? (
          <span style={{ color: '#52525b' }}> {data.length} items </span>
        ) : (
          <div style={{ paddingLeft: 14 }}>
            {data.map((item, i) => (
              <div key={i}>
                <JsonTree data={item} depth={depth + 1} />
                {i < data.length - 1 && <span style={{ color: '#3f3f46' }}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: '#71717a' }}>]</span>
      </span>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data as object);
    if (keys.length === 0) return <span style={{ color: '#71717a' }}>{'{}'}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 0, display: 'inline-flex', alignItems: 'center' }}>
          {collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
        </button>
        <span style={{ color: '#71717a' }}>{'{'}</span>
        {collapsed ? (
          <span style={{ color: '#52525b' }}> {keys.length} keys </span>
        ) : (
          <div style={{ paddingLeft: 14 }}>
            {keys.map((key, i) => (
              <div key={key}>
                <span style={{ color: '#93c5fd' }}>"{key}"</span>
                <span style={{ color: '#71717a' }}>: </span>
                <JsonTree data={(data as Record<string, unknown>)[key]} depth={depth + 1} />
                {i < keys.length - 1 && <span style={{ color: '#3f3f46' }}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span style={{ color: '#71717a' }}>{'}'}</span>
      </span>
    );
  }

  return <span style={{ color: '#e4e4e7' }}>{String(data)}</span>;
}

export function TestPanel() {
  const {
    testPanelOpen, setTestPanelOpen,
    mongoUri, setMongoUri,
    testResults, testLoading, runTest,
    nodes,
  } = useEditorStore();

  const [selectedModel, setSelectedModel] = useState('');
  const [operation, setOperation] = useState('find');
  const [filter, setFilter] = useState('{}');
  const [payload, setPayload] = useState('');
  const [connTested, setConnTested] = useState<boolean | null>(null);
  const [connTesting, setConnTesting] = useState(false);

  const modelNodes = nodes.filter((n) => n.type === 'modelNode');
  const opColor = OP_COLORS[operation] ?? '#e4e4e7';

  const testConnection = async () => {
    if (!mongoUri) return;
    setConnTesting(true);
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: mongoUri, pingOnly: true }),
      });
      const data = await res.json();
      setConnTested(!!data.ok);
    } catch {
      setConnTested(false);
    } finally {
      setConnTesting(false);
    }
  };

  if (!testPanelOpen) return null;

  return (
    <div style={{
      width: 380,
      minWidth: 380,
      background: 'rgba(9,9,11,0.98)',
      borderLeft: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(52,211,153,0.04)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7,
          background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#34d399',
        }}>
          <FlaskConical size={12} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#f4f4f5', fontSize: 12, fontWeight: 700, margin: 0 }}>Test Runner</p>
          <p style={{ color: '#52525b', fontSize: 9, margin: 0 }}>Live MongoDB queries</p>
        </div>
        <button onClick={() => setTestPanelOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', display: 'flex', padding: 2 }}>
          <X size={13} />
        </button>
      </div>

      {/* Connection */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#52525b', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          MongoDB URI
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={mongoUri}
            onChange={(e) => setMongoUri(e.target.value)}
            placeholder="mongodb+srv://..."
            type="password"
            style={{
              flex: 1, background: '#09090b', border: '1px solid #27272a',
              color: '#e4e4e7', fontSize: 11, borderRadius: 7, padding: '7px 10px',
              outline: 'none', fontFamily: 'JetBrains Mono, monospace',
            }}
          />
          <button
            onClick={testConnection}
            disabled={!mongoUri || connTesting}
            style={{
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)',
              color: '#34d399', borderRadius: 7, padding: '7px 10px', fontSize: 10,
              cursor: mongoUri ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {connTesting ? <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} /> : <Database size={10} />}
            Ping
          </button>
        </div>
        {connTested !== null && (
          <div style={{
            marginTop: 6, display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 8px', borderRadius: 6,
            background: connTested ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
            border: `1px solid ${connTested ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}>
            {connTested
              ? <CheckCircle size={10} style={{ color: '#34d399' }} />
              : <AlertCircle size={10} style={{ color: '#f87171' }} />
            }
            <span style={{ fontSize: 10, color: connTested ? '#34d399' : '#f87171' }}>
              {connTested ? 'Connected successfully' : 'Connection failed'}
            </span>
          </div>
        )}
      </div>

      {/* Query builder */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ color: '#52525b', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Query
        </p>

        {/* Model */}
        <div style={{ display: 'flex', gap: 6 }}>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{
              flex: 1, background: '#09090b', border: '1px solid #27272a',
              color: '#e4e4e7', fontSize: 11, borderRadius: 7, padding: '6px 8px', outline: 'none',
            }}
          >
            <option value="">Select model…</option>
            {modelNodes.map((n) => {
              const d = n.data as ModelNodeData;
              return <option key={n.id} value={d.modelName}>{d.modelName}</option>;
            })}
          </select>

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            style={{
              background: `${opColor}15`, border: `1px solid ${opColor}25`,
              color: opColor, fontSize: 10, fontWeight: 600, borderRadius: 7,
              padding: '6px 8px', outline: 'none', cursor: 'pointer',
            }}
          >
            {OPERATIONS.map((op) => (
              <option key={op} value={op} style={{ background: '#18181b', color: OP_COLORS[op] }}>{op}</option>
            ))}
          </select>
        </div>

        {/* Filter */}
        <label style={{ fontSize: 10, color: '#71717a' }}>
          <span style={{ display: 'block', marginBottom: 3 }}>filter / pipeline</span>
          <textarea
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            rows={3}
            placeholder='{ "status": "active" }'
            style={{
              width: '100%', background: '#09090b', border: '1px solid #27272a',
              color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              borderRadius: 6, padding: '6px 8px', outline: 'none', resize: 'vertical',
            }}
          />
        </label>

        {/* Run */}
        <button
          onClick={() => runTest(selectedModel, operation, filter, payload)}
          disabled={!mongoUri || !selectedModel || testLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: (mongoUri && selectedModel) ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${(mongoUri && selectedModel) ? 'rgba(52,211,153,0.25)' : '#27272a'}`,
            color: (mongoUri && selectedModel) ? '#34d399' : '#52525b',
            borderRadius: 7, padding: '8px', fontSize: 11, fontWeight: 600,
            cursor: (mongoUri && selectedModel) ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s',
          }}
        >
          {testLoading
            ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            : <Play size={12} />
          }
          {testLoading ? 'Running…' : 'Run Query'}
        </button>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px' }}>
        {testResults && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ color: '#52525b', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Results
              </p>
              {testResults.error ? (
                <span style={{ fontSize: 9, color: '#f87171' }}>error</span>
              ) : (
                <span style={{ fontSize: 9, color: '#34d399' }}>
                  {Array.isArray(testResults.data) ? `${(testResults.data as unknown[]).length} docs` : 'ok'}
                </span>
              )}
            </div>
            <div style={{
              background: '#09090b', border: '1px solid #1f1f23',
              borderRadius: 8, padding: 10,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              lineHeight: 1.6,
              overflowX: 'auto',
            }}>
              {testResults.error ? (
                <span style={{ color: '#f87171' }}>{String(testResults.error)}</span>
              ) : (
                <JsonTree data={testResults.data ?? testResults} />
              )}
            </div>
          </>
        )}
        {!testResults && !testLoading && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <p style={{ color: '#27272a', fontSize: 12 }}>Run a query to see results</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
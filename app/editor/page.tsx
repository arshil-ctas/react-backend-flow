'use client';

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowCanvas } from '../../components/FlowCanvas';
import { Sidebar } from '../../components/panels/Sidebar';
import { Toolbar } from '../../components/panels/Toolbar';

export default function EditorPage() {
    return (
        <ReactFlowProvider>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                height: '100vh',
                background: '#09090b',
                overflow: 'hidden',
            }}>
                {/* Top Toolbar */}
                <Toolbar />

                {/* Main area: sidebar + canvas */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <Sidebar />
                    <FlowCanvas />
                </div>
            </div>
        </ReactFlowProvider>
    );
}
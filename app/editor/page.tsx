'use client';

import React, { Suspense, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowCanvas } from '../../components/FlowCanvas';
import { Sidebar } from '../../components/panels/Sidebar';
import { Toolbar } from '../../components/panels/Toolbar';
import { TabBar } from '@/components/panels/Tabbar';
import { TestPanel } from '@/components/panels/TestPanel';
import { useSearchParams } from 'next/navigation';
import { ECOMMERCE_TEMPLATE } from '@/templates/ecommerce';
import { SavedTemplate, useEditorStore } from '@/store/editor';
import { MVP_BACKEND_TEMPLATE } from '@/templates/mvp-backend';

const BUILTIN_MAP: Record<string, typeof ECOMMERCE_TEMPLATE | any> = {
    ecommerce: ECOMMERCE_TEMPLATE,
    'mvp-backend': MVP_BACKEND_TEMPLATE,
}; function TemplateLoader() {
    const searchParams = useSearchParams();
    const { loadTemplate, nodes } = useEditorStore();

    useEffect(() => {
        const id = searchParams.get('template');
        if (id && BUILTIN_MAP[id] && nodes.length === 0) {
            const tpl = BUILTIN_MAP[id];
            loadTemplate({
                id: tpl.id,
                name: tpl.name,
                description: tpl.description,
                icon: tpl.icon,
                nodes: tpl.nodes as SavedTemplate['nodes'],
                edges: tpl.edges,
                savedAt: 0,
                isBuiltIn: true,
                tags: tpl.tags,
                models: tpl.models,
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return null; // purely side-effect
}




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
                <Suspense fallback={null}>
                    <TemplateLoader />
                </Suspense>
                {/* Top Toolbar */}
                <Toolbar />
                {/* Tab Bar */}
                <TabBar />


                {/* Main area: sidebar + canvas */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <Sidebar />
                    <TestPanel />
                    <FlowCanvas />
                </div>
            </div>
        </ReactFlowProvider>
    );
}
'use client';

import React, { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Panel,
    MarkerType,
    type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useEditorStore } from '@/store/editor';
import { ModelNode } from './nodes/ModelNode';
import { HookNode } from './nodes/HookNode';
import { ControlNode } from './nodes/ControlNode';
import { FileRegistryNode } from './nodes/FileRegistryNode';
import { CrudNode } from './nodes/CrudNode';

const nodeTypes = {
    modelNode: ModelNode,
    hookNode: HookNode,
    controlNode: ControlNode,
    fileRegistryNode: FileRegistryNode,
    crudNode: CrudNode,
};

export function FlowCanvas() {
    const {
        nodes, edges,
        onNodesChange, onEdgesChange, onConnect,
        selectNode, addNode,
    } = useEditorStore();

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    const onNodeClick: NodeMouseHandler = useCallback((_ev, node) => {
        selectNode(node as Parameters<typeof selectNode>[0]);
    }, [selectNode]);

    const onPaneClick = useCallback(() => {
        selectNode(null);
    }, [selectNode]);

    // Drag-and-drop from sidebar
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('application/backflow-node');
        if (!type || !reactFlowWrapper.current) return;
        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        addNode(type, {
            x: e.clientX - bounds.left - 140,
            y: e.clientY - bounds.top - 40,
        });
    }, [addNode]);

    return (
        <div ref={reactFlowWrapper} style={{ flex: 1, height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                }}
                style={{ background: '#09090b' }}
            >
                <Background
                    gap={48}
                    size={2}
                />

                <Controls
                    showInteractive={false}
                    style={{
                        background: 'rgba(24,24,27,0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 12,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                />

                <MiniMap
                    pannable
                    zoomable
                    nodeColor={(n) => {
                        const colors: Record<string, string> = {
                            modelNode: '#6366f1',
                            hookNode: '#f59e0b',
                            controlNode: '#f472b6',
                            fileRegistryNode: '#34d399',
                            crudNode: '#38bdf8',
                        };
                        return colors[n.type ?? ''] ?? '#27272a';
                    }}
                    maskColor="rgba(0,0,0,0.55)"
                    style={{
                        background: 'rgba(9,9,11,0.9)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 12,
                    }}
                />

                {/* Empty state */}
                {nodes.length === 0 && (
                    <Panel position="top-center">
                        <div style={{
                            marginTop: '15vh',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}>
                            <p style={{
                                color: '#27272a', fontSize: 48, margin: 0,
                                fontWeight: 800, letterSpacing: '-0.04em',
                            }}>
                                start building
                            </p>
                            <p style={{ color: '#3f3f46', fontSize: 14, margin: '8px 0 0' }}>
                                Add nodes from the left sidebar to design your backend architecture
                            </p>
                        </div>
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
}
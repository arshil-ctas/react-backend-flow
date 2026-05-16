import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    type Node, type Edge,
    addEdge, applyNodeChanges, applyEdgeChanges,
    type NodeChange, type EdgeChange, type Connection,
} from '@xyflow/react';
import type { ModelNodeData, HookNodeData, ControlNodeData, FileRegistryNodeData, CrudNodeData } from '../types';

export type AppNode = Node<
    ModelNodeData | HookNodeData | ControlNodeData | FileRegistryNodeData | CrudNodeData,
    string
>;

export type SavedTemplate = {
    id: string;
    name: string;
    icon: string;
    description: string;
    nodes: AppNode[];
    edges: Edge[];
    savedAt: number;
    isBuiltIn?: boolean;
    tags?: string[];
    models?: string[];
};

interface EditorStore {
    nodes: AppNode[];
    edges: Edge[];
    selectedNode: AppNode | null;
    sidebarOpen: boolean;
    activeTab: string | null;
    tabs: string[];
    savedTemplates: SavedTemplate[];
    testPanelOpen: boolean;
    mongoUri: string;
    testResults: Record<string, unknown> | null;
    testLoading: boolean;

    onNodesChange: (c: NodeChange[]) => void;
    onEdgesChange: (c: EdgeChange[]) => void;
    onConnect: (c: Connection) => void;
    addNode: (type: string, position: { x: number; y: number }) => void;
    updateNodeData: (id: string, data: Partial<AppNode['data']>) => void;
    selectNode: (node: AppNode | null) => void;
    deleteNode: (id: string) => void;

    loadTemplate: (tpl: SavedTemplate) => void;
    saveCurrentAs: (name: string, icon: string, description: string) => string;
    deleteTemplate: (id: string) => void;
    openTab: (id: string) => void;
    closeTab: (id: string) => void;
    setCanvasForTab: (id: string, nodes: AppNode[], edges: Edge[]) => void;

    setTestPanelOpen: (open: boolean) => void;
    setMongoUri: (uri: string) => void;
    runTest: (model: string, operation: string, filter: string, payload?: string) => Promise<void>;

    setSidebarOpen: (open: boolean) => void;
}

let idCounter = 200;
const genId = () => `node_${++idCounter}_${Date.now()}`;

const nodeDefaults: Record<string, () => AppNode['data']> = {
    modelNode: (): ModelNodeData => ({
        modelName: 'NewModel', timestamps: true, softDelete: false,
        fields: [{ id: 'f1', name: '_id', type: 'ObjectId', options: {}, isIdentity: true }],
    }),
    hookNode: (): HookNodeData => ({
        hooks: [{ id: 'h1', timing: 'pre', event: 'save', action: 'hashPassword' }],
    }),
    controlNode: (): ControlNodeData => ({ controlType: 'map', iteratorVar: 'item' }),
    fileRegistryNode: (): FileRegistryNodeData => ({
        registryName: 'NewRegistry', targetModel: '', operation: 'upsert',
        columns: [], batchSize: 500,
        arrayConfig: { shape: 'array-of-objects', emptyRowHandling: 'skip' },
    }),
    crudNode: (): CrudNodeData => ({ operation: 'find', filter: '{}' }),
};

export const useEditorStore = create<EditorStore>()(
    devtools(
        persist(
            (set, get) => ({
                nodes: [],
                edges: [],
                selectedNode: null,
                sidebarOpen: true,
                activeTab: null,
                tabs: [],
                savedTemplates: [],
                testPanelOpen: false,
                mongoUri: '',
                testResults: null,
                testLoading: false,

                onNodesChange: (changes) =>
                    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as AppNode[] })),
                onEdgesChange: (changes) =>
                    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),
                onConnect: (connection) =>
                    set((s) => ({
                        edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, s.edges),
                    })),

                addNode: (type, position) => {
                    const id = genId();
                    const data = nodeDefaults[type]?.() ?? {};
                    set((s) => ({ nodes: [...s.nodes, { id, type, position, data } as AppNode] }));
                },

                updateNodeData: (id, data) =>
                    set((s: any) => ({
                        nodes: s.nodes.map((n: any) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
                        selectedNode: s.selectedNode?.id === id
                            ? { ...s.selectedNode, data: { ...s.selectedNode.data, ...data } }
                            : s.selectedNode,
                    })),

                selectNode: (node) => set({ selectedNode: node }),

                deleteNode: (id) =>
                    set((s) => ({
                        nodes: s.nodes.filter((n) => n.id !== id),
                        edges: s.edges.filter((e) => e.source !== id && e.target !== id),
                        selectedNode: s.selectedNode?.id === id ? null : s.selectedNode,
                    })),

                loadTemplate: (tpl) =>
                    set((s) => ({
                        nodes: tpl.nodes,
                        edges: tpl.edges,
                        selectedNode: null,
                        activeTab: tpl.id,
                        tabs: s.tabs.includes(tpl.id) ? s.tabs : [...s.tabs, tpl.id],
                    })),

                saveCurrentAs: (name, icon, description) => {
                    const { nodes, edges } = get();
                    const id = `tpl_${Date.now()}`;
                    const tpl: SavedTemplate = {
                        id, name, icon, description,
                        nodes: nodes as AppNode[], edges, savedAt: Date.now(),
                    };
                    set((s) => ({
                        savedTemplates: [...s.savedTemplates, tpl],
                        activeTab: id,
                        tabs: s.tabs.includes(id) ? s.tabs : [...s.tabs, id],
                    }));
                    return id;
                },

                deleteTemplate: (id) =>
                    set((s) => ({
                        savedTemplates: s.savedTemplates.filter((t) => t.id !== id),
                        tabs: s.tabs.filter((t) => t !== id),
                        activeTab: s.activeTab === id ? (s.tabs.filter((t) => t !== id)[0] ?? null) : s.activeTab,
                    })),

                openTab: (id) =>
                    set((s) => ({
                        tabs: s.tabs.includes(id) ? s.tabs : [...s.tabs, id],
                        activeTab: id,
                    })),

                closeTab: (id) =>
                    set((s) => {
                        const remaining = s.tabs.filter((t) => t !== id);
                        return {
                            tabs: remaining,
                            activeTab: s.activeTab === id ? (remaining[remaining.length - 1] ?? null) : s.activeTab,
                        };
                    }),

                setCanvasForTab: (id, nodes, edges) =>
                    set((s) => ({
                        savedTemplates: s.savedTemplates.map((t) =>
                            t.id === id ? { ...t, nodes, edges, savedAt: Date.now() } : t,
                        ),
                    })),

                setTestPanelOpen: (open) => set({ testPanelOpen: open }),
                setMongoUri: (uri) => set({ mongoUri: uri }),

                runTest: async (model, operation, filter, payload) => {
                    const { mongoUri } = get();
                    set({ testLoading: true, testResults: null });
                    try {
                        const res = await fetch('/api/test-connection', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ uri: mongoUri, model, operation, filter, payload }),
                        });
                        const data = await res.json();
                        set({ testResults: data });
                    } catch (err) {
                        set({ testResults: { error: (err as Error).message } });
                    } finally {
                        set({ testLoading: false });
                    }
                },

                setSidebarOpen: (open) => set({ sidebarOpen: open }),
            }),
            {
                name: 'backflow-v2',
                partialize: (s) => ({
                    savedTemplates: s.savedTemplates,
                    mongoUri: s.mongoUri,
                    sidebarOpen: s.sidebarOpen,
                    nodes: s.nodes,   // ← add these
                    edges: s.edges,   // ← add these

                }),
            },
        ),
    ),
);
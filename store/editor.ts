import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    type Node,
    type Edge,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    type NodeChange,
    type EdgeChange,
    type Connection,
} from '@xyflow/react';
import type { ModelNodeData, HookNodeData, ControlNodeData, FileRegistryNodeData, CrudNodeData } from '../types';

export type AppNode = Node<
    ModelNodeData | HookNodeData | ControlNodeData | FileRegistryNodeData | CrudNodeData,
    string
>;

type PanelType = 'model' | 'hook' | 'control' | 'fileRegistry' | 'crud' | null;

interface EditorStore {
    nodes: AppNode[];
    edges: Edge[];
    selectedNode: AppNode | null;
    activePanel: PanelType;
    sidebarOpen: boolean;

    // Node/edge changes
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    // Node management
    addNode: (type: string, position: { x: number; y: number }) => void;
    updateNodeData: (id: string, data: Partial<AppNode['data']>) => void;
    selectNode: (node: AppNode | null) => void;
    deleteNode: (id: string) => void;

    // UI
    setActivePanel: (panel: PanelType) => void;
    setSidebarOpen: (open: boolean) => void;
}

let idCounter = 100;
const genId = () => `node_${++idCounter}`;

const defaultModelData = (): ModelNodeData => ({
    modelName: 'NewModel',
    fields: [
        { id: 'f1', name: '_id', type: 'ObjectId', options: {}, isIdentity: true },
    ],
    timestamps: true,
    softDelete: false,
});

const defaultHookData = (): HookNodeData => ({
    hooks: [
        {
            id: 'h1',
            timing: 'pre',
            event: 'save',
            action: 'hashPassword',
            watchFields: ['password'],
        },
    ],
});

const defaultControlData = (): ControlNodeData => ({
    controlType: 'map',
    iteratorVar: 'item',
});

const defaultFileRegistryData = (): FileRegistryNodeData => ({
    registryName: 'NewRegistry',
    targetModel: '',
    operation: 'upsert',
    columns: [],
    arrayConfig: {
        shape: 'array-of-objects',
        emptyRowHandling: 'skip',
    },
    batchSize: 500,
});

const defaultCrudData = (): CrudNodeData => ({
    operation: 'find',
    filter: '{}',
});

const nodeDefaultsByType: Record<string, () => AppNode['data']> = {
    modelNode: defaultModelData,
    hookNode: defaultHookData,
    controlNode: defaultControlData,
    fileRegistryNode: defaultFileRegistryData,
    crudNode: defaultCrudData,
};

export const useEditorStore = create<EditorStore | any>()(
    devtools((set, get) => ({
        nodes: [],
        edges: [],
        selectedNode: null,
        activePanel: null,
        sidebarOpen: true,

        onNodesChange: (changes) =>
            set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as AppNode[] })),

        onEdgesChange: (changes) =>
            set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

        onConnect: (connection) =>
            set((s) => ({
                edges: addEdge(
                    {
                        ...connection,
                        animated: true,
                        style: { stroke: '#6366f1', strokeWidth: 2 },
                    },
                    s.edges,
                ),
            })),

        addNode: (type: any, position: any): any => {
            const id = genId();
            const data = nodeDefaultsByType[type]?.() ?? {};
            const newNode: AppNode = {
                id,
                type,
                position,
                data,
            } as AppNode;
            set((s) => ({ nodes: [...s.nodes, newNode] }));
        },

        updateNodeData: (id, data) =>
            set((s) => ({
                nodes: s.nodes.map((n) =>
                    n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
                ),
                selectedNode:
                    s.selectedNode?.id === id
                        ? { ...s.selectedNode, data: { ...s.selectedNode.data, ...data } }
                        : s.selectedNode,
            })) as any,

        selectNode: (node) => set({ selectedNode: node }),

        deleteNode: (id) =>
            set((s) => ({
                nodes: s.nodes.filter((n) => n.id !== id),
                edges: s.edges.filter((e) => e.source !== id && e.target !== id),
                selectedNode: s.selectedNode?.id === id ? null : s.selectedNode,
            })),

        setActivePanel: (panel) => set({ activePanel: panel }),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
    })),
);
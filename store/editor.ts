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
import { templateNodes, templateEdges } from '../lib/editorTemplate';

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
        nodes: templateNodes,
        edges: templateEdges,
        selectedNode: null,
        activePanel: null,
        sidebarOpen: true,

        onNodesChange: (changes: any) =>
            set((s: any) => ({ nodes: applyNodeChanges(changes, s.nodes) as AppNode[] })),

        onEdgesChange: (changes: any) =>
            set((s: any) => ({ edges: applyEdgeChanges(changes, s.edges) })),

        onConnect: (connection: any) =>
            set((s: any) => ({
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
            set((s: any) => ({ nodes: [...s.nodes, newNode] }));
        },

        updateNodeData: (id: any, data: any) =>
            set((s: any) => ({
                nodes: s.nodes.map((n: any) =>
                    n.id === id ? { ...n, data: { ...n.data, ...data } } : n,
                ),
                selectedNode:
                    s.selectedNode?.id === id
                        ? { ...s.selectedNode, data: { ...s.selectedNode.data, ...data } }
                        : s.selectedNode,
            })) as any,

        selectNode: (node: any) => set({ selectedNode: node }),

        deleteNode: (id: any) =>
            set((s: any) => ({
                nodes: s.nodes.filter((n: any) => n.id !== id),
                edges: s.edges.filter((e: any) => e.source !== id && e.target !== id),
                selectedNode: s.selectedNode?.id === id ? null : s.selectedNode,
            })),

        setActivePanel: (panel: PanelType) => set({ activePanel: panel }),
        setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    })),
);
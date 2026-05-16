// ─── Field Types ────────────────────────────────────────────────────────────
export type FieldType =
    | 'String' | 'Number' | 'Boolean' | 'Date' | 'ObjectId'
    | 'Array' | 'Mixed' | 'Buffer' | 'Decimal128' | 'Map';

export type FieldOption = {
    required?: boolean;
    unique?: boolean;
    default?: string;
    enum?: string[];
    ref?: string;           // For ObjectId refs → other models
    autoIncrement?: boolean;
    index?: boolean;
    sparse?: boolean;
    trim?: boolean;
    lowercase?: boolean;
    min?: number;
    max?: number;
};

export type ModelField = {
    id: string;
    name: string;
    type: FieldType;
    options: FieldOption;
    isIdentity?: boolean;   // SKU, _id, custom identity
};

// ─── Model / Schema Node ────────────────────────────────────────────────────
export type ModelNodeData = {
    modelName: string;
    collectionName?: string;
    fields: ModelField[];
    timestamps?: boolean;
    softDelete?: boolean;
};

// ─── Hook Types ─────────────────────────────────────────────────────────────
export type HookTiming = 'pre' | 'post';
export type HookEvent =
    | 'save' | 'update' | 'findOneAndUpdate' | 'remove'
    | 'validate' | 'init' | 'deleteOne' | 'insertMany';

export type HookAction =
    | 'hashPassword'
    | 'generateSlug'
    | 'autoIncrement'
    | 'sendEmail'
    | 'updateTimestamp'
    | 'validateUnique'
    | 'populateVirtuals'
    | 'custom';

export type Hook = {
    id: string;
    timing: HookTiming;
    event: HookEvent;
    action: HookAction;
    customCode?: string;
    watchFields?: string[];   // only trigger if these fields changed
    condition?: string;       // JS expression
};

export type HookNodeData = {
    hooks: Hook[];
    attachedModel?: string;   // model node id
};

// ─── Control Flow ───────────────────────────────────────────────────────────
export type ControlFlowType =
    | 'if' | 'else' | 'map' | 'filter' | 'reduce'
    | 'forEach' | 'objectKeys' | 'objectValues' | 'objectEntries'
    | 'switch' | 'try-catch';

export type ControlNodeData = {
    controlType: ControlFlowType;
    condition?: string;
    iteratorVar?: string;
    accumulator?: string;
    body?: string;
};

// ─── File Registry ──────────────────────────────────────────────────────────
export type FileDataShape = 'array-of-objects' | 'flat-csv' | 'array-of-arrays';
export type FileOperation = 'create' | 'update' | 'upsert' | 'delete' | 'bulkWrite';

export type ColumnBehaviour = {
    header: string;               // CSV/Excel header name
    fieldPath: string;            // dot-notation path in model
    isIdentity?: boolean;         // used to match existing docs
    identityField?: string;       // _id / sku / custom
    transform?: string;           // JS expression
    skip?: boolean;
    required?: boolean;
    defaultValue?: string;
    autoIncrement?: boolean;
    autoIncrementStart?: number;
    autoIncrementStep?: number;
};

export type EmptyRowHandling = 'skip' | 'error' | 'useDefault';

export type ArrayConfig = {
    shape: FileDataShape;
    delimiter?: string;             // for flat-csv arrays
    emptyRowHandling: EmptyRowHandling;
    groupByField?: string;          // group rows into nested array
};

export type FileRegistryNodeData = {
    registryName: string;
    targetModel: string;            // model node id
    operation: FileOperation;
    columns: ColumnBehaviour[];
    arrayConfig: ArrayConfig;
    batchSize?: number;
    conditionalDispatch?: string;   // JS expression deciding operation per row
};

// ─── Relation Edge ───────────────────────────────────────────────────────────
export type RelationEdgeData = {
    sourceField: string;    // field in source model
    relationType: 'ref' | 'embed' | 'virtual';
    targetModel: string;
};

// ─── Node Types ──────────────────────────────────────────────────────────────
export type AppNodeType =
    | 'modelNode'
    | 'hookNode'
    | 'controlNode'
    | 'fileRegistryNode'
    | 'crudNode';

// ─── CRUD Node ───────────────────────────────────────────────────────────────
export type CrudOperation = 'find' | 'findOne' | 'create' | 'updateOne' | 'updateMany' | 'deleteOne' | 'deleteMany' | 'aggregate';

export type CrudNodeData = {
    operation: CrudOperation;
    model?: string;
    filter?: string;
    payload?: string;
    options?: string;
};

// ─── Upload Processing ───────────────────────────────────────────────────────
export type ProcessedRow = Record<string, unknown>;

export type UploadResult = {
    total: number;
    success: number;
    failed: number;
    errors: Array<{ row: number; message: string; data: ProcessedRow }>;
    batchResults: Array<{ batch: number; ops: number; duration: number }>;
};

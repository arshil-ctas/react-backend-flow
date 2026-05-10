# BackFlow — Visual Backend Builder

A Next.js app for designing MongoDB/Mongoose backends visually — schema nodes, hook registries, control flow, and file upload pipelines.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
# → Editor at http://localhost:3000/editor
```

## Features

### 🗃️ Model / Schema Nodes
- Define fields with types: String, Number, Boolean, Date, ObjectId, Array, Mixed, etc.
- Field options: required, unique, index, sparse, auto-increment, default, enum, min/max
- Mark identity fields (SKU, _id, custom key)
- `ObjectId` fields with `ref` automatically create relation edges
- Toggle: timestamps, soft-delete

### ⚡ Hook Registry Nodes
- `pre` / `post` hooks for: save, update, findOneAndUpdate, remove, validate, etc.
- Built-in actions: hashPassword, generateSlug, autoIncrement, sendEmail, updateTimestamp, validateUnique, populateVirtuals, custom
- Condition expressions: `this.isModified('password')`
- Watch-field triggers: only fire hook if specific fields changed
- Custom code block for advanced middleware

### 🔀 Control Flow Nodes
- `if` / `else` — conditional branching (with separate handles on canvas)
- `map`, `filter`, `reduce`, `forEach` — array operations
- `Object.keys`, `Object.values`, `Object.entries` — object iteration
- `switch` — multi-case dispatch
- `try/catch` — error boundaries

### 📄 File Registry Nodes (CSV / XLSX Upload)
- Map CSV/Excel headers → model field paths (dot-notation for nested)
- Per-column: required, skip, transform expression, default value
- Auto-increment columns with configurable start/step
- Identity columns for update/upsert matching
- **Batch size** — controls DB bulkWrite chunk size
- **Conditional dispatch** — per-row JS expression to decide operation:
  ```js
  row.type === 'new' ? 'create' : 'upsert'
  ```
- Empty row handling: skip / error / useDefault
- Data shapes: array-of-objects, flat-csv, array-of-arrays

### ⚙️ CRUD Nodes
- Operations: find, findOne, create, updateOne, updateMany, deleteOne, deleteMany, aggregate
- Filter, payload, options — all as editable JSON expressions

## API Routes

### `POST /api/upload`
Upload a CSV or XLSX file with a registry config.

**FormData:**
- `file` — the CSV/XLSX file (stored in memory only — no filesystem writes)
- `registry` — JSON stringified `FileRegistryNodeData`

**Response:**
```json
{
  "total": 1000,
  "success": 998,
  "failed": 2,
  "errors": [{ "row": 5, "message": "Required field empty", "data": {...} }],
  "batchResults": [{ "batch": 1, "ops": 500, "duration": 120 }]
}
```

### `POST /api/generate-schema`
Generate TypeScript + Mongoose schema files from model node data.

**Body:** `{ "models": [ModelNodeData, ...] }`

**Response:** ZIP file download containing:
- `<ModelName>.schema.ts` — Mongoose schema + TypeScript interface
- `<ModelName>.service.ts` — CRUD service layer
- `index.ts` — barrel export
- `README.md`

### `POST /api/process-file`
Generate a sample upload file (CSV or XLSX) from a registry definition.

**Body:** `FileRegistryNodeData`

**Response:** CSV or XLSX file download

## Architecture

```
app/
  page.tsx               — Landing page
  editor/page.tsx        — React Flow editor
  api/
    upload/route.ts      — File upload processing (memoryStorage)
    generate-schema/     — TypeScript code generation + ZIP
    process-file/        — Sample file generation

components/
  FlowCanvas.tsx         — React Flow canvas
  nodes/
    ModelNode.tsx        — Schema/model node
    HookNode.tsx         — Hook registry node
    ControlNode.tsx      — Control flow node (if/map/filter/etc.)
    FileRegistryNode.tsx — File upload pipeline node
    CrudNode.tsx         — CRUD operation node
  panels/
    Sidebar.tsx          — Node palette
    Toolbar.tsx          — Top bar (upload, generate, export)

lib/
  multer.ts             — Memory-only upload config (no filesystem)
  fileProcessor.ts      — CSV/XLSX parsing + registry mapping + batch logic
  schemaGenerator.ts    — TypeScript/Mongoose code generation

store/
  editor.ts             — Zustand store for canvas state

types/
  index.ts              — All TypeScript types
```

## Multer / Upload Strategy

Uploads use **`multer.memoryStorage()`** — files **never touch the filesystem**. This means:
- No `/tmp` writes → safe for serverless deploys (Vercel, Railway, etc.)
- The file buffer stays in Node.js process memory
- Parsed directly via `csv-parse` or `xlsx` library on the buffer
- No cleanup needed

## Environment Variables

```env
# Add your MongoDB URI to connect the CRUD operations to a real DB
MONGODB_URI=mongodb+srv://...
```

## Extending: Connecting to a Real Database

In `/api/upload/route.ts`, replace the simulation section with your actual DB calls:

```typescript
import mongoose from 'mongoose';
import { User } from '../../../generated-schemas';

// Inside the batch loop:
for (const [op, opRows] of Object.entries(opGroups)) {
  if (op === 'upsert') {
    const bulkOps = opRows.map(row => ({
      updateOne: {
        filter: { sku: row.sku },
        update: { $set: row },
        upsert: true,
      }
    }));
    await User.bulkWrite(bulkOps, { ordered: false });
  }
}
```
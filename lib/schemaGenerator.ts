import type { ModelNodeData, ModelField } from '../types';

// ── Generate TypeScript + Mongoose schema from model node data ─────────────

export function generateSchemaCode(model: ModelNodeData): string {
    const { modelName, fields, timestamps, softDelete } = model;
    const collectionName = model.collectionName ?? modelName.toLowerCase() + 's';

    const imports = new Set<string>(['Schema', 'model', 'Document', 'Model']);

    // Check if we need mongoose-auto-increment or other plugins
    const needsAutoIncrement = fields.some((f) => f.options.autoIncrement);
    const hasRefs = fields.some((f) => f.options.ref);

    const schemaFields = fields
        .filter((f) => f.name !== '_id')
        .map((f) => generateFieldCode(f))
        .join(',\n  ');

    const hookCode = generateHooksCode(model);
    const interfaceCode = generateInterfaceCode(model);

    let code = `import { Schema, model, Document, Model, Types } from 'mongoose';\n`;

    if (needsAutoIncrement) {
        code += `// npm install mongoose-sequence\nimport AutoIncrementFactory from 'mongoose-sequence';\n`;
    }

    code += `\n`;
    code += `// ─── Interface ───────────────────────────────────────────────────────────────\n`;
    code += interfaceCode;
    code += `\n`;
    code += `// ─── Schema ──────────────────────────────────────────────────────────────────\n`;
    code += `const ${modelName}Schema = new Schema<I${modelName}>(\n`;
    code += `  {\n`;
    code += `  ${schemaFields}\n`;
    code += `  },\n`;
    code += `  {\n`;
    code += `    collection: '${collectionName}',\n`;
    if (timestamps) code += `    timestamps: true,\n`;
    code += `  }\n`;
    code += `);\n`;

    if (hookCode) {
        code += `\n// ─── Hooks ───────────────────────────────────────────────────────────────────\n`;
        code += hookCode;
    }

    if (needsAutoIncrement) {
        const aiFields = fields.filter((f) => f.options.autoIncrement);
        for (const f of aiFields) {
            code += `\n// Auto-increment plugin for ${f.name}\n`;
            code += `// @ts-ignore\n`;
            code += `${modelName}Schema.plugin(AutoIncrementFactory(mongoose), { inc_field: '${f.name}' });\n`;
        }
    }

    if (softDelete) {
        code += `\n// ─── Soft Delete ─────────────────────────────────────────────────────────────\n`;
        code += `${modelName}Schema.add({ deletedAt: { type: Date, default: null } });\n`;
        code += `${modelName}Schema.pre('find', function() { this.where({ deletedAt: null }); });\n`;
        code += `${modelName}Schema.pre('findOne', function() { this.where({ deletedAt: null }); });\n`;
    }

    code += `\n// ─── Export ───────────────────────────────────────────────────────────────────\n`;
    code += `export const ${modelName} = model<I${modelName}>('${modelName}', ${modelName}Schema);\n`;
    code += `export default ${modelName};\n`;

    return code;
}

// ─── Generate TypeScript interface ────────────────────────────────────────

function generateInterfaceCode(model: ModelNodeData): string {
    const { modelName, fields } = model;
    const tsTypes: Record<string, string> = {
        String: 'string',
        Number: 'number',
        Boolean: 'boolean',
        Date: 'Date',
        ObjectId: 'Types.ObjectId',
        Array: 'unknown[]',
        Mixed: 'unknown',
        Buffer: 'Buffer',
        Decimal128: 'Types.Decimal128',
        Map: 'Map<string, unknown>',
    };

    const fieldLines = fields.map((f) => {
        const tsType = tsTypes[f.type] ?? 'unknown';
        const optional = !f.options.required ? '?' : '';
        return `  ${f.name}${optional}: ${tsType};`;
    });

    return [
        `export interface I${modelName} extends Document {`,
        ...fieldLines,
        `}`,
        '',
    ].join('\n');
}

// ─── Generate schema field definition ─────────────────────────────────────

function generateFieldCode(field: ModelField): string {
    const { name, type, options } = field;
    const parts: string[] = [];

    parts.push(`type: ${type === 'ObjectId' ? 'Schema.Types.ObjectId' : type}`);

    if (options.required) parts.push(`required: true`);
    if (options.unique) parts.push(`unique: true`);
    if (options.index) parts.push(`index: true`);
    if (options.sparse) parts.push(`sparse: true`);
    if (options.trim) parts.push(`trim: true`);
    if (options.lowercase) parts.push(`lowercase: true`);
    if (options.ref) parts.push(`ref: '${options.ref}'`);
    if (options.default !== undefined && options.default !== '')
        parts.push(`default: ${formatDefault(options.default, type)}`);
    if (options.enum && options.enum.length > 0)
        parts.push(`enum: [${options.enum.map((e) => `'${e}'`).join(', ')}]`);
    if (options.min !== undefined) parts.push(`min: ${options.min}`);
    if (options.max !== undefined) parts.push(`max: ${options.max}`);

    return `${name}: { ${parts.join(', ')} }`;
}

function formatDefault(value: string, type: string): string {
    if (value === 'null') return 'null';
    if (value === 'undefined') return 'undefined';
    if (value === 'Date.now') return 'Date.now';
    if (type === 'String') return `'${value}'`;
    if (type === 'Boolean') return value === 'true' ? 'true' : 'false';
    if (type === 'Number') return isNaN(Number(value)) ? `'${value}'` : value;
    return `'${value}'`;
}

// ─── Generate basic hook stubs ────────────────────────────────────────────

function generateHooksCode(model: ModelNodeData): string {
    // Just stubs for now; the HookNode data would be threaded in via edges
    return '';
}

// ─── Generate CRUD service code ────────────────────────────────────────────

export function generateCrudService(model: ModelNodeData): string {
    const { modelName } = model;

    return `import { ${modelName} } from './${modelName}.schema';
import type { I${modelName} } from './${modelName}.schema';
import type { FilterQuery, UpdateQuery } from 'mongoose';

export class ${modelName}Service {

  async findAll(filter: FilterQuery<I${modelName}> = {}) {
    return ${modelName}.find(filter).lean();
  }

  async findById(id: string) {
    return ${modelName}.findById(id).lean();
  }

  async create(data: Partial<I${modelName}>) {
    return ${modelName}.create(data);
  }

  async updateOne(id: string, update: UpdateQuery<I${modelName}>) {
    return ${modelName}.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  }

  async deleteOne(id: string) {
    return ${modelName}.findByIdAndDelete(id);
  }

  async bulkUpsert(
    docs: Partial<I${modelName}>[],
    identityField: keyof I${modelName} = '_id',
    batchSize = 500,
  ) {
    const results = [];
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const ops = batch.map((doc) => ({
        updateOne: {
          filter: { [identityField]: doc[identityField] },
          update: { $set: doc },
          upsert: true,
        },
      }));
      const result = await ${modelName}.bulkWrite(ops, { ordered: false });
      results.push(result);
    }
    return results;
  }
}

export default new ${modelName}Service();
`;
}

// ─── Generate all files for a set of models ───────────────────────────────

export type GeneratedFile = { filename: string; content: string };

export function generateAllFiles(models: ModelNodeData[]): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    for (const model of models) {
        files.push({
            filename: `${model.modelName}.schema.ts`,
            content: generateSchemaCode(model),
        });
        files.push({
            filename: `${model.modelName}.service.ts`,
            content: generateCrudService(model),
        });
    }

    // Index barrel
    files.push({
        filename: 'index.ts',
        content: models
            .map((m) => `export { ${m.modelName} } from './${m.modelName}.schema';\nexport { default as ${m.modelName}Service } from './${m.modelName}.service';`)
            .join('\n'),
    });

    return files;
}
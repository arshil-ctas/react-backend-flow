import { parse as csvParse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import type { FileRegistryNodeData, ColumnBehaviour, ProcessedRow } from '../types';

// ── Parse buffer → raw rows ────────────────────────────────────────────────

export function parseBuffer(
    buffer: Buffer,
    filename: string,
): Record<string, string>[] {
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();

    if (ext === '.csv') {
        return parseCsv(buffer);
    } else if (ext === '.xlsx' || ext === '.xls') {
        return parseXlsx(buffer);
    } else {
        // fallback: try CSV
        return parseCsv(buffer);
    }
}

function parseCsv(buffer: Buffer): Record<string, string>[] {
    const records = csvParse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_quotes: true,
    }) as Record<string, string>[];
    return records;
}

function parseXlsx(buffer: Buffer): Record<string, string>[] {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellText: true, cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
        raw: false,         // All values as strings (formatted)
        defval: '',         // empty cells → ''
    });
    return rows;
}

// ── Apply registry mapping to raw rows ────────────────────────────────────

export function applyRegistryMapping(
    rawRows: Record<string, string>[],
    registry: FileRegistryNodeData,
): { rows: ProcessedRow[]; errors: Array<{ row: number; message: string; data: ProcessedRow }> } {
    const errors: Array<{ row: number; message: string; data: ProcessedRow }> = [];
    const rows: ProcessedRow[] = [];

    // Build auto-increment counters per column
    const aiCounters: Record<string, number> = {};
    for (const col of registry.columns) {
        if (col.autoIncrement) {
            aiCounters[col.header] = col.autoIncrementStart ?? 1;
        }
    }

    for (let i = 0; i < rawRows.length; i++) {
        const raw = rawRows[i];
        const rowNum = i + 1;

        // Skip empty rows
        const isEmpty = Object.values(raw).every((v) => v === '' || v == null);
        if (isEmpty) {
            if (registry.arrayConfig.emptyRowHandling === 'error') {
                errors.push({ row: rowNum, message: 'Empty row', data: raw as ProcessedRow });
            }
            // 'skip' and 'useDefault' both skip the row itself (defaults applied per-field)
            if (registry.arrayConfig.emptyRowHandling !== 'useDefault') continue;
        }

        const mapped: ProcessedRow = {};
        let rowHasError = false;

        for (const col of registry.columns) {
            if (col.skip) continue;

            const rawValue = raw[col.header];

            // Auto-increment
            if (col.autoIncrement) {
                const counterVal = aiCounters[col.header];
                setNestedValue(mapped, col.fieldPath, counterVal);
                aiCounters[col.header] = counterVal + (col.autoIncrementStep ?? 1);
                continue;
            }

            let value: unknown = rawValue;

            // Empty cell handling
            if (rawValue === '' || rawValue == null) {
                if (col.required && registry.arrayConfig.emptyRowHandling === 'error') {
                    errors.push({
                        row: rowNum,
                        message: `Required column "${col.header}" is empty`,
                        data: raw as ProcessedRow,
                    });
                    rowHasError = true;
                    break;
                }
                value = col.defaultValue ?? null;
            }

            // Apply transform expression (safe eval)
            if (col.transform && value != null) {
                try {
                    const fn = new Function('v', 'row', `return (${col.transform})(v, row)`);
                    value = fn(value, raw);
                } catch (err) {
                    errors.push({
                        row: rowNum,
                        message: `Transform failed for column "${col.header}": ${(err as Error).message}`,
                        data: raw as ProcessedRow,
                    });
                }
            }

            // Set value in nested path (e.g., "address.city")
            setNestedValue(mapped, col.fieldPath, value);
        }

        if (!rowHasError) {
            rows.push(mapped);
        }
    }

    return { rows, errors };
}

// ── Determine operation for each row (conditional dispatch) ────────────────

export function resolveOperation(
    row: ProcessedRow,
    registry: FileRegistryNodeData,
): string {
    if (!registry.conditionalDispatch) return registry.operation;
    try {
        const fn = new Function('row', `return (${registry.conditionalDispatch})`);
        return fn(row) ?? registry.operation;
    } catch {
        return registry.operation;
    }
}

// ── Group rows into batches ────────────────────────────────────────────────

export function batchRows<T>(rows: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < rows.length; i += batchSize) {
        batches.push(rows.slice(i, i + batchSize));
    }
    return batches;
}

// ── Utility: set deeply nested value by dot path ──────────────────────────

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown) {
    if (!path) return;
    const parts = path.split('.');
    let cur: Record<string, unknown> = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in cur)) cur[parts[i]] = {};
        cur = cur[parts[i]] as Record<string, unknown>;
    }
    cur[parts[parts.length - 1]] = value;
}

// ── Generate a sample file from a registry definition ─────────────────────

export function generateSampleBuffer(registry: FileRegistryNodeData): Buffer {
    const columns = registry.columns.filter((c) => !c.skip);
    const headers = columns.map((c) => c.header);

    const sampleRows = [
        // Row 1: example values
        columns.map((c) => getSampleValue(c)),
        // Row 2: another example
        columns.map((c) => getSampleValue(c, 2)),
    ];

    if (registry.arrayConfig.shape === 'flat-csv') {
        const delimiter = registry.arrayConfig.delimiter ?? ',';
        const lines = [
            headers.join(delimiter),
            ...sampleRows.map((r) => r.join(delimiter)),
        ];
        return Buffer.from(lines.join('\n'), 'utf-8');
    } else {
        // XLSX
        const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
    }
}

function getSampleValue(col: ColumnBehaviour, idx = 1): string {
    if (col.autoIncrement) return String((col.autoIncrementStart ?? 1) + (idx - 1) * (col.autoIncrementStep ?? 1));
    if (col.isIdentity) return `SAMPLE-ID-${idx}`;
    if (col.defaultValue) return col.defaultValue;
    const name = col.fieldPath.split('.').pop() ?? col.header;
    if (/email/i.test(name)) return `user${idx}@example.com`;
    if (/name/i.test(name)) return `Sample Name ${idx}`;
    if (/price|amount|cost/i.test(name)) return `${(9.99 * idx).toFixed(2)}`;
    if (/date|at$/i.test(name)) return new Date().toISOString().split('T')[0];
    if (/status/i.test(name)) return 'active';
    if (/qty|quantity|count/i.test(name)) return String(idx * 10);
    return `value_${idx}`;
}
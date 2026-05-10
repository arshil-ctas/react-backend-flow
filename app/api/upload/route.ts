import { NextRequest, NextResponse } from 'next/server';
import { parseUploadedFile } from '../../../lib/multer';
import { parseBuffer, applyRegistryMapping, resolveOperation, batchRows } from '../../../lib/fileProcessor';
import type { FileRegistryNodeData, UploadResult } from '../../../types';

export const runtime = 'nodejs';   // required for Buffer / stream
export const maxDuration = 120;    // 2 min timeout for large files

export async function POST(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();

    try {
        // 1. Parse multipart — no filesystem touch
        const formData = await request.formData();
        const file = formData.get('file');
        const registryRaw = formData.get('registry');

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        if (!registryRaw || typeof registryRaw !== 'string') {
            return NextResponse.json({ error: 'No registry config provided' }, { status: 400 });
        }

        const registry: FileRegistryNodeData = JSON.parse(registryRaw);
        const filename = (file as File).name ?? 'upload.csv';

        // 2. Buffer only — stays in memory
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Parse rows from CSV or XLSX
        const rawRows = parseBuffer(buffer, filename);

        // 4. Apply registry column mapping + transforms
        const { rows, errors } = applyRegistryMapping(rawRows, registry);

        // 5. Batch + simulate CRUD dispatch
        const batchSize = registry.batchSize ?? 500;
        const batches = batchRows(rows, batchSize);
        const batchResults: UploadResult['batchResults'] = [];

        let successCount = 0;
        const allErrors = [...errors];

        for (let bi = 0; bi < batches.length; bi++) {
            const batchStart = Date.now();
            const batch = batches[bi];

            // Group rows by their resolved operation (conditional dispatch)
            const opGroups: Record<string, typeof batch> = {};
            for (const row of batch) {
                const op = resolveOperation(row, registry);
                if (!opGroups[op]) opGroups[op] = [];
                opGroups[op].push(row);
            }

            // In a real app, here you'd call your DB service:
            // e.g. await UserService.bulkUpsert(opGroups.upsert)
            // For now we simulate and report back
            for (const [op, opRows] of Object.entries(opGroups)) {
                // Simulate processing time
                await new Promise((r) => setTimeout(r, 5));
                successCount += opRows.length;

                // Log the operation breakdown
                console.log(`[upload] batch ${bi + 1} op=${op} rows=${opRows.length}`);
            }

            batchResults.push({
                batch: bi + 1,
                ops: batch.length,
                duration: Date.now() - batchStart,
            });
        }

        const result: UploadResult = {
            total: rawRows.length,
            success: successCount,
            failed: allErrors.length,
            errors: allErrors.slice(0, 50), // cap error detail at 50
            batchResults,
        };

        console.log(`[upload] done in ${Date.now() - startTime}ms — ${successCount}/${rawRows.length} rows`);

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error('[upload] error:', err);
        return NextResponse.json(
            { error: (err as Error).message ?? 'Internal error' },
            { status: 500 },
        );
    }
}

// Preview: parse and return first N rows without writing anything
export async function GET(request: NextRequest): Promise<NextResponse> {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? '10');

    return NextResponse.json({ message: 'Use POST to upload a file', previewLimit: limit });
}
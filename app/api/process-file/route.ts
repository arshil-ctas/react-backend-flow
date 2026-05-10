import { NextRequest, NextResponse } from 'next/server';
import { generateSampleBuffer } from '../../../lib/fileProcessor';
import type { FileRegistryNodeData } from '../../../types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const registry: FileRegistryNodeData = await request.json();

        const isXlsx = registry.arrayConfig.shape !== 'flat-csv';
        const buffer: any = generateSampleBuffer(registry);
        const ext = isXlsx ? 'xlsx' : 'csv';
        const contentType = isXlsx
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv';

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${registry.registryName}-sample.${ext}"`,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
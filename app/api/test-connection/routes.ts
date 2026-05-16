import { NextRequest, NextResponse } from 'next/server';
import mongoose, { type Connection } from 'mongoose';

export const runtime = 'nodejs';
export const maxDuration = 30;

// Cache connections per URI to avoid reconnecting on every request
const connectionCache = new Map<string, Connection>();

async function getConnection(uri: string): Promise<Connection> {
    if (connectionCache.has(uri)) {
        const cached = connectionCache.get(uri)!;
        if (cached.readyState === 1) return cached;
        connectionCache.delete(uri);
    }

    const conn = mongoose.createConnection(uri, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        maxPoolSize: 2,
    });

    await conn.asPromise();
    connectionCache.set(uri, conn);
    return conn;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { uri, pingOnly, model, operation, filter, payload }: any = body;

        if (!uri) {
            return NextResponse.json({ error: 'No URI provided' }, { status: 400 });
        }

        // ── Ping only ─────────────────────────────────────────────────────────
        if (pingOnly) {
            try {
                const conn = await getConnection(uri);
                await conn.db?.admin().ping();
                return NextResponse.json({ ok: true, host: conn.host, name: conn.name });
            } catch (err) {
                return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 200 });
            }
        }

        // ── Run query ──────────────────────────────────────────────────────────
        if (!model) {
            return NextResponse.json({ error: 'No model name provided' }, { status: 400 });
        }

        const conn = await getConnection(uri);

        // Get or create a dynamic model (schema-less)
        let Model: mongoose.Model<mongoose.Document> | any;
        try {
            Model = conn.model(model);
        } catch {
            // Model not registered — create a schema-less model
            const schema = new mongoose.Schema({}, { strict: false });
            Model = conn.model(model, schema);
        }

        let parsedFilter: unknown = {};
        let parsedPayload: unknown = {};

        try {
            parsedFilter = filter ? JSON.parse(filter) : {};
        } catch {
            return NextResponse.json({ error: `Invalid filter JSON: ${filter}` }, { status: 400 });
        }

        try {
            parsedPayload = payload ? JSON.parse(payload) : {};
        } catch {
            // payload optional
        }

        const start = Date.now();
        let data: unknown;

        switch (operation) {
            case 'find':
                data = await (Model as mongoose.Model<mongoose.Document>)
                    .find(parsedFilter as mongoose.FilterQuery<mongoose.Document>)
                    .limit(50)
                    .lean();
                break;

            case 'findOne':
                data = await (Model as mongoose.Model<mongoose.Document>)
                    .findOne(parsedFilter as mongoose.FilterQuery<mongoose.Document>)
                    .lean();
                break;

            case 'aggregate':
                data = await (Model as any)
                    .aggregate(
                        Array.isArray(parsedFilter) ? parsedFilter as any : [{ $match: parsedFilter }]
                    );
                break;

            case 'countDocuments':
                data = await (Model as mongoose.Model<mongoose.Document>)
                    .countDocuments(parsedFilter as mongoose.FilterQuery<mongoose.Document>);
                break;

            case 'distinct':
                data = await (Model as mongoose.Model<mongoose.Document>)
                    .distinct('_id', parsedFilter as mongoose.FilterQuery<mongoose.Document>);
                break;

            default:
                return NextResponse.json({ error: `Unknown operation: ${operation}` }, { status: 400 });
        }

        return NextResponse.json({
            ok: true,
            operation,
            model,
            duration: Date.now() - start,
            data,
        });
    } catch (err) {
        console.error('[test-connection]', err);
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
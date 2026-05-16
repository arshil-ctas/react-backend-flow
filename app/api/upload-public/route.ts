import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const runtime = 'nodejs';

// ── Upload files to /public/uploads ──────────────────────────────────────
// This route writes files to the Next.js public folder so they're
// immediately accessible as static assets at /uploads/<filename>.
// Uses streams/buffers — no multer disk storage needed.
//
// ⚠️  Production note: on serverless hosts (Vercel) the filesystem is
//     read-only after build. Use cloud storage (S3/R2) there instead.
//     For local dev and self-hosted (Railway, VPS, Docker) this works perfectly.

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // already exists
  }
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await ensureDir(UPLOAD_DIR);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const originalName = (file as File).name ?? 'upload';
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const timestamp = Date.now();
    const filename = `${sanitizeFilename(base)}-${timestamp}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Read into buffer (stays in memory until written)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write to public/uploads
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;
    const size = buffer.length;

    return NextResponse.json({
      ok: true,
      filename,
      url: publicUrl,
      size,
      originalName,
    });
  } catch (err) {
    console.error('[upload-public]', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await ensureDir(UPLOAD_DIR);
    const files = await fs.readdir(UPLOAD_DIR);
    const details = await Promise.all(
      files.map(async (f) => {
        const stat = await fs.stat(path.join(UPLOAD_DIR, f));
        return { filename: f, url: `/uploads/${f}`, size: stat.size, createdAt: stat.birthtime };
      }),
    );
    return NextResponse.json({ files: details });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { filename } = await request.json();
    if (!filename || filename.includes('..')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    await fs.unlink(path.join(UPLOAD_DIR, filename));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
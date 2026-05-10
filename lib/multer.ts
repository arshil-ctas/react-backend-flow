import multer from 'multer';
import type { NextRequest } from 'next/server';

// ── Memory storage only ── no disk writes, no /tmp headaches ──────────────
export const multerMemory = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
        files: 1,
    },
    fileFilter(_req: any, file: any, cb: any) {
        const allowed = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/octet-stream', // some browsers send xlsx as this
        ];
        const allowedExts = ['.csv', '.xls', '.xlsx'];
        const ext = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();

        if (allowed.includes(file.mimetype) || allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype} (${ext})`));
        }
    },
});

// ── Parse multipart from NextRequest without touching the filesystem ───────
// Next.js App Router doesn't use express middleware directly, so we read
// the FormData via the Web Fetch API that Next exposes.
export async function parseUploadedFile(request: NextRequest): Promise<{
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}> {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof Blob)) {
        throw new Error('No file found in request');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalname = (file as File).name ?? 'upload';
    const mimetype = file.type ?? 'application/octet-stream';

    return { buffer, originalname, mimetype, size: buffer.length };
}

export function getRegistryFromFormData(formData: FormData) {
    const raw = formData.get('registry');
    if (!raw || typeof raw !== 'string') throw new Error('Missing registry config');
    return JSON.parse(raw);
}
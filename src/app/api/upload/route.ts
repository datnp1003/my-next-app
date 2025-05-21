import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';

// Cấu hình thư mục uploads
const uploadDir = path.join(process.cwd(), 'public/uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Validate định dạng file
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, or GIF files are allowed'));
  }
};

// Cấu hình Multer với giới hạn kích thước
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // fileSize: 5 * 1024 * 1024, // 5MB
    fileSize: 50 * 1024, // 50KB

  },
});

// Tắt bodyParser của Next.js để Multer xử lý
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Kiểm tra phiên người dùng
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  upload.array('images', 10)(req as any, res as any, (err: any) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds 5MB limit' });
      }
      return res.status(400).json({ message: err.message });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const files = (req as any).files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = files.map((file) => `/uploads/${file.filename}`);
    res.status(200).json({
      message: 'Upload successful',
      files: fileUrls,
    });
  });
}

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file: any) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        return `/uploads/${fileName}`;
      })
    );

    return NextResponse.json({
      success: true,
      files: uploadedFiles
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
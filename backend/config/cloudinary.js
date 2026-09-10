import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Initialize Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'cartverse',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_key_secret: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz12345',
});

// Configure Multer storage using memory storage
const storage = multer.memoryStorage();

// Allowed file formats
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpg|jpeg|png|webp|avif|svg/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowedExtensions.test(ext) || mime.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, AVIF, SVG) are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

/**
 * Upload buffer to Cloudinary with graceful local fallback
 */
export const uploadBufferToCloudinary = (buffer, folder = 'cartverse/products') => {
  return new Promise((resolve, reject) => {
    // If no valid Cloudinary credentials in dev, use local fallback
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY.includes('placeholder') ||
      process.env.CLOUDINARY_API_KEY === '123456789012345'
    ) {
      const uploadDir = path.resolve('backend/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `img_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      return resolve({
        secure_url: `/uploads/${filename}`,
        public_id: `local_${filename}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Destroy image on Cloudinary
 */
export const deleteFromCloudinary = async (public_id) => {
  if (public_id && !public_id.startsWith('local_')) {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (e) {
      console.warn('[Cloudinary Delete Warning]', e.message);
    }
  }
};

export default cloudinary;

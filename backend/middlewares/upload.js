import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình bộ nhớ cho multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let subfolder = 'others';
    if (file.mimetype.startsWith('image/')) subfolder = 'images';
    else if (file.mimetype.startsWith('video/')) subfolder = 'videos';

    const finalPath = path.join(uploadDir, subfolder);

    if (!fs.existsSync(finalPath)) {
      fs.mkdirSync(finalPath, { recursive: true });
    }

    cb(null, finalPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Cấu hình upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm|mkv/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

 
export const uploadStoryMedia = upload.single("media");

export const uploadPostMedia = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

export default upload;

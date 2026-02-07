import multer from "multer";

const storage = multer.memoryStorage(); // 🔥 REQUIRED for sharp

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;

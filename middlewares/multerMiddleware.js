const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Allowed upload folders
const allowedFolders = ["restaurants", "foods", "users"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = allowedFolders.includes(req.body.type)
      ? req.body.type
      : "others";

    const uploadPath = path.join(__dirname, "..", "uploads", folder);

    // Create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      "image-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

module.exports = upload;
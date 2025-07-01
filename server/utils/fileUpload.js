const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
exports.uploadFile = async (file, folder = 'chat-app') => {
  try {
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      throw new Error(`File size (${file.size}) exceeds maximum allowed size`);
    }

    // Check file type
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp3|mp4/;
    const extname = filetypes.test(path.extname(file.name).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!extname || !mimetype) {
      throw new Error('Unsupported file type');
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: folder,
      resource_type: 'auto'
    });

    // Remove temp file
    fs.unlinkSync(file.tempFilePath);

    return {
      url: result.secure_url,
      type: result.resource_type,
      name: file.name
    };
  } catch (err) {
    // Remove temp file if exists
    if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
      fs.unlinkSync(file.tempFilePath);
    }
    throw err;
  }
};

// Delete file from Cloudinary
exports.deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    throw err;
  }
};
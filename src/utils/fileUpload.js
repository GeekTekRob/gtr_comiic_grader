/**
 * File Upload Middleware
 * Handles image file uploads and validation
 */

import multer from 'multer';
import path from 'path';

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store in memory for API processing

const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit per file
    files: 10, // Maximum 10 files
  },
});

/**
 * Validate uploaded files
 * @param {object[]} files - Array of uploaded files
 * @returns {object} - Validation result
 */
export function validateFiles(files) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!files || files.length === 0) {
    result.isValid = false;
    result.errors.push('No files uploaded');
    return result;
  }

  if (files.length > 10) {
    result.isValid = false;
    result.errors.push('Maximum 10 images allowed');
  }

  files.forEach((file, index) => {
    if (!file.mimetype.startsWith('image/')) {
      result.errors.push(`File ${index + 1}: Not a valid image format`);
      result.isValid = false;
    }

    if (file.size > 10 * 1024 * 1024) {
      result.errors.push(`File ${index + 1}: Exceeds 10 MB limit`);
      result.isValid = false;
    }
  });

  return result;
}

export { upload };

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {Buffer|string|Readable} file - File to upload (buffer, file path, or stream)
 * @param {Object} options - Upload options
 * @param {string} options.folder - Folder path in Cloudinary
 * @param {string} options.public_id - Public ID for the file
 * @param {string} options.resource_type - Resource type (image, video, raw, auto)
 * @param {string} options.format - File format
 * @param {Object} options.transformation - Image transformation options
 * @returns {Promise<Object>} Upload result
 */
export const uploadFile = async (file, options = {}) => {
  try {
    const {
      folder = 'resumeiqhub',
      public_id,
      resource_type = 'auto',
      format,
      transformation,
    } = options;

    const uploadOptions = {
      folder,
      resource_type,
      ...(public_id && { public_id }),
      ...(format && { format }),
      ...(transformation && { transformation }),
    };

    let result;
    
    // Handle different file types
    if (Buffer.isBuffer(file)) {
      // Convert buffer to data URI
      const base64 = file.toString('base64');
      const dataUri = `data:${options.mimeType || 'application/octet-stream'};base64,${base64}`;
      result = await cloudinary.uploader.upload(dataUri, uploadOptions);
    } else if (file instanceof Readable || typeof file === 'string') {
      // File path or stream
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      throw new Error('Invalid file type. Expected Buffer, string (path), or Readable stream.');
    }

    console.log(`✅ File uploaded successfully: ${result.public_id}`);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Upload image to Cloudinary
 * @param {Buffer|string|Readable} image - Image file
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (image, options = {}) => {
  return uploadFile(image, {
    ...options,
    resource_type: 'image',
  });
};

/**
 * Upload avatar image
 * @param {Buffer|string|Readable} image - Avatar image
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Upload result
 */
export const uploadAvatar = async (image, userId) => {
  return uploadImage(image, {
    folder: 'resumeiqhub/avatars',
    public_id: `avatar_${userId}`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
};

/**
 * Upload resume PDF
 * @param {Buffer|string|Readable} pdf - PDF file
 * @param {string} resumeId - Resume ID
 * @returns {Promise<Object>} Upload result
 */
export const uploadResumePDF = async (pdf, resumeId) => {
  return uploadFile(pdf, {
    folder: 'resumeiqhub/resumes',
    public_id: `resume_${resumeId}`,
    resource_type: 'raw',
    format: 'pdf',
  });
};

/**
 * Upload organization logo
 * @param {Buffer|string|Readable} logo - Logo image
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>} Upload result
 */
export const uploadLogo = async (logo, organizationId) => {
  return uploadImage(logo, {
    folder: 'resumeiqhub/logos',
    public_id: `logo_${organizationId}`,
    transformation: [
      { width: 300, height: 300, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} public_id - Public ID of the file to delete
 * @param {string} resource_type - Resource type (image, video, raw)
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFile = async (public_id, resource_type = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type,
    });
    
    console.log(`✅ File deleted: ${public_id}`);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Generate image URL with transformations
 * @param {string} public_id - Public ID of the image
 * @param {Object} transformation - Transformation options
 * @returns {string} Transformed image URL
 */
export const getImageUrl = (public_id, transformation = {}) => {
  return cloudinary.url(public_id, {
    secure: true,
    ...transformation,
  });
};

export default {
  uploadFile,
  uploadImage,
  uploadAvatar,
  uploadResumePDF,
  uploadLogo,
  deleteFile,
  getImageUrl,
};


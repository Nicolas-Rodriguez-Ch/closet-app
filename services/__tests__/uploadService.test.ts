import { uploadToCloudinary } from '../uploadService';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('@/public/constants/secrets', () => ({
  CLOUDINARY_CLOUD_NAME: 'test-cloud-name',
  CLOUDINARY_API_KEY: 'test-api-key',
  CLOUDINARY_API_SECRET: 'test-api-secret',
  CLOUDINARY_FOLDER: 'LookBook'
}));

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));

describe('uploadToCloudinary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully upload a file to Cloudinary', async () => {
    const mockResult = {
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234/lookbook/image.jpg',
      public_id: 'lookbook/image',
      asset_id: '123456789',
      version_id: '1234',
    };

    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockResult);

    const mockFile = new File(['mock image content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(mockFile, 'arrayBuffer', {
      value: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    const result = await uploadToCloudinary(mockFile);

    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      expect.stringContaining('data:image/jpeg;base64,'),
      expect.objectContaining({
        folder: 'LookBook',
        resource_type: 'image',
      })
    );

    expect(result).toEqual({
      secure_url: mockResult.secure_url,
      public_id: mockResult.public_id,
    });
  });

  it('should throw an error when Cloudinary upload fails', async () => {
    const mockError = new Error('Upload failed due to invalid credentials');
    (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(mockError);

    const mockFile = new File(['mock image content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(mockFile, 'arrayBuffer', {
      value: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    });

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow(
      'Error uploading to cloudinary: Upload failed due to invalid credentials'
    );
  });

  it('should handle file reading errors', async () => {
    const mockFile = new File(['mock image content'], 'image.jpg', {
      type: 'image/jpeg',
    });
    const mockError = new Error('Failed to read file');
    Object.defineProperty(mockFile, 'arrayBuffer', {
      value: jest.fn().mockRejectedValue(mockError),
    });

    await expect(uploadToCloudinary(mockFile)).rejects.toThrow(
      'Error uploading to cloudinary: Failed to read file'
    );
  });

  it('should handle empty or corrupted file uploads', async () => {
    const mockInvalidResult = {
      asset_id: '123456789',
      version_id: '1234',
    };
    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(mockInvalidResult);

    const mockFile = new File([''], 'empty.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(mockFile, 'arrayBuffer', {
      value: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    });
    const result = await uploadToCloudinary(mockFile);
    expect(result).toEqual({
      secure_url: undefined,
      public_id: undefined,
    });
  });
});
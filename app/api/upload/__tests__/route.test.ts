import { POST } from '../route';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));

jest.mock('@/public/constants/secrets', () => ({
  CLOUDINARY_CLOUD_NAME: 'test_cloud_name',
  CLOUDINARY_API_KEY: 'test_api_key',
  CLOUDINARY_API_SECRET: 'test_api_secret',
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockJsonResponse = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJsonResponse });

jest.mock('next/server', () => ({
  NextRequest: function () {
    return {};
  },
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => {
      mockJsonResponse(data);
      mockStatus(options?.status || 200);
      return {
        status: options?.status || 200,
        json: async () => data,
      };
    }),
  },
}));

describe('Upload API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no file is uploaded', async () => {
    const mockFormData = {
      get: jest.fn().mockReturnValue(null),
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'No file uploaded',
    });
  });

  it('should return 400 if uploaded file is not an image', async () => {
    const mockFile = {
      arrayBuffer: jest.fn(),
      size: 1024,
      type: 'application/pdf',
      name: 'test.pdf',
    };

    const mockFormData = {
      get: jest.fn().mockReturnValue(mockFile),
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(mockFormData.get).toHaveBeenCalledWith('file');
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Only image files are allowed',
    });
    expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
  });

  it('should upload image file to Cloudinary and return URL', async () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      size: 1024,
      type: 'image/jpeg',
      name: 'test.jpg',
    };

    const mockFormData = {
      get: jest.fn().mockReturnValue(mockFile),
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    const mockCloudinaryResult = {
      secure_url: 'https://res.cloudinary.com/demo/image/upload/test.jpg',
      public_id: 'LookBook/test',
    };

    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(
      mockCloudinaryResult
    );

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(mockFormData.get).toHaveBeenCalledWith('file');
    expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
      expect.stringContaining('data:image/jpeg;base64,'),
      {
        folder: 'LookBook',
        resource_type: 'image',
      }
    );

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Upload succesful',
      pictureURL: mockCloudinaryResult.secure_url,
    });
  });

  it('should return 500 if Cloudinary result is missing secure_url', async () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      size: 1024,
      type: 'image/jpeg',
      name: 'test.jpg',
    };

    const mockFormData = {
      get: jest.fn().mockReturnValue(mockFile),
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    const invalidResult = {
      public_id: 'LookBook/test',
    };

    (cloudinary.uploader.upload as jest.Mock).mockResolvedValue(invalidResult);

    await POST(mockRequest as any);

    expect(cloudinary.uploader.upload).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Upload failed',
    });
  });

  it('should handle errors during upload and return 500', async () => {
    const mockFile = {
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
      size: 1024,
      type: 'image/jpeg',
      name: 'test.jpg',
    };

    const mockFormData = {
      get: jest.fn().mockReturnValue(mockFile),
    };

    const mockRequest = {
      formData: jest.fn().mockResolvedValue(mockFormData),
    };

    const testError = new Error('Upload failed');

    (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(testError);

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(cloudinary.uploader.upload).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Failed to upload image',
    });
  });

  it('should handle errors in request processing', async () => {
    const mockRequest = {
      formData: jest
        .fn()
        .mockRejectedValue(new Error('Request processing failed')),
    };

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Failed to upload image',
    });
  });
});

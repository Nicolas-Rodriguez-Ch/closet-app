import { POST } from '../route';
import { uploadToCloudinary } from '@/services/uploadService';

jest.mock('@/services/uploadService', () => ({
  uploadToCloudinary: jest.fn(),
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
    expect(uploadToCloudinary).not.toHaveBeenCalled();
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
      public_id: 'lookbook/test',
    };

    (uploadToCloudinary as jest.Mock).mockResolvedValue(mockCloudinaryResult);

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(mockFormData.get).toHaveBeenCalledWith('file');
    expect(uploadToCloudinary).toHaveBeenCalledWith(mockFile);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJsonResponse).toHaveBeenCalledWith({
      message: 'Upload succesful',
      data: mockCloudinaryResult,
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
      public_id: 'lookbook/test',
    };

    (uploadToCloudinary as jest.Mock).mockResolvedValue(invalidResult);

    await POST(mockRequest as any);

    expect(uploadToCloudinary).toHaveBeenCalledWith(mockFile);
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

    (uploadToCloudinary as jest.Mock).mockRejectedValue(testError);

    await POST(mockRequest as any);

    expect(mockRequest.formData).toHaveBeenCalled();
    expect(uploadToCloudinary).toHaveBeenCalledWith(mockFile);
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
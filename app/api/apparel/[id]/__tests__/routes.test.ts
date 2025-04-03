import { GET, PUT, DELETE } from '../route';
import {
  findApparelById,
  updateApparelById,
  deleteApparelById,
} from '@/services/apparelServices';

jest.mock('@/services/apparelServices', () => ({
  findApparelById: jest.fn(),
  updateApparelById: jest.fn(),
  deleteApparelById: jest.fn(),
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

describe('Apparel ID API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockParams = {
    params: Promise.resolve({
      id: 'test-id-123',
    }),
  };

  describe('GET /api/apparel/[id]', () => {
    it('should return a specific apparel item', async () => {
      const mockApparel = {
        id: 'test-id-123',
        title: 'Test Shirt',
        pictureURL: 'https://example.com/test.jpg',
        type: 'TOP',
      };

      (findApparelById as jest.Mock).mockResolvedValue(mockApparel);

      const mockRequest = {};
      const response = await GET(mockRequest as any, mockParams);

      expect(findApparelById).toHaveBeenCalledWith('test-id-123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(response.status).toBe(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockApparel);
    });

    it('should return 404 if apparel is not found', async () => {
      (findApparelById as jest.Mock).mockResolvedValue(null);

      const mockRequest = {};
      await GET(mockRequest as any, mockParams);

      expect(findApparelById).toHaveBeenCalledWith('test-id-123');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (findApparelById as jest.Mock).mockRejectedValue(testError);

      const mockRequest = {};
      await GET(mockRequest as any, mockParams);

      expect(findApparelById).toHaveBeenCalledWith('test-id-123');
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to fetch apparel item',
      });
    });
  });

  describe('PUT /api/apparel/[id]', () => {
    it('should update an apparel item with valid data', async () => {
      const mockUpdatedApparel = {
        id: 'test-id-123',
        title: 'Updated Shirt',
        pictureURL: 'https://example.com/updated.jpg',
        type: 'TOP',
      };

      (updateApparelById as jest.Mock).mockResolvedValue(mockUpdatedApparel);

      const requestBody = {
        title: 'Updated Shirt',
        pictureURL: 'https://example.com/updated.jpg',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await PUT(mockRequest as any, mockParams);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(updateApparelById).toHaveBeenCalledWith(
        'test-id-123',
        requestBody
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockUpdatedApparel);
    });

    it('should return 404 if apparel is not found', async () => {
      (updateApparelById as jest.Mock).mockResolvedValue(null);

      const requestBody = { title: 'Updated Shirt' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await PUT(mockRequest as any, mockParams);

      expect(updateApparelById).toHaveBeenCalledWith(
        'test-id-123',
        requestBody
      );
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (updateApparelById as jest.Mock).mockRejectedValue(testError);

      const requestBody = { title: 'Updated Shirt' };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await PUT(mockRequest as any, mockParams);

      expect(updateApparelById).toHaveBeenCalledWith(
        'test-id-123',
        requestBody
      );
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to update apparel item',
      });
    });
  });

  describe('DELETE /api/apparel/[id]', () => {
    it('should delete an apparel item', async () => {
      const mockDeletedApparel = {
        id: 'test-id-123',
        title: 'Deleted Shirt',
      };

      (deleteApparelById as jest.Mock).mockResolvedValue(mockDeletedApparel);

      const mockRequest = {};

      await DELETE(mockRequest as any, mockParams);

      expect(deleteApparelById).toHaveBeenCalledWith('test-id-123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: `Apparel with ID test-id-123 deleted successfully`,
      });
    });

    it('should return 404 if apparel is not found', async () => {
      (deleteApparelById as jest.Mock).mockResolvedValue(null);

      const mockRequest = {};

      await DELETE(mockRequest as any, mockParams);

      expect(deleteApparelById).toHaveBeenCalledWith('test-id-123');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('not found'),
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (deleteApparelById as jest.Mock).mockRejectedValue(testError);

      const mockRequest = {};

      await DELETE(mockRequest as any, mockParams);

      expect(deleteApparelById).toHaveBeenCalledWith('test-id-123');
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to delete apparel item',
      });
    });
  });
});

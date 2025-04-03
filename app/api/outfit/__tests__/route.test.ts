jest.mock('@/database/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import { GET, POST } from '../route';

jest.mock('@/database/models/outfits', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

jest.mock('@/database/models/apparel', () => ({}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockJsonResponse = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJsonResponse });
const mockResponse = {
  status: mockStatus,
  json: mockJsonResponse,
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => {
      mockJsonResponse(data);
      mockStatus(options?.status || 200);
      return mockResponse;
    }),
  },
}));

import Outfit from '@/database/models/outfits';

describe('Outfit API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/outfit', () => {
    it('should return all outfit items', async () => {
      const mockOutfits = [
        {
          id: '1',
          title: 'Summer Outfit',
          topID: 'top1',
          bottomID: 'bottom1',
          shoesID: 'shoes1',
          tags: ['summer', 'casual'],
        },
      ];

      const mockPopulate = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockOutfits);

      (Outfit.find as jest.Mock).mockImplementation(() => ({
        populate: mockPopulate,
        sort: mockSort,
      }));

      await GET();

      expect(Outfit.find).toHaveBeenCalledWith({});
      expect(mockPopulate).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockOutfits);
    });

    it('should return 404 when no outfits are found', async () => {
      const mockPopulate = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue([]);

      (Outfit.find as jest.Mock).mockImplementation(() => ({
        populate: mockPopulate,
        sort: mockSort,
      }));

      await GET();

      expect(Outfit.find).toHaveBeenCalledWith({});
      expect(mockPopulate).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'No outfits were found',
        data: [],
      });
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');

      (Outfit.find as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      await GET();

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Error fetching outfits',
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('POST /api/outfit', () => {
    it('should create a new outfit with valid data', async () => {
      const mockOutfit = {
        id: '123',
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (Outfit.create as jest.Mock).mockResolvedValue(mockOutfit);

      const requestBody = {
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(Outfit.create).toHaveBeenCalledWith(requestBody);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockOutfit);
    });

    it('should return 400 if required fields are missing', async () => {
      const requestBody = {
        title: 'New Outfit',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(Outfit.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Missing required fields'),
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (Outfit.create as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      const requestBody = {
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody),
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to create outfit',
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
});

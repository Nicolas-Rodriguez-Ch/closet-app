import { GET, POST } from '../route';
import { getAllOutfits, createOutfit } from '@/services/outfitServices';

jest.mock('@/services/outfitServices', () => ({
  getAllOutfits: jest.fn(),
  createOutfit: jest.fn(),
}));

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

      (getAllOutfits as jest.Mock).mockResolvedValue(mockOutfits);

      await GET();

      expect(getAllOutfits).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockOutfits);
    });

    it('should return 404 when no outfits are found', async () => {
      (getAllOutfits as jest.Mock).mockResolvedValue([]);

      await GET();

      expect(getAllOutfits).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'No outfits were found',
        data: [],
      });
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (getAllOutfits as jest.Mock).mockRejectedValue(testError);

      await GET();

      expect(getAllOutfits).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Error fetching outfits',
      });
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

      (createOutfit as jest.Mock).mockResolvedValue(mockOutfit);

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
      expect(createOutfit).toHaveBeenCalledWith(requestBody);
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
      expect(createOutfit).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Missing required fields'),
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (createOutfit as jest.Mock).mockRejectedValue(testError);

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
      expect(createOutfit).toHaveBeenCalledWith(requestBody);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to create outfit',
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
});
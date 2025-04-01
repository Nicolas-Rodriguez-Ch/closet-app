import { GET, POST } from '../route';
import Apparel from '@/database/models/apparel';

jest.mock('@/database/models/apparel', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

const mockJsonResponse = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJsonResponse });
const mockResponse = {
  status: mockStatus,
  json: mockJsonResponse
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => {
      mockJsonResponse(data);
      mockStatus(options?.status || 200);
      return mockResponse;
    })
  }
}));

describe('Apparel API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/apparel', () => {
    it('should return all apparel items', async () => {
      const mockApparelItems = [
        { id: '1', title: 'Blue Shirt', type: 'TOP' },
        { id: '2', title: 'Black Pants', type: 'BOTTOM' },
      ];

      (Apparel.find as jest.Mock).mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue(mockApparelItems),
      }));

      await GET();

      expect(Apparel.find).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockApparelItems);
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (Apparel.find as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      await GET();

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to fetch apparel items'
      });
    });
    it('should return 404 when no apparel items are found', async () => {
      (Apparel.find as jest.Mock).mockImplementation(() => ({
        sort: jest.fn().mockResolvedValue([]),
      }));
    
      await GET();
    
      expect(Apparel.find).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'No apparel items were found',
        data: []
      });
    });
  });

  describe('POST /api/apparel', () => {
    it('should create a new apparel item with valid data', async () => {
      const mockApparel = {
        id: '123',
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
        description: 'A nice shirt',
      };

      (Apparel.create as jest.Mock).mockResolvedValue(mockApparel);

      const requestBody = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
        description: 'A nice shirt',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(Apparel.create).toHaveBeenCalledWith(requestBody);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockApparel);
    });

    it('should return 400 if required fields are missing', async () => {
      const requestBody = {
        title: 'New Shirt',
        type: 'TOP',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(Apparel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('required fields')
        })
      );
    });

    it('should return 400 if type is invalid', async () => {
      const requestBody = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'INVALID_TYPE',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(Apparel.create).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJsonResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid apparel type')
        })
      );
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (Apparel.create as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      const requestBody = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      };

      await POST(mockRequest as any);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({
        message: 'Failed to create Apparel item'
      });
    });
  });
});
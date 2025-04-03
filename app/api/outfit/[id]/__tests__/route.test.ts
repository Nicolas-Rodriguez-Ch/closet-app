import { GET, PUT, DELETE } from '../route';
import { 
  getOutfitById, 
  updateOutfitById, 
  deleteOutfitById 
} from '@/services/outfitServices';

jest.mock('@/services/outfitServices', () => ({
  getOutfitById: jest.fn(),
  updateOutfitById: jest.fn(),
  deleteOutfitById: jest.fn()
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

describe('Outfit ID API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/outfit/[id]', () => {
    it('should return an outfit when it exists', async () => {
      const mockOutfit = {
        id: 'outfit-123',
        title: 'Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1',
        tags: ['summer', 'casual']
      };

      (getOutfitById as jest.Mock).mockResolvedValue(mockOutfit);

      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const mockRequest = {} as Request;
      const contextObj = { params: mockParams };

      await GET(mockRequest, contextObj);

      expect(getOutfitById).toHaveBeenCalledWith('outfit-123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockOutfit);
    });

    it('should return 404 when outfit is not found', async () => {
      (getOutfitById as jest.Mock).mockResolvedValue(null);

      const mockParams = Promise.resolve({ id: 'non-existent-id' });
      const mockRequest = {} as Request;
      const contextObj = { params: mockParams };

      await GET(mockRequest, contextObj);

      expect(getOutfitById).toHaveBeenCalledWith('non-existent-id');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Outfit with ID non-existent-id not found' 
      });
    });

    it('should handle errors and return 404', async () => {
      const testError = new Error('Database error');
      (getOutfitById as jest.Mock).mockRejectedValue(testError);

      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const mockRequest = {} as Request;
      const contextObj = { params: mockParams };

      await GET(mockRequest, contextObj);

      expect(getOutfitById).toHaveBeenCalledWith('outfit-123');
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Outfit with ID outfit-123 nor found' 
      });
    });
  });

  describe('PUT /api/outfit/[id]', () => {
    it('should update an outfit when it exists', async () => {
      const mockUpdatedOutfit = {
        id: 'outfit-123',
        title: 'Updated Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1',
        tags: ['summer', 'casual', 'updated']
      };

      (updateOutfitById as jest.Mock).mockResolvedValue(mockUpdatedOutfit);

      const requestBody = {
        title: 'Updated Summer Outfit',
        tags: ['summer', 'casual', 'updated']
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const contextObj = { params: mockParams };

      await PUT(mockRequest, contextObj);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(updateOutfitById).toHaveBeenCalledWith('outfit-123', requestBody);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith(mockUpdatedOutfit);
    });

    it('should return 404 when outfit to update is not found', async () => {
      (updateOutfitById as jest.Mock).mockResolvedValue(null);

      const requestBody = {
        title: 'Updated Title',
        tags: ['new', 'tags']
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const mockParams = Promise.resolve({ id: 'non-existent-id' });
      const contextObj = { params: mockParams };

      await PUT(mockRequest, contextObj);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(updateOutfitById).toHaveBeenCalledWith('non-existent-id', requestBody);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Outfit with ID non-existent-id not found' 
      });
    });

    it('should handle errors and return 404', async () => {
      const testError = new Error('Database error');
      (updateOutfitById as jest.Mock).mockRejectedValue(testError);

      const requestBody = { title: 'Will Fail' };
      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBody)
      } as unknown as Request;

      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const contextObj = { params: mockParams };

      await PUT(mockRequest, contextObj);

      expect(mockRequest.json).toHaveBeenCalled();
      expect(updateOutfitById).toHaveBeenCalledWith('outfit-123', requestBody);
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Failed to update outfit' 
      });
    });
  });

  describe('DELETE /api/outfit/[id]', () => {
    it('should delete an outfit when it exists', async () => {
      const mockDeletedOutfit = {
        id: 'outfit-123',
        title: 'Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1'
      };

      (deleteOutfitById as jest.Mock).mockResolvedValue(mockDeletedOutfit);

      const mockRequest = {} as Request;
      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const contextObj = { params: mockParams };

      await DELETE(mockRequest, contextObj);

      expect(deleteOutfitById).toHaveBeenCalledWith('outfit-123');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Outfit with ID outfit-123 deleted succesfully' 
      });
    });

    it('should return 404 when outfit to delete is not found', async () => {
      (deleteOutfitById as jest.Mock).mockResolvedValue(null);

      const mockRequest = {} as Request;
      const mockParams = Promise.resolve({ id: 'non-existent-id' });
      const contextObj = { params: mockParams };

      await DELETE(mockRequest, contextObj);

      expect(deleteOutfitById).toHaveBeenCalledWith('non-existent-id');
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Outfit with ID non-existent-id not found' 
      });
    });

    it('should handle errors and return 500', async () => {
      const testError = new Error('Database error');
      (deleteOutfitById as jest.Mock).mockRejectedValue(testError);

      const mockRequest = {} as Request;
      const mockParams = Promise.resolve({ id: 'outfit-123' });
      const contextObj = { params: mockParams };

      await DELETE(mockRequest, contextObj);

      expect(deleteOutfitById).toHaveBeenCalledWith('outfit-123');
      expect(console.error).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJsonResponse).toHaveBeenCalledWith({ 
        message: 'Failed to delete outfit' 
      });
    });
  });
});
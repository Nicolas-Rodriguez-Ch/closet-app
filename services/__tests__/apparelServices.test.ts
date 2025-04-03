jest.mock('@/database/db', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('@/database/models/apparel', () => ({
  find: jest.fn(),
  create: jest.fn(),
}));
import { getAllApparel, createNewApparel } from '../apparelServices';
import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';


describe('Apparel Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllApparel', () => {
    it('should connect to the database and return all apparel items', async () => {
      const mockApparelItems = [
        { id: '1', title: 'Blue Shirt', type: 'TOP' },
        { id: '2', title: 'Black Pants', type: 'BOTTOM' }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockApparelItems);
      (Apparel.find as jest.Mock).mockReturnValue({
        sort: mockSort
      });

      const result = await getAllApparel();

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.find).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockApparelItems);
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Database error');
      (Apparel.find as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      await expect(getAllApparel()).rejects.toThrow('Database error');
      
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('createNewApparel', () => {
    it('should connect to the database and create a new apparel item', async () => {
      const mockApparelItem = {
        id: '123',
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
        description: 'A nice shirt'
      };
      
      const newApparelData = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
        description: 'A nice shirt'
      };

      (Apparel.create as jest.Mock).mockResolvedValue(mockApparelItem);

      const result = await createNewApparel(newApparelData);

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.create).toHaveBeenCalledWith(newApparelData);
      expect(result).toEqual(mockApparelItem);
    });

    it('should propagate errors from the database when creating', async () => {
      const newApparelData = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP'
      };

      const testError = new Error('Creation error');
      (Apparel.create as jest.Mock).mockRejectedValue(testError);

      await expect(createNewApparel(newApparelData)).rejects.toThrow('Creation error');
      
      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.create).toHaveBeenCalledWith(newApparelData);
    });
  });
});
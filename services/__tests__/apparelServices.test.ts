jest.mock('@/database/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import {
  getAllApparel,
  createNewApparel,
  findApparelById,
  updateApparelById,
  deleteApparelById,
} from '../apparelServices';
import connectDB from '@/database/db';
import Apparel from '@/database/models/apparel';

jest.mock('@/database/models/apparel', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

describe('Apparel Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllApparel', () => {
    it('should connect to the database and return all apparel items', async () => {
      const mockApparelItems = [
        { id: '1', title: 'Blue Shirt', type: 'TOP' },
        { id: '2', title: 'Black Pants', type: 'BOTTOM' },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockApparelItems);
      (Apparel.find as jest.Mock).mockReturnValue({
        sort: mockSort,
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
        description: 'A nice shirt',
      };

      const newApparelData = {
        title: 'New Shirt',
        pictureURL: 'https://example.com/shirt.jpg',
        type: 'TOP',
        description: 'A nice shirt',
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
        type: 'TOP',
      };

      const testError = new Error('Creation error');
      (Apparel.create as jest.Mock).mockRejectedValue(testError);

      await expect(createNewApparel(newApparelData)).rejects.toThrow(
        'Creation error'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.create).toHaveBeenCalledWith(newApparelData);
    });
  });

  describe('findApparelById', () => {
    it('should connect to the database and find an apparel item by id', async () => {
      const mockApparelItem = {
        id: 'test-id-123',
        title: 'Test Shirt',
        pictureURL: 'https://example.com/test.jpg',
        type: 'TOP',
      };

      (Apparel.findOne as jest.Mock).mockResolvedValue(mockApparelItem);

      const result = await findApparelById('test-id-123');

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOne).toHaveBeenCalledWith({ id: 'test-id-123' });
      expect(result).toEqual(mockApparelItem);
    });

    it('should return null if apparel item is not found', async () => {
      (Apparel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await findApparelById('non-existent-id');

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOne).toHaveBeenCalledWith({ id: 'non-existent-id' });
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Find error');
      (Apparel.findOne as jest.Mock).mockRejectedValue(testError);

      await expect(findApparelById('test-id-123')).rejects.toThrow(
        'Find error'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOne).toHaveBeenCalledWith({ id: 'test-id-123' });
    });
  });

  describe('updateApparelById', () => {
    it('should connect to the database and update an apparel item', async () => {
      const mockUpdatedApparel = {
        id: 'test-id-123',
        title: 'Updated Shirt',
        pictureURL: 'https://example.com/updated.jpg',
        type: 'TOP',
      };

      const updateData = {
        title: 'Updated Shirt',
        pictureURL: 'https://example.com/updated.jpg',
      };

      (Apparel.findOneAndUpdate as jest.Mock).mockResolvedValue(
        mockUpdatedApparel
      );

      const result = await updateApparelById('test-id-123', updateData);

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'test-id-123' },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedApparel);
    });

    it('should return null if apparel item to update is not found', async () => {
      const updateData = {
        title: 'Updated Shirt',
      };

      (Apparel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await updateApparelById('non-existent-id', updateData);

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'non-existent-id' },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const updateData = {
        title: 'Updated Shirt',
      };

      const testError = new Error('Update error');
      (Apparel.findOneAndUpdate as jest.Mock).mockRejectedValue(testError);

      await expect(
        updateApparelById('test-id-123', updateData)
      ).rejects.toThrow('Update error');

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'test-id-123' },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    });
  });

  describe('deleteApparelById', () => {
    it('should connect to the database and delete an apparel item', async () => {
      const mockDeletedApparel = {
        id: 'test-id-123',
        title: 'Deleted Shirt',
        pictureURL: 'https://example.com/deleted.jpg',
        type: 'TOP',
      };

      (Apparel.findOneAndDelete as jest.Mock).mockResolvedValue(
        mockDeletedApparel
      );

      const result = await deleteApparelById('test-id-123');

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndDelete).toHaveBeenCalledWith({
        id: 'test-id-123',
      });
      expect(result).toEqual(mockDeletedApparel);
    });

    it('should return null if apparel item to delete is not found', async () => {
      (Apparel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await deleteApparelById('non-existent-id');

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndDelete).toHaveBeenCalledWith({
        id: 'non-existent-id',
      });
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Delete error');
      (Apparel.findOneAndDelete as jest.Mock).mockRejectedValue(testError);

      await expect(deleteApparelById('test-id-123')).rejects.toThrow(
        'Delete error'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Apparel.findOneAndDelete).toHaveBeenCalledWith({
        id: 'test-id-123',
      });
    });
  });
});

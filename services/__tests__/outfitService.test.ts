jest.mock('@/database/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { 
  getAllOutfits, 
  createOutfit, 
  getOutfitById, 
  updateOutfitById, 
  deleteOutfitById 
} from '../outfitServices';
import connectDB from '@/database/db';
import Outfit from '@/database/models/outfits';
import Apparel from '@/database/models/apparel';

jest.mock('@/database/models/outfits', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn()
}));

jest.mock('@/database/models/apparel', () => ({}));

describe('Outfit Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOutfits', () => {
    it('should connect to the database and return all outfits with populated fields', async () => {
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

      (Outfit.find as jest.Mock).mockReturnValue({
        populate: mockPopulate,
        sort: mockSort,
      });

      const result = await getAllOutfits();

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.find).toHaveBeenCalledWith({});

      expect(mockPopulate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'topID',
            model: Apparel,
            foreignField: 'id',
            localField: 'topID',
          }),
          expect.objectContaining({
            path: 'bottomID',
            model: Apparel,
            foreignField: 'id',
            localField: 'bottomID',
          }),
          expect.objectContaining({
            path: 'shoesID',
            model: Apparel,
            foreignField: 'id',
            localField: 'shoesID',
          }),
          expect.objectContaining({
            path: 'coatID',
            model: Apparel,
            foreignField: 'id',
            localField: 'coatID',
          }),
        ])
      );

      expect(mockSort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(mockOutfits);
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Database error');
      (Outfit.find as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      await expect(getAllOutfits()).rejects.toThrow('Database error');

      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('createOutfit', () => {
    it('should connect to the database and create a new outfit', async () => {
      const mockOutfit = {
        id: '123',
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
      };

      const newOutfitData = {
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
      };

      (Outfit.create as jest.Mock).mockResolvedValue(mockOutfit);

      const result = await createOutfit(newOutfitData);

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.create).toHaveBeenCalledWith(newOutfitData);
      expect(result).toEqual(mockOutfit);
    });

    it('should propagate errors from the database when creating', async () => {
      const newOutfitData = {
        title: 'New Outfit',
        topID: 'top123',
        bottomID: 'bottom123',
        shoesID: 'shoes123',
        tags: ['casual', 'spring'],
      };

      const testError = new Error('Creation error');
      (Outfit.create as jest.Mock).mockRejectedValue(testError);

      await expect(createOutfit(newOutfitData)).rejects.toThrow(
        'Creation error'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.create).toHaveBeenCalledWith(newOutfitData);
    });
  });

  describe('getOutfitById', () => {
    it('should connect to the database and return an outfit by ID', async () => {
      const mockOutfit = {
        id: 'outfit-123',
        title: 'Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1',
        tags: ['summer', 'casual']
      };

      const mockPopulate = jest.fn().mockResolvedValue(mockOutfit);
      (Outfit.findOne as jest.Mock).mockReturnValue({
        populate: mockPopulate
      });

      const result = await getOutfitById('outfit-123');

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOne).toHaveBeenCalledWith({ id: 'outfit-123' });
      expect(mockPopulate).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ path: 'topID' }),
        expect.objectContaining({ path: 'bottomID' }),
        expect.objectContaining({ path: 'shoesID' }),
        expect.objectContaining({ path: 'coatID' })
      ]));
      expect(result).toEqual(mockOutfit);
    });

    it('should return null if the outfit is not found', async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      (Outfit.findOne as jest.Mock).mockReturnValue({
        populate: mockPopulate
      });

      const result = await getOutfitById('non-existent-id');

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOne).toHaveBeenCalledWith({ id: 'non-existent-id' });
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Find error');
      (Outfit.findOne as jest.Mock).mockImplementation(() => {
        throw testError;
      });

      await expect(getOutfitById('outfit-123')).rejects.toThrow('Find error');
      
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('updateOutfitById', () => {
    it('should connect to the database and update an outfit', async () => {
      const mockUpdatedOutfit = {
        id: 'outfit-123',
        title: 'Updated Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1',
        tags: ['summer', 'casual', 'updated']
      };

      const updateData = {
        title: 'Updated Summer Outfit',
        tags: ['summer', 'casual', 'updated']
      };

      (Outfit.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedOutfit);

      const result = await updateOutfitById('outfit-123', updateData);

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'outfit-123' },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUpdatedOutfit);
    });

    it('should return null if the outfit to update is not found', async () => {
      const updateData = {
        title: 'Updated Outfit'
      };

      (Outfit.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await updateOutfitById('non-existent-id', updateData);

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'non-existent-id' },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const updateData = {
        title: 'Updated Outfit'
      };

      const testError = new Error('Update error');
      (Outfit.findOneAndUpdate as jest.Mock).mockRejectedValue(testError);

      await expect(updateOutfitById('outfit-123', updateData)).rejects.toThrow('Update error');
      
      expect(connectDB).toHaveBeenCalled();
    });
  });

  describe('deleteOutfitById', () => {
    it('should connect to the database and delete an outfit', async () => {
      const mockDeletedOutfit = {
        id: 'outfit-123',
        title: 'Summer Outfit',
        topID: 'top1',
        bottomID: 'bottom1',
        shoesID: 'shoes1'
      };

      (Outfit.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedOutfit);

      const result = await deleteOutfitById('outfit-123');

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOneAndDelete).toHaveBeenCalledWith({ id: 'outfit-123' });
      expect(result).toEqual(mockDeletedOutfit);
    });

    it('should return null if the outfit to delete is not found', async () => {
      (Outfit.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await deleteOutfitById('non-existent-id');

      expect(connectDB).toHaveBeenCalled();
      expect(Outfit.findOneAndDelete).toHaveBeenCalledWith({ id: 'non-existent-id' });
      expect(result).toBeNull();
    });

    it('should propagate errors from the database', async () => {
      const testError = new Error('Delete error');
      (Outfit.findOneAndDelete as jest.Mock).mockRejectedValue(testError);

      await expect(deleteOutfitById('outfit-123')).rejects.toThrow('Delete error');
      
      expect(connectDB).toHaveBeenCalled();
    });
  });
});
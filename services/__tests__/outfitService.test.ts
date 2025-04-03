jest.mock('@/database/db', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { getAllOutfits, createOutfit } from '../outfitServices';
import connectDB from '@/database/db';
import Outfit from '@/database/models/outfits';
import Apparel from '@/database/models/apparel';

jest.mock('@/database/models/outfits', () => ({
  find: jest.fn(),
  create: jest.fn(),
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
});

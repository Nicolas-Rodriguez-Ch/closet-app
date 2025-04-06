import { orchestrateApparelSubmit } from '../orchestarteApparelSubmit';
import { ApparelTypeEnum } from '../types';

global.fetch = jest.fn();

describe('orchestrateApparelSubmit Error Handling', () => {
  let mockFile: File;
  let mockParams: any;

  beforeEach(() => {
    jest.resetAllMocks();

    const blob = new Blob(['test'], { type: 'image/jpeg' });
    mockFile = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    mockParams = {
      apparelTitle: 'Test Title',
      apparelDescription: 'Test Description',
      apparelType: ApparelTypeEnum.TOP,
    };
  });

  describe('Upload Response Error Handling', () => {
    test('should handle non-ok upload response', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Bad Request' }),
        })
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'HTTP error! Status: 400',
      });
    });

    test('should handle missing data in upload response', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'Invalid upload response format',
      });
    });

    test('should handle missing secure_url in upload response', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: {} }),
        })
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'Missing secure_url in upload response',
      });
    });
  });

  describe('Apparel Creation Error Handling', () => {
    test('should handle non-ok apparel creation response', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: { secure_url: 'https://example.com/image.jpg' },
            }),
        })
      );

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Server Error' }),
        })
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'HTTP error! Status: 500',
      });
    });
  });

  describe('Network Error Handling', () => {
    test('should handle network error during upload', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network failure')
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'Network failure',
      });
    });

    test('should handle network error during apparel creation', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: { secure_url: 'https://example.com/image.jpg' },
            }),
        })
      );

      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Apparel creation network error')
      );

      const result = await orchestrateApparelSubmit(mockFile, mockParams);

      expect(result).toEqual({
        success: false,
        error: 'Apparel creation network error',
      });
    });
  });

  describe('Description Handling', () => {
    test('should omit description when empty', async () => {
      const paramsWithEmptyDesc = {
        ...mockParams,
        apparelDescription: '',
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: { secure_url: 'https://example.com/image.jpg' },
            }),
        })
      );

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      );

      await orchestrateApparelSubmit(mockFile, paramsWithEmptyDesc);

      const secondCallArgs = (global.fetch as jest.Mock).mock.calls[1];
      const sentBody = JSON.parse(secondCallArgs[1].body);

      expect(sentBody).toHaveProperty('pictureURL');
      expect(sentBody).toHaveProperty('title');
      expect(sentBody).toHaveProperty('type');
      expect(sentBody).not.toHaveProperty('description');
    });
  });
});

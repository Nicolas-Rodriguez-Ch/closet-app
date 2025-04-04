import { orchestrateApparelSubmit } from '../submitHelper';
import { ApparelTypeEnum } from '../types';
import { API_URL } from '@/public/constants/secrets';

global.fetch = jest.fn();

describe('orchestrateApparelSubmit', () => {
  let mockFile: File;
  let mockParams: any;

  beforeEach(() => {
    jest.resetAllMocks();

    const blob = new Blob(['test'], { type: 'image/jpeg' });
    mockFile = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    mockParams = {
      apparelTitle: 'Test Title',
      apparelDescription: 'Test Description',
      apparelType: 'TOP',
    };
  });

  test('should successfully upload image and create apparel', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              secure_url: 'https://example.com/image.jpg',
            },
          }),
      })
    );

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              id: '123',
              pictureURL: 'https://example.com/image.jpg',
              title: 'Test Title',
              description: 'Test Description',
              type: 'TOP',
            },
          }),
      })
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('data.id', '123');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      `${API_URL}upload`,
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      `${API_URL}apparel`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('pictureURL'),
      })
    );

    const secondCallArgs = (global.fetch as jest.Mock).mock.calls[1];
    const sentBody = JSON.parse(secondCallArgs[1].body);
    expect(sentBody).toHaveProperty(
      'pictureURL',
      'https://example.com/image.jpg'
    );
    expect(sentBody).toHaveProperty('title', 'Test Title');
    expect(sentBody).toHaveProperty('description', 'Test Description');
    expect(sentBody).toHaveProperty('type', 'TOP');
  });

  test('should omit description if it is empty', async () => {
    const paramsWithoutDesc = {
      apparelTitle: 'Test Title',
      apparelDescription: '',
      apparelType: ApparelTypeEnum.TOP,
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

    await orchestrateApparelSubmit(mockFile, paramsWithoutDesc);

    const secondCallArgs = (global.fetch as jest.Mock).mock.calls[1];
    const sentBody = JSON.parse(secondCallArgs[1].body);
    expect(sentBody).not.toHaveProperty('description');
  });

  test('should handle upload API error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error', 'Network error');

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('should handle upload API non-200 response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad Request' }),
      })
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error', 'HTTP error! Status: 400');
  });

  test('should handle missing secure_url in upload response', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
            },
          }),
      })
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty(
      'error',
      'Missing secure_url in upload response'
    );
  });

  test('should handle invalid upload response format', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Success',
          }),
      })
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error', 'Invalid upload response format');
  });

  test('should handle apparel API error', async () => {
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
      new Error('Server error')
    );

    const result = await orchestrateApparelSubmit(mockFile, mockParams);

    expect(result).toHaveProperty('success', false);
    expect(result).toHaveProperty('error', 'Server error');
  });
});

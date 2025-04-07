import { configureStore } from '@reduxjs/toolkit';
import outfitReducer, {
  clearOutfits,
  fetchAllOutfits,
  createOutfit,
  deleteOutfit,
} from '../outfitSlice';
import { OutfitState, IOutfit, CreateOutfitPayload } from '@/lib/types';

jest.mock('@/public/constants/secrets', () => ({
  API_URL: 'http://mock-api/',
}));

global.fetch = jest.fn();

describe('outfit slice', () => {
  let initialState: OutfitState;

  beforeEach(() => {
    initialState = {
      items: [],
      status: 'idle',
      error: null,
    };

    jest.clearAllMocks();
  });

  const createTestStore = (preloadedState?: OutfitState) => {
    return configureStore({
      reducer: {
        outfit: outfitReducer,
      },
      preloadedState: preloadedState ? { outfit: preloadedState } : undefined,
    });
  };

  const mockOutfit: IOutfit = {
    id: 'outfit-1',
    title: 'Casual Day',
    topID: 'top-1',
    bottomID: 'bottom-1',
    shoesID: 'shoes-1',
    tags: ['casual', 'spring'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOutfitArray: IOutfit[] = [
    mockOutfit,
    {
      id: 'outfit-2',
      title: 'Formal',
      topID: 'top-2',
      bottomID: 'bottom-2',
      shoesID: 'shoes-2',
      tags: ['formal', 'work'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  describe('reducer actions', () => {
    it('should handle initial state', () => {
      const nextState = outfitReducer(undefined, { type: 'unknown' });
      expect(nextState).toEqual(initialState);
    });

    it('should handle clearOutfits', () => {
      const preloadedState: OutfitState = {
        ...initialState,
        items: mockOutfitArray,
      };

      const nextState = outfitReducer(preloadedState, clearOutfits());

      expect(nextState.items).toHaveLength(0);
    });
  });

  describe('async thunks', () => {
    describe('fetchAllOutfits', () => {
      it('should handle successful fetch', async () => {
        const mockDispatch = jest.fn();
        const mockGetState = jest.fn();

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockOutfitArray,
        });

        const result = await fetchAllOutfits()(mockDispatch, mockGetState, {});

        expect(global.fetch).toHaveBeenCalledWith('http://mock-api/outfit');
        expect(result.payload).toEqual(mockOutfitArray);

        const store = createTestStore();

        store.dispatch({
          type: fetchAllOutfits.fulfilled.type,
          payload: mockOutfitArray,
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('succeeded');
        expect(state.items).toEqual(mockOutfitArray);
        expect(state.error).toBeNull();
      });

      it('should handle failed fetch with HTTP error', async () => {
        const store = createTestStore();

        store.dispatch({
          type: fetchAllOutfits.rejected.type,
          payload: 'HTTP error! Status: 404',
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('HTTP error! Status: 404');
      });

      it('should handle fetch with default error message when payload is missing', async () => {
        const store = createTestStore();

        store.dispatch({
          type: fetchAllOutfits.rejected.type,
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to fetch outfit');
      });

      it('should set loading state during fetch', async () => {
        const store = createTestStore();

        store.dispatch({ type: fetchAllOutfits.pending.type });

        const state = store.getState().outfit;
        expect(state.status).toBe('loading');
      });
    });

    describe('createOutfit', () => {
      const mockOutfitPayload: CreateOutfitPayload = {
        title: 'New Outfit',
        topID: 'top-1',
        bottomID: 'bottom-1',
        shoesID: 'shoes-1',
        tags: ['new', 'casual'],
      };

      it('should handle successful outfit creation', async () => {
        const mockDispatch = jest.fn();
        const mockGetState = jest.fn();

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockOutfit,
        });

        const result = await createOutfit(mockOutfitPayload)(
          mockDispatch,
          mockGetState,
          {}
        );

        expect(global.fetch).toHaveBeenCalledWith(
          'http://mock-api/outfit',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOutfitPayload),
          })
        );

        expect(result.payload).toEqual(mockOutfit);

        const store = createTestStore();

        store.dispatch({
          type: createOutfit.fulfilled.type,
          payload: mockOutfit,
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('succeeded');
        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual(mockOutfit);
      });

      it('should handle createOutfit rejection', async () => {
        const store = createTestStore();

        store.dispatch({
          type: createOutfit.rejected.type,
          payload: 'Creation failed',
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Creation failed');
      });

      it('should handle createOutfit with default error message when payload is missing', async () => {
        const store = createTestStore();

        store.dispatch({
          type: createOutfit.rejected.type,
        });

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to create outfit');
      });
    });

    describe('deleteOutfit', () => {
      it('should handle successful outfit deletion', async () => {
        const preloadedState: OutfitState = {
          ...initialState,
          items: [mockOutfit],
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Successfully deleted' }),
        });

        const store = createTestStore(preloadedState);
        await store.dispatch(deleteOutfit(mockOutfit.id));

        expect(global.fetch).toHaveBeenCalledWith(
          `http://mock-api/outfit/${mockOutfit.id}`,
          expect.objectContaining({ method: 'DELETE' })
        );

        const state = store.getState().outfit;
        expect(state.status).toBe('succeeded');
        expect(state.items).toHaveLength(0);
      });

      it('should handle deleteOutfit rejection', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

        const store = createTestStore();
        await store.dispatch(deleteOutfit('non-existent-id'));

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('HTTP Error! Status: 404');
      });

      it('should handle deleteOutfit with network error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(
          new Error('Network failure')
        );

        const store = createTestStore();
        await store.dispatch(deleteOutfit('test-id'));

        const state = store.getState().outfit;
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Network failure');
      });
    });
  });

  describe('thunk internal error handling', () => {
    it('should handle errors in fetchAllOutfits', async () => {
      const store = createTestStore();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );
      await store.dispatch(fetchAllOutfits());

      const state = store.getState().outfit;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
    });

    it('should handle errors in createOutfit', async () => {
      const store = createTestStore();
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      const mockPayload = {
        title: 'Test',
        topID: 'top-1',
        bottomID: 'bottom-1',
        shoesID: 'shoes-1',
        tags: ['test'],
      };

      await store.dispatch(createOutfit(mockPayload));
      const state = store.getState().outfit;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('HTTP error! Status: 400');
    });
    
    it('should handle HTTP error in fetchAllOutfits response', async () => {
      const store = createTestStore();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });
      
      await store.dispatch(fetchAllOutfits());
      
      const state = store.getState().outfit;
      expect(state.status).toBe('failed');
      expect(state.error).toBe('HTTP error! Status: 403');
    });
  });
});

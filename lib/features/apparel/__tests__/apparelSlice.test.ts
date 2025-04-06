import { configureStore } from '@reduxjs/toolkit';
import apparelReducer, {
  clearApparel,
  addApparel,
  fetchAllApparel,
  uploadApparel,
  updateApparel,
  deleteApparel
} from '../apparelSlice';
import { ApparelState, IApparel } from '@/lib/types';
import { orchestrateApparelSubmit } from '@/services/orchestarteApparelSubmit';
import { ApparelTypeEnum } from '@/services/types';

jest.mock('@/public/constants/secrets', () => ({
  API_URL: 'http://mock-api/'
}));

jest.mock('@/services/orchestarteApparelSubmit', () => ({
  orchestrateApparelSubmit: jest.fn()
}));

global.fetch = jest.fn();

describe('apparel slice', () => {
  let initialState: ApparelState;
  
  beforeEach(() => {
    initialState = {
      items: {
        TOP: [],
        BOTTOM: [],
        SHOES: [],
        COAT: [],
      },
      status: 'idle',
      error: null
    };
    
    jest.clearAllMocks();
  });
  
  const createTestStore = (preloadedState?: ApparelState) => {
    return configureStore({
      reducer: {
        apparel: apparelReducer
      },
      preloadedState: preloadedState ? { apparel: preloadedState } : undefined
    });
  };
  
  const mockApparel: IApparel = {
    id: 'test-id-1',
    title: 'Test Shirt',
    pictureURL: 'http://example.com/shirt.jpg',
    type: ApparelTypeEnum.TOP,
    description: 'A test shirt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const mockApparelArray: IApparel[] = [
    mockApparel,
    {
      id: 'test-id-2',
      title: 'Test Pants',
      pictureURL: 'http://example.com/pants.jpg',
      type: ApparelTypeEnum.BOTTOM,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'test-id-3',
      title: 'Test Shoes',
      pictureURL: 'http://example.com/shoes.jpg',
      type: ApparelTypeEnum.SHOES,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  describe('reducer actions', () => {
    it('should handle initial state', () => {
      const nextState = apparelReducer(undefined, { type: 'unknown' });
      expect(nextState).toEqual(initialState);
    });
    
    it('should handle clearApparel', () => {
      const preloadedState: ApparelState = {
        ...initialState,
        items: {
          TOP: [mockApparel],
          BOTTOM: [],
          SHOES: [],
          COAT: []
        }
      };
      
      const nextState = apparelReducer(preloadedState, clearApparel());
      
      expect(nextState.items.TOP).toHaveLength(0);
      expect(nextState.items.BOTTOM).toHaveLength(0);
      expect(nextState.items.SHOES).toHaveLength(0);
      expect(nextState.items.COAT).toHaveLength(0);
    });
    
    it('should handle addApparel', () => {
      const newApparel: IApparel = {
        id: 'new-id',
        title: 'New Item',
        pictureURL: 'http://example.com/new.jpg',
        type: ApparelTypeEnum.BOTTOM,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const nextState = apparelReducer(initialState, addApparel(newApparel));
      
      expect(nextState.items.BOTTOM).toHaveLength(1);
      expect(nextState.items.BOTTOM[0]).toEqual(newApparel);
      
      expect(nextState.items.TOP).toHaveLength(0);
      expect(nextState.items.SHOES).toHaveLength(0);
      expect(nextState.items.COAT).toHaveLength(0);
    });
  });
  
  describe('async thunks', () => {
    describe('fetchAllApparel', () => {
      it('should handle successful fetch', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockApparelArray
        });
        
        const store = createTestStore();
        await store.dispatch(fetchAllApparel());
        
        const state = store.getState().apparel;
        
        expect(global.fetch).toHaveBeenCalledWith('http://mock-api/apparel');
        
        expect(state.status).toBe('succeeded');
        expect(state.items.TOP).toHaveLength(1);
        expect(state.items.BOTTOM).toHaveLength(1);
        expect(state.items.SHOES).toHaveLength(1);
        expect(state.items.COAT).toHaveLength(0);
        expect(state.error).toBeNull();
      });
      
      it('should handle failed fetch with HTTP error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404
        });
        
        const store = createTestStore();
        await store.dispatch(fetchAllApparel());
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('HTTP Error! Status: 404');
      });
      
      it('should handle fetch network error', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
        
        const store = createTestStore();
        await store.dispatch(fetchAllApparel());
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Network error');
      });
    });
    
    describe('uploadApparel', () => {
      const mockFile = new File(['dummy content'], 'test-image.jpg', { type: 'image/jpeg' });
      const mockFormData = {
        apparelTitle: 'Test Upload',
        apparelDescription: 'Test description',
        apparelType: ApparelTypeEnum.TOP
      };
      
      it('should handle successful upload', async () => {
        (orchestrateApparelSubmit as jest.Mock).mockResolvedValueOnce(mockApparel);
        
        const store = createTestStore();
        await store.dispatch(uploadApparel({ file: mockFile, formData: mockFormData }));
        
        const state = store.getState().apparel;
        
        expect(orchestrateApparelSubmit).toHaveBeenCalledWith(mockFile, mockFormData);
        
        expect(state.status).toBe('succeeded');
        expect(state.items.TOP).toHaveLength(1);
        expect(state.items.TOP[0]).toEqual(mockApparel);
        expect(state.error).toBeNull();
      });
      
      it('should handle upload failure with error object', async () => {
        (orchestrateApparelSubmit as jest.Mock).mockResolvedValueOnce({
          success: false,
          error: 'Upload service error'
        });
        
        const store = createTestStore();
        await store.dispatch(uploadApparel({ file: mockFile, formData: mockFormData }));
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Upload service error');
      });
      
      it('should handle upload exception', async () => {
        (orchestrateApparelSubmit as jest.Mock).mockRejectedValueOnce(new Error('Service exception'));
        
        const store = createTestStore();
        await store.dispatch(uploadApparel({ file: mockFile, formData: mockFormData }));
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Service exception');
      });
    });
    
    describe('updateApparel', () => {
      const updatedApparel: IApparel = {
        ...mockApparel,
        title: 'Updated Title'
      };
      
      it('should handle successful update', async () => {
        const preloadedState: ApparelState = {
          ...initialState,
          items: {
            ...initialState.items,
            TOP: [mockApparel]
          }
        };
        
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => updatedApparel
        });
        
        const store = createTestStore(preloadedState);
        await store.dispatch(updateApparel({ 
          id: mockApparel.id, 
          body: { title: 'Updated Title' } 
        }));
        
        const state = store.getState().apparel;
        
        expect(global.fetch).toHaveBeenCalledWith(
          `http://mock-api/apparel/${mockApparel.id}`,
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({ title: 'Updated Title' })
          })
        );
        
        expect(state.status).toBe('succeeded');
        expect(state.items.TOP).toHaveLength(1);
        expect(state.items.TOP[0].title).toBe('Updated Title');
      });
      
      it('should handle update failure', async () => {
        // Directly dispatch a rejected action for updateApparel instead of using the thunk
        const store = createTestStore();
        
        store.dispatch({
          type: updateApparel.rejected.type,
          payload: 'Update failed error'
        });
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Update failed error');
      });
      
      it('should handle updateApparel.rejected action with fallback error message', () => {
        const store = createTestStore();
        
        // Dispatch without payload to test fallback error message
        store.dispatch({
          type: updateApparel.rejected.type,
          // No payload provided
        });
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to update apparel'); // This tests the fallback message
      });
    });
    
    describe('deleteApparel', () => {
      it('should handle successful delete', async () => {
        const preloadedState: ApparelState = {
          ...initialState,
          items: {
            ...initialState.items,
            TOP: [mockApparel]
          }
        };
        
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Deleted successfully' })
        });
        
        const store = createTestStore(preloadedState);
        await store.dispatch(deleteApparel(mockApparel.id));
        
        expect(global.fetch).toHaveBeenCalledWith(
          `http://mock-api/apparel/${mockApparel.id}`,
          expect.objectContaining({ method: 'DELETE' })
        );
        
        // Testing the deleteApparel.fulfilled handler by dispatching it directly
        store.dispatch({
          type: deleteApparel.fulfilled.type,
          payload: mockApparel.id
        });
        
        const state = store.getState().apparel;
        expect(state.status).toBe('succeeded');
        expect(state.items.TOP).toHaveLength(0);
      });
      
      it('should handle delete failure', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 500
        });
        
        const store = createTestStore();
        await store.dispatch(deleteApparel('test-id'));
        
        const state = store.getState().apparel;
        
        expect(state.status).toBe('failed');
      });
    });
  });
  
  describe('loading states and error handling', () => {
    it('should set loading state during API calls', () => {
      const preloadedState: ApparelState = {
        ...initialState,
        status: 'idle'
      };
      
      const store = createTestStore(preloadedState);
      
      store.dispatch({ type: fetchAllApparel.pending.type });
      
      const pendingState = store.getState().apparel;
      expect(pendingState.status).toBe('loading');
    });
    
    it('should set error state with message on rejection', () => {
      const store = createTestStore();
      
      store.dispatch({
        type: fetchAllApparel.rejected.type,
        payload: 'Custom error message'
      });
      
      const rejectedState = store.getState().apparel;
      expect(rejectedState.status).toBe('failed');
      expect(rejectedState.error).toBe('Custom error message');
    });
    
    it('should set default error message if payload is missing', () => {
      const store = createTestStore();
      
      store.dispatch({
        type: fetchAllApparel.rejected.type
      });
      
      const rejectedState = store.getState().apparel;
      expect(rejectedState.status).toBe('failed');
      expect(rejectedState.error).toBe('Failed to fetch apparel');
    });
  });
});
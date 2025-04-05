import { makeStore } from '../store';

jest.mock('../features/apparel/apparelSlice', () => ({
  __esModule: true,
  default: (state = { mockApparelState: true }, action) => state,
}));

jest.mock('../features/outfit/outfitSlice', () => ({
  __esModule: true,
  default: (state = { mockOutfitState: true }, action) => state,
}));

describe('Redux Store', () => {
  it('should create a store with the correct reducers', () => {
    const store = makeStore();

    expect(store.getState()).toEqual({
      apparel: { mockApparelState: true },
      outfit: { mockOutfitState: true },
    });
  });

  it('should handle dispatched actions', () => {
    const store = makeStore();
    const testAction = { type: 'TEST_ACTION' };
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    store.dispatch(testAction);

    expect(dispatchSpy).toHaveBeenCalledWith(testAction);
  });

  it('should have the correct reducer keys', () => {
    const store = makeStore();
    const state = store.getState();
    
    expect(Object.keys(state)).toEqual(['apparel', 'outfit']);
    expect(state.apparel).toBeDefined();
    expect(state.outfit).toBeDefined();
  });
});

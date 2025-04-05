import { configureStore } from '@reduxjs/toolkit';
import apparelReducer from './features/apparel/apparelSlice';
import outfitReducer from './features/outfit/ouffitSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      apparel: apparelReducer,
      outfit: outfitReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

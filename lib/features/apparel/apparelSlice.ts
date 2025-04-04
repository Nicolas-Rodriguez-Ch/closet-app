import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '@/public/constants/secrets';
import { ApparelState, IApparel } from '@/lib/types';

const initialState: ApparelState = {
  items: {
    TOP: [],
    BOTTOM: [],
    SHOES: [],
    COAT: [],
  },
  status: 'idle',
  error: null,
};

export const fetchAllApparel = createAsyncThunk(
  'apparel/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}apparel`);
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const apparelSlice = createSlice({
  name: 'apparel',
  initialState,
  reducers: {
    clearApparel: (state) => {
      state.items = {
        TOP: [],
        BOTTOM: [],
        SHOES: [],
        COAT: [],
      };
    },
    addApparel: (state, action: PayloadAction<IApparel>) => {
      const apparel = action.payload;
      state.items[apparel.type].push(apparel);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllApparel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchAllApparel.fulfilled,
        (state, action: PayloadAction<IApparel[]>) => {
          state.status = 'succeeded';

          state.items = {
            TOP: [],
            BOTTOM: [],
            SHOES: [],
            COAT: [],
          };

          action.payload.forEach((apparel) => {
            state.items[apparel.type].push(apparel);
          });
        }
      )
      .addCase(fetchAllApparel.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string) || 'Failed to fetch apparel item';
      });
  },
});

export const { clearApparel, addApparel } = apparelSlice.actions;
export default apparelSlice.reducer;

import { CreateOutfitPayload, IOutfit, OutfitState } from '@/lib/types';
import { API_URL } from '@/public/constants/secrets';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: OutfitState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchAllOutfits = createAsyncThunk(
  'outfit/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}outfit`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      rejectWithValue((error as Error).message);
    }
  }
);

export const createOutfit = createAsyncThunk(
  'outfit/create',
  async (outfitData: CreateOutfitPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outfitData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      rejectWithValue((error as Error).message);
    }
  }
);

export const deleteOutfit = createAsyncThunk(
  'outfit/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}outfit/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const outfitSlice = createSlice({
  name: 'outfit',
  initialState,
  reducers: {
    clearOutfits: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOutfits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchAllOutfits.fulfilled,
        (state, action: PayloadAction<IOutfit[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchAllOutfits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch outfit';
      })
      .addCase(createOutfit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        createOutfit.fulfilled,
        (state, action: PayloadAction<IOutfit>) => {
          state.status = 'succeeded';
          state.items.push(action.payload);
        }
      )
      .addCase(createOutfit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to create outfit';
      })
      .addCase(deleteOutfit.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        deleteOutfit.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(
            (outfit) => outfit.id !== action.payload
          );
        }
      )
      .addCase(deleteOutfit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to delete outfit';
      });
  },
});

export const { clearOutfits } = outfitSlice.actions;
export default outfitSlice.reducer;

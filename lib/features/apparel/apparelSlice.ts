import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '@/public/constants/secrets';
import { ApparelState, IApparel } from '@/lib/types';
import { ApparelForm } from '@/services/types';
import { orchestrateApparelSubmit } from '@/services/orchestarteApparelSubmit';

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

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const uploadApparel = createAsyncThunk(
  'apparel/upload',
  async (
    { file, formData }: { file: File; formData: ApparelForm },
    { rejectWithValue }
  ) => {
    try {
      const result = await orchestrateApparelSubmit(file, formData);
      if (result.success === false || result.error) {
        return rejectWithValue(result.error || 'Upload Failed');
      }
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Upload failed');
    }
  }
);

export const updateApparel = createAsyncThunk(
  'apparel/update',
  async ({ id, body }: { id: string; body: any }, { rejectWithValue }) => {
    try {
      const result = await fetch(`${API_URL}apparel/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!result.ok) {
        throw new Error(`HTTP Error! Status: ${result.status}`);
      }
      return await result.json();
    } catch (error) {
      rejectWithValue((error as Error).message || 'Failed to update.');
    }
  }
);

export const deleteApparel = createAsyncThunk(
  'apparel/delete',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const result = await fetch(`${API_URL}apparel/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!result.ok) {
        throw new Error(`HTTP Error! Status: ${result.status}`);
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to delete item.'
      );
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
        state.error = (action.payload as string) || 'Failed to fetch apparel';
      })

      .addCase(uploadApparel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        uploadApparel.fulfilled,
        (state, action: PayloadAction<IApparel>) => {
          state.status = 'succeeded';
          state.items[action.payload.type].push(action.payload);
        }
      )
      .addCase(uploadApparel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to upload apparel';
      })
      .addCase(updateApparel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        updateApparel.fulfilled,
        (state, action: PayloadAction<IApparel>) => {
          state.status = 'succeeded';
          state.items[action.payload.type] = state.items[
            action.payload.type
          ].map((item) =>
            item.id === action.payload.id ? action.payload : item
          );
        }
      )
      .addCase(updateApparel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to update apparel';
      })
      .addCase(deleteApparel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApparel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const categories = ['TOP', 'BOTTOM', 'SHOES', 'COAT'] as const;
        categories.forEach((category) => {
          state.items[category] = state.items[category].filter(
            (item) => item.id !== action.payload
          );
        });
      })
      .addCase(deleteApparel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to delete item';
      });
  },
});

export const { clearApparel, addApparel } = apparelSlice.actions;
export default apparelSlice.reducer;

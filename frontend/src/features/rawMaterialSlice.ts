import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface RawMaterial {
  id: string;
  code: string;
  name: string;
  stockQuantity: number;
}

export const fetchMaterials = createAsyncThunk('materials/fetch', async () => {
  const response = await api.get('/raw-materials');
  return response.data;
});

const rawMaterialSlice = createSlice({
  name: 'materials',
  initialState: { items: [] as RawMaterial[], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMaterials.fulfilled, (state, action) => {
    state.items = action.payload.data;
    });
  },
});

export default rawMaterialSlice.reducer;
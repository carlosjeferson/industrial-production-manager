import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const response = await api.get('/products');
  return response.data;
});

export const fetchProductionSuggestion = createAsyncThunk('products/fetchSuggestion', async () => {
  const response = await api.get('/products/production/suggestion');
  return response.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { 
    items: [], 
    suggestion: { suggestion: [], totalValue: 0 }, 
    status: 'idle' 
},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.items = action.payload.data ;
    });
    builder.addCase(fetchProductionSuggestion.fulfilled, (state, action) => {
      state.suggestion = action.payload.data || action.payload;
      state.status = 'succeeded';
    });
  },
});

export default productSlice.reducer;
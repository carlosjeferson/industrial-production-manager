import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from '../features/rawMaterialSlice';
import productReducer from '../features/productSlice';

export const store = configureStore({
  reducer: {
    materials: rawMaterialReducer,
    products: productReducer, 
  },
});

// Essas exportações de tipo são essenciais para o TypeScript não reclamar
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
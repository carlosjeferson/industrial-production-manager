import { configureStore } from '@reduxjs/toolkit';
import rawMaterialReducer from '../features/rawMaterialSlice';
import productReducer from '../features/productSlice';

export const store = configureStore({
  reducer: {
    materials: rawMaterialReducer,
    products: productReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
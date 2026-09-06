import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/hardware';

export interface ProductState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  searchQuery: string;
  sortBy: string;
  activeProduct: Product | null;
}

const initialState: ProductState = {
  selectedCategory: null,
  selectedBrand: null,
  searchQuery: '',
  sortBy: 'featured',
  activeProduct: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action: PayloadAction<string | null>) => {
      state.selectedBrand = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setActiveProduct: (state, action: PayloadAction<Product | null>) => {
      state.activeProduct = action.payload;
    },
  },
});

export const {
  setSelectedCategory,
  setSelectedBrand,
  setSearchQuery,
  setSortBy,
  setActiveProduct,
} = productSlice.actions;

export default productSlice.reducer;

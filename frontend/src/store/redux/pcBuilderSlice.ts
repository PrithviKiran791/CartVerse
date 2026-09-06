import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/hardware';

export interface PCBuilderState {
  cpu: Product | null;
  gpu: Product | null;
  motherboard: Product | null;
  ram: Product | null;
  storage: Product | null;
  psu: Product | null;
  cooler: Product | null;
  case: Product | null;
  monitor: Product | null;
  cables: Product | null;
  lastAddedSlot: string | null;
}

const initialState: PCBuilderState = {
  cpu: null,
  gpu: null,
  motherboard: null,
  ram: null,
  storage: null,
  psu: null,
  cooler: null,
  case: null,
  monitor: null,
  cables: null,
  lastAddedSlot: null,
};

export const pcBuilderSlice = createSlice({
  name: 'pcBuilder',
  initialState,
  reducers: {
    setComponent: (
      state,
      action: PayloadAction<{ slot: keyof Omit<PCBuilderState, 'lastAddedSlot'>; product: Product }>
    ) => {
      state[action.payload.slot] = action.payload.product as any;
      state.lastAddedSlot = action.payload.slot as string;
    },
    removeComponent: (
      state,
      action: PayloadAction<keyof Omit<PCBuilderState, 'lastAddedSlot'>>
    ) => {
      state[action.payload] = null as any;
    },
    clearBuild: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setComponent, removeComponent, clearBuild } = pcBuilderSlice.actions;
export default pcBuilderSlice.reducer;

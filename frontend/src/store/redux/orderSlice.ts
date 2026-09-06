import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { createOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;

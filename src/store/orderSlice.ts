import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Order, OrderState } from "./types/order";

// Load orders from localStorage
const loadOrdersFromLocalStorage = (): Order[] => {
  const savedOrders = localStorage.getItem("orders");
  return savedOrders ? JSON.parse(savedOrders) : [];
};

const initialState: OrderState = {
  orders: loadOrdersFromLocalStorage(),
};

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    clearOrders: (state) => {
      state.orders = [];
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    editOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id
      );
      if (index !== -1) {
        state.orders[index] = action.payload;
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload
      );
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
  },
});

export const { addOrder, clearOrders, editOrder, deleteOrder } =
  orderSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectTotalAmount = (state: RootState) =>
  state.orders.orders.reduce((total, order) => total + order.amount, 0);

export default orderSlice.reducer;

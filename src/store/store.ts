import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./orderSlice";
import companyReducer from "./companySilice"; // Import the company slice reducer

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    company: companyReducer, // Add the company slice here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loadingOrders: false,
  ordersErr: "",
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    ordersStart: (state, action) => {
      state.loadingOrders = true;
    },
    ordersSuccess: (state, action) => {
      state.ordersErr = "";
      state.loadingOrders = false;
      state.orders = action.payload;
    },
    ordersFailure: (state, action) => {
      state.loadingOrders = false;
      state.ordersErr = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = [];
      state.loadingOrders = false;
      state.ordersErr = "";
    },
  },
});

export const { ordersStart, ordersFailure, ordersSuccess, setOrders } =
  ordersSlice.actions;
export default ordersSlice.reducer;

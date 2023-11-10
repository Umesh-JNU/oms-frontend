import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: [],
  loadingOrder: false,
  orderErr: "",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    orderStart: (state, action) => {
      state.loadingOrder = true;
      state.orderErr = "";
    },
    orderSuccess: (state, action) => {
      state.loadingOrder = false;
      state.orderErr = "";
      state.orderDetails = action.payload;
    },
    orderFailure: (state, action) => {
      state.loadingOrder = false;
      state.orderErr = action.payload;
    },
    setOrder: (state, action) => {
      state.orderDetails = [];
      state.loadingOrder = false;
      state.orderErr = "";
    },
  },
});

export const { orderStart, orderFailure, orderSuccess, setOrder } =
  orderSlice.actions;
export default orderSlice.reducer;

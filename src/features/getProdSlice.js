import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: null,
  loadingProduct: false,
  productErr: "",
};

const getProdSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    getProductStart: (state, action) => {
      state.loadingProduct = true;
    },
    getProductSuccess: (state, action) => {
      state.loadingProduct = false;
      state.productErr = "";
      state.product = action.payload;
    },
    getProductFailure: (state, action) => {
      state.loadingProduct = false;
      state.productErr = action.payload;
    },
  },
});

export const { getProductFailure, getProductStart, getProductSuccess } =
  getProdSlice.actions;
export default getProdSlice.reducer;

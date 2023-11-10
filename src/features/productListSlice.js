import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  productsCount: null,
  loading: false,
  error: "",
};

const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
    getProductListStart: (state, action) => {
      state.loading = true;
      state.error = "";
    },
    getProductListSuccess: (state, action) => {
      state.loading = false;
      state.error = "";
      state.products = action.payload;
      state.productsCount = action.payload?.length;
    },
    getProductListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getProductListFailure,
  getProductListStart,
  getProductListSuccess,
} = productListSlice.actions;
export default productListSlice.reducer;

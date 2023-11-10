import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  relatedProducts: [],
  loadingRelatedProds: false,
  relatedProdsErr: "",
};

const relatedProducts = createSlice({
  name: "relatedPrds",
  initialState,
  reducers: {
    relatedProdsStart: (state, action) => {
      state.loadingRelatedProds = true;
    },
    relatedProdsSuccess: (state, action) => {
      state.relatedProdsErr = "";
      state.loadingRelatedProds = false;
      state.relatedProducts = action.payload;
    },
    relatedProdsFailure: (state, action) => {
      state.loadingRelatedProds = false;
      state.relatedProdsErr = action.payload;
    },
  },
});

export const { relatedProdsSuccess, relatedProdsStart, relatedProdsFailure } =
  relatedProducts.actions;
export default relatedProducts.reducer;

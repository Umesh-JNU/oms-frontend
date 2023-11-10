import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingDetails: [],
  loading: false,
  error: "",
};

const shippingDetailsSlice = createSlice({
  name: "shippingDetails",
  initialState,
  reducers: {
    shippingDetailsStart: (state, action) => {
      state.loading = true;
    },
    shippingDetailsSuccess: (state, action) => {
      state.error = "";
      state.loading = false;
      state.shippingDetails = action.payload;
    },
    shippingDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setshippingDetails: (state, action) => {
      state.shippingDetails = [];
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  shippingDetailsFailure,
  shippingDetailsStart,
  shippingDetailsSuccess,
  setshippingDetails,
} = shippingDetailsSlice.actions;
export default shippingDetailsSlice.reducer;

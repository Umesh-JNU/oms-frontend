import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addresses: [],
  loadingAddr: false,
  addressesErr: "",
};

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addressesStart: (state, action) => {
      state.loadingAddr = true;
    },
    addressesSuccess: (state, action) => {
      state.addressesErr = "";
      state.loadingAddr = false;
      state.addresses = action.payload;
    },
    addressesFailure: (state, action) => {
      state.loadingAddr = false;
      state.addressesErr = action.payload;
    },
    setaddresses: (state, action) => {
      state.addresses = [];
      state.loadingAddr = false;
      state.addressesErr = "";
    },
  },
});

export const {
  addressesStart,
  addressesFailure,
  addressesSuccess,
  setaddresses,
} = addressesSlice.actions;
export default addressesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressCheck: '',
  charges: null,
  free_ship: null,
  total: null,
  message: "",
  fetchingAddr: false,
  fetchingUpdate: false,
  addressErr: "",
  updateErr: "",
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addressStart: (state, action) => {
      state.fetchingAddr = true;
    },
    addressSuccess: (state, action) => {
      state.addressErr = "";
      state.fetchingAddr = false;
      state.addressCheck = action.payload;
    },
    addressFailure: (state, action) => {
      state.fetchingAddr = false;
      state.addressErr = action.payload;
    },
    updateStart: (state, action) => {
      state.fetchingUpdate = true;
    },
    updateSuccess: (state, action) => {
      state.fetchingUpdate = false;
      state.updateErr = "";

      state.charges = action.payload.charges;
      state.free_ship = action.payload.free_ship;
      state.total = action.payload.total;
      state.message = action.payload.message;
    },
    updateFailure: (state, action) => {
      state.fetchingUpdate = false;
      state.updateErr = action.payload;
    },
    setaddress: (state, action) => {
      state.addressCheck = "";
      state.charges = null;
      state.total = null;
      state.free_ship = null;
      state.message = "";
      state.fetchingAddr = false;
      state.fetchingUpdate = false;
      state.addressErr = "";
      state.updateErr = "";
    },
  },
});

export const {
  addressStart,
  addressFailure,
  addressSuccess,
  setaddress,
  updateFailure,
  updateStart,
  updateSuccess,
} = addressSlice.actions;
export default addressSlice.reducer;

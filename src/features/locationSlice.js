import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    locationSuccess: (state, action) => {
      state.location = action.payload;
    },
    setLocation: (state, action) => {
      state.location = false;
    },
  },
});

export const { locationSuccess, setLocation } = locationSlice.actions;
export default locationSlice.reducer;

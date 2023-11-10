import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ageCheck: null,
};

const ageCheckSlice = createSlice({
  name: "ageCheck",
  initialState,
  reducers: {
    ageCheckSuccess: (state, action) => {
      state.ageCheck = action.payload;
    },
    setageCheck: (state, action) => {
      state.ageCheck = false;
    },
  },
});

export const { ageCheckSuccess, setageCheck } = ageCheckSlice.actions;
export default ageCheckSlice.reducer;

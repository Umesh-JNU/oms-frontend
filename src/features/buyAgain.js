import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyAgain: [],
  buyAgainLoading: false,
  buyAgainErr: "",
};

const buyAgainSlice = createSlice({
  name: "buyAgain",
  initialState,
  reducers: {
    buyAgainStart: (state, action) => {
      state.buyAgainLoading = true;
    },
    buyAgainSuccess: (state, action) => {
      state.buyAgainErr = "";
      state.buyAgainLoading = false;
      state.buyAgain = action.payload;
    },
    buyAgainFailure: (state, action) => {
      state.buyAgainLoading = false;
      state.buyAgainErr = action.payload;
    },
    setBuyAgain: (state, action) => {
      state.buyAgain = [];
      state.buyAgainLoading = false;
      state.buyAgainErr = "";
    },
  },
});

export const { buyAgainFailure, buyAgainStart, buyAgainSuccess, setBuyAgain } =
  buyAgainSlice.actions;
export default buyAgainSlice.reducer;

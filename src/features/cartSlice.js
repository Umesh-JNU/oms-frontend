import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  isFetching: false,
  cartErr: "",
  inSalePrice: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addTooCartStart: (state, action) => {
      state.isFetching = true;
    },
    addTooCartSuccess: (state, action) => {
      state.isFetching = false;
      state.cartErr = "";

      // console.log("payload ", action.payload?.product);
      const itemIndex = state.cartItems.findIndex(
        (item) => item?.product === action.payload?.product
      );

      // console.log(itemIndex);

      if (itemIndex >= 0) {
        console.log(
          action.payload?.data?.cartItems[itemIndex]?.product?.amount
        );
        state.cartItems[itemIndex] = {
          ...state.cartItems[itemIndex],
          cartQuantity: (state.cartItems[itemIndex].cartQuantity +=
            action.payload?.data?.cartItems[itemIndex]?.quantity),
        };

        state.cartTotalAmount = action.payload?.data?.total;
        state.cartTotalQuantity += 1;
      } else {
        const tempProduct = {
          ...action.payload,
          cartQuantity: action.payload?.data?.cartItems[itemIndex]?.quantity,
        };
        state.cartTotalAmount += action.payload?.data?.total;
        state.cartTotalQuantity += 1;
        state.cartItems.push(tempProduct);
      }
    },
    addTooCartFailure: (state, action) => {
      state.isFetching = false;
      state.cartErr = action.payload;
    },

    updateCartStart: (state, action) => {
      state.isFetching = true;
    },
    updateCartSuccess: (state, action) => {
      state.isFetching = false;
      state.cartErr = "";

      const itemIndex = state.cartItems.findIndex(
        (item) => item?.product?._id === action.payload?.prodId
      );

      if (state.cartItems[itemIndex]?.quantity >= 0) {
        state.cartItems[itemIndex].quantity =
          action.payload?.data?.cartItems[itemIndex]?.quantity;

        state.cartTotalAmount = action.payload?.data?.total;
        state.cartTotalQuantity =
          action.payload?.data?.cartItems[itemIndex]?.quantity;
      }
    },
    updateCartFailure: (state, action) => {
      state.isFetching = false;
      state.cartErr = action.payload;
    },

    deleteFromCartStart: (state, action) => {
      state.isFetching = true;
    },
    deleteFromCartSuccess: (state, action) => {
      state.isFetching = false;
      state.cartErr = "";

      state.cartItems = action.payload?.cartItems;

      state.cartTotalAmount = action.payload?.total;
    },
    deleteFromCartFailure: (state, action) => {
      state.isFetching = false;
      state.cartErr = action.payload;
    },

    getCartStart: (state, action) => {
      state.isFetching = true;
    },
    getCartSuccess: (state, action) => {
      state.isFetching = false;
      state.cartErr = "";

      state.cartItems = action.payload.cartItems;
      state.cartTotalAmount = action.payload?.total;
      state.cartTotalQuantity = action.payload?.cartItems
        ?.map((quan) => quan?.quantity)
        .reduce((res, num) => res + num);
      state.inSalePrice = action.payload.inSalePrice;
    },
    getCartFailure: (state, action) => {
      state.isFetching = false;
      state.cartErr = action.payload;
    },

    setCart: (state, action) => {
      state.cartItems = [];
      state.isFetching = false;
      state.cartTotalAmount = 0;
      state.cartTotalQuantity = 0;
      state.cartErr = "";
    },
  },
});

export const {
  addTooCartSuccess,
  addTooCartStart,
  addTooCartFailure,
  updateCartFailure,
  updateCartStart,
  updateCartSuccess,
  deleteFromCartFailure,
  deleteFromCartStart,
  deleteFromCartSuccess,
  getCartSuccess,
  getCartStart,
  getCartFailure,
  setCart,
} = cartSlice.actions;
export default cartSlice.reducer;

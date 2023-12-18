import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import reviewReducer from "./reviewSlice";
import relatedPrdsReducer from "./relatedProdSlice";
import orderReducer from "./orderSlice";
import couponsCodeReducer from "./couponCodeSlice";
import addressesReducer from "./allAddressSlice";
import addressReducer from "./setChecAddr";
import buyAgainReducer from "./buyAgain";
import locationReducer from "./locationSlice";
import ordersReducer from "./ordersSlice";
import getProductReducer from "./getProdSlice";
import productListReducer from "./productListSlice";
import bannerReducer from "./bannerSlice";
import shippingDetailsReducer from "./shippingDetailsSlice";
import faqReducer from "./faqSlice";
import { productsApi } from "./productsApi";

export default configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    review: reviewReducer,
    relatedPrds: relatedPrdsReducer,
    order: orderReducer,
    coupons: couponsCodeReducer,
    addresses: addressesReducer,
    address: addressReducer,
    location: locationReducer,
    orders: ordersReducer,
    buyAgain: buyAgainReducer,
    banner: bannerReducer,
    product: getProductReducer,
    faq: faqReducer,
    shippingDetails: shippingDetailsReducer,
    productList: productListReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(productsApi.middleware);
  },
});

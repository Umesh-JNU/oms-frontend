import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import useGeoLocation from "react-ipgeolocation";

import ProtectedRoute from "./utils/ProtectedRoute";

import { Header, Footer, NotAllowed, NotFound, Home, SignIn, ForgotPassword, ResetPassword, Profile, Addresses, AllOrders, Order, ProductList, ProductDetails, Cart, Checkout, CheckoutAddr, FaqPage } from "./components";

// import Cart from "./components/Cart";
// import Checkout from "./components/Checkout";
// import Profile from "./components/Profile.js";
// import Addresses from "./components/Addresses";
// import Order from "./components/Order";
// import { useEffect, useLayoutEffect } from "react";
// import { getCart } from "./features/apiCall";
// import AllOrders from "./components/AllOrders";
// import AddReview from "./components/AddReview";
// import CheckoutAddr from "./components/CheckoutAddr";
// import MyCoupons from "./components/MyCoupons";

const comp = [
  { path: "/", comp: <Home /> },
  { path: "/home/sign-in", comp: <SignIn /> },
  { path: "/forgot-password", comp: <ForgotPassword /> },
  { path: "/reset-password/:resetToken", comp: <ResetPassword /> },
  { path: "/home/faq", comp: <FaqPage /> },
  { path: "/home/products", comp: <ProductList /> },
  { path: "/home/product/:id", comp: <ProductDetails /> },
  { path: "/restricted", comp: <NotAllowed /> },
  { path: "*", comp: <NotFound /> }
];

const protectComp = [
  { path: "/home/my-account", comp: <Profile /> },
  { path: "/home/my-address", comp: <Addresses /> },
  { path: "/home/my-orders", comp: <AllOrders /> },
  { path: "/home/order", comp: <Order /> },
  { path: "/home/cart", comp: <Cart /> },
  { path: "/home/checkout-address", comp: <CheckoutAddr /> },
  { path: "/home/checkout", comp: <Checkout /> },
  // { path: "/home/my-coupons", comp: <MyCoupons /> },
  // { path: "/review/review-your-purchase/:id", comp: <AddReview /> }
];

function App() {
  const dispatch = useDispatch();
  const pageLocation = useLocation();
  // const cls = window.location.pathname === '/' ? "h-dark" : "h-light";
  // const cls = "h-light";
  const location = useGeoLocation();
  console.log({ location });
  // const { ageCheck } = useSelector((state) => state.ageCheck);
  // const { token } = useSelector((state) => state.auth);

  return (
    <>
      {/* {location.country !== "CA" ? (
        <NotAllowed />
      ) : ( */}

      <Header />
      {/* {(ageCheck || token) && <Header />} */}
      <AnimatePresence mode={"wait"}>
        <Routes location={pageLocation} key={pageLocation.pathname}>
          {comp.map(({ path, comp }) => (
            <Route
              key={path}
              path={path}
              element={comp}
            />
          ))}

          {protectComp.map(({ path, comp }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  {comp}
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
      </AnimatePresence>
      <Footer />
      {/* {(ageCheck || token) && <Footer />} */}
    </>
  );
}

export default App;

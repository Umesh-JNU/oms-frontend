import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";
import useGeoLocation from "react-ipgeolocation";

import ProtectedRoute from "./utils/ProtectedRoute";

import { Header, Footer, NotAllowed, NotFound, Home, SignIn, Profile, Addresses, FaqPage } from "./components";

// import ProductList from "./components/ProductList";
// import ProductDetails from "./components/ProductDetails";
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
  { path: "/home/faq", comp: <FaqPage /> },
  { path: "/restricted", comp: <NotAllowed /> },
  { path: "*", comp: <NotFound /> }
];

const protectComp = [
  { path: "/home/my-account", comp: <Profile /> },
  { path: "/home/my-address", comp: <Addresses /> },
  // { path: "", comp: },
  // { path: "", comp: },
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
          {/* <Route
              path="/shop/:id"
              element={
                <>
                  <ProductList />
                </>
              }
            /> */}

          {/* <Route
              path="/home/:id"
              element={
                <>
                  <ProductDetails />
                </>
              }
            />
            <Route
              path="/home/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/checkout-address"
              element={
                <ProtectedRoute>
                  <CheckoutAddr />
                </ProtectedRoute>
              }
            /> 
            <Route
              path="/home/my-account"
              element={
                
              }
            />
            <Route
              path="/home/my-address"
              element={
                <ProtectedRoute>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/my-coupons"
              element={
                <ProtectedRoute>
                  <MyCoupons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/order"
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/my-orders"
              element={
                <ProtectedRoute>
                  <AllOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review/review-your-purchase/:id"
              element={
                <ProtectedRoute>
                  <AddReview />
                </ProtectedRoute>
              }
            /> */}
        </Routes>
      </AnimatePresence>
      <Footer />
      {/* {(ageCheck || token) && <Footer />} */}
    </>
  );
}

export default App;

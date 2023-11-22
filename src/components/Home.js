import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactPlaceholder from "react-placeholder";
import { Col, Row, Card, Button, Alert } from "react-bootstrap";
import moment from "moment";
import { motion } from "framer-motion";

import ReactCard from "./card/Card";
import CustomCarousel from "./carousel/Carousel";


import axios from "../utils/axios";
import { useGetAllCategoriesQuery } from "../features/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { addCart, buyAgain, getCart } from "../features/apiCall";
import {
  promotionFailure,
  promotionStart,
  promotionSuccess,
} from "../features/promotionsSlice";
import {
  ordersFailure,
  ordersStart,
  ordersSuccess,
} from "../features/ordersSlice";
import ModalLayout from "./layout/ModalLayout";
import { ageCheckSuccess } from "../features/ageCheckSlice";
import AlertBox from "./layout/AlertBox";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const { data: categoryData, isLoading: categoryLoading } =
    useGetAllCategoriesQuery();
  // const { promotions, loadingPromotion, promotionsErr } = useSelector(
  //   (state) => state.promotions
  // );
  // console.log({promotions})
  const promotions = [
    { promo_image: "/images/carousel/carousel1.png" },
    { promo_image: "/images/carousel/carousel2.png" },
  ]
  const { orders, loadingOrders, ordersErr } = useSelector(
    (state) => state.orders
  );
  const { buyAgainLoading, buyAgainErr } = useSelector(
    (state) => state.buyAgain
  );
  const { ageCheck } = useSelector((state) => state.ageCheck);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (!token && !ageCheck) {
      setModal(true);
    }
  }, [token, ageCheck]);

  useEffect(() => {
    const getCartDetails = async () => {
      await getCart(dispatch);
    };

    if (token) {
      getCartDetails();
    }
  }, [dispatch, token, ageCheck]);

  const fetchOrders = async () => {
    dispatch(ordersStart());

    try {
      const { data } = await axios.get("/api/order/recent-order", {
        headers: { Authorization: `${token}` },
      });

      // setOrders(data?.orders);
      dispatch(ordersSuccess(data?.orders));
    } catch (error) {
      dispatch(ordersFailure(error?.response?.data?.error?.message));
    }
  };

  const carouselDetails = async () => {
    dispatch(promotionStart());

    try {
      const { data } = await axios.get("/api/promotion/all", {
        headers: { Authorization: `${token}` },
      });

      // console.log("carousel ", data);
      // setPromotions(data?.promotions);
      dispatch(promotionSuccess(data?.promotions));
    } catch (error) {
      dispatch(promotionFailure(error?.response?.data));
    }
  };

  const handleReOrder = async (orderId, product, quantity) => {
    await buyAgain(dispatch, { orderId });

    getCart(dispatch);

    navigate("/home/cart");
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // if (categoryData) {
    //   setCategories(categoryData?.categories);
    // }

    if (token) {
      fetchOrders();
    }

    carouselDetails();
    // }, [categoryData, token, ageCheck]);
  }, [token, ageCheck]);

  return (
    <>
      {/* {(ageCheck || token) && ( */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        {/* <ReactPlaceholder
          type="text"
          color="#F0F0F0"
          showLoadingAnimation
          rows={5}
          style={{ width: "60%", margin: "auto" }}
          ready={!loadingPromotion}
        > */}
        <CustomCarousel promotions={promotions} />
        {/* </ReactPlaceholder> */}
        <section className="sec-1">
          <div className="sec-1-heading">
            <h1 className="h-heading">Choose a Fortification</h1>
          </div>
          <div className="sec-1-body">
            <Row className="m-0 gap-2 justify-content-center align-items-center">
              <ReactPlaceholder
                type="text"
                color="#F0F0F0"
                showLoadingAnimation
                rows={5}
                ready={!categoryLoading}
              >
              {categoryData?.categories?.length <= 0 ? (
                <AlertBox
                  type={"danger"}
                  heading={"Something went wrong!"}
                  desc={"We are working on resolving the issue."}
                  onHome={true}
                />
              ) : (
                categoryData?.categories?.map((item) => (
                  <Col lg={2} md={4} key={item._id}>
                    <ReactCard item={item} />
                  </Col>
                ))
              )}
              </ReactPlaceholder>
            </Row>
          </div>
        </section>
      </motion.div>
      {/* )} */}

      {/* {modal && (
        <ModalLayout
          status={"ageCheck"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={() => {
            dispatch(ageCheckSuccess(false));
            navigate("/restricted");
          }}
          handleCloseAge={() => {
            dispatch(ageCheckSuccess(true));
            setModal(!modal);
          }}
        />
      )} */}
    </>
  );
};

export default Home;

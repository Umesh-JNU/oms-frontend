import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import ReactPlaceholder from "react-placeholder";

import ReactCard from "./card/Card";
import AlertBox from "./layout/AlertBox";
import ModalLayout from "./layout/ModalLayout";
import CustomCarousel from "./carousel/Carousel";
import { locationSuccess } from "../features/locationSlice";


import axios from "../utils/axios";
import { useGetAllCategoriesQuery } from "../features/productsApi";
import { getCart } from "../features/apiCall";
import {
  bannerFailure,
  bannerStart,
  bannerSuccess,
} from "../features/bannerSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { location } = useSelector((state) => state.location);

  const [modal, setModal] = useState(false);

  const { data: categoryData, isLoading: categoryLoading } = useGetAllCategoriesQuery(location);
  const { banners, loadingBanner, bannerErr } = useSelector((state) => {
    console.log(state);
    return state.banner
  });
  console.log({ banners })

  const carouselDetails = async () => {
    dispatch(bannerStart());

    try {
      const { data } = await axios.get("/api/banner/all", {
        headers: { Authorization: `${token}` },
      });

      console.log("carousel ", data);
      dispatch(bannerSuccess(data?.banners));
    } catch (error) {
      dispatch(bannerFailure(error?.response?.data));
    }
  };

  useEffect(() => {
    if (!location) {
      setModal(true);
    }
  }, [token, location]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const getCartDetails = async () => {
      await getCart(dispatch);
    };

    carouselDetails();

    if (token) {
      getCartDetails();
    }
  }, [dispatch, token, location]);

  return (
    <>
      {(location || token) && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <ReactPlaceholder
            type="text"
            color="#F0F0F0"
            showLoadingAnimation
            rows={5}
            style={{ width: "60%", margin: "auto" }}
            ready={!loadingBanner}
          >
            <CustomCarousel banners={banners} />
          </ReactPlaceholder>
          <section className="sec-1">
            <div className="sec-1-heading">
              <h1 className="h-heading">Choose Category</h1>
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
      )}

      {modal && !location && (
        <ModalLayout
          title={"Your Country"}
          status={"location"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={(loc) => {
            dispatch(locationSuccess(loc));
            setModal(!modal);
          }}
        />
      )}
    </>
  );
};

export default Home;

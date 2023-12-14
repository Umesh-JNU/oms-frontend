import axios from "../utils/axios";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import {
  Alert,
  Col,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";

import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import {
  ordersFailure,
  ordersStart,
  ordersSuccess,
} from "../features/ordersSlice";

const AllOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const { orders, loadingOrders, ordersErr } = useSelector((state) => state.orders);

  console.log("IN ALL ORDER", { orders })
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const fetchOrders = async () => {
    dispatch(ordersStart());

    try {
      const { data } = await axios.get(`/api/order/all`, {
        headers: { Authorization: `${token}` },
      });

      dispatch(ordersSuccess(data?.orders));
    } catch (error) {
      dispatch(ordersFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);

  return (
    <>
      <ReactBreadcrumb path={`Home / My-Account / My Orders`} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container>
          <div className="all-orders">
            <h1>Your Orders!</h1>
            <div
              style={{
                margin: "1rem",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <ReactPlaceholder
                type="text"
                color="#F0F0F0"
                showLoadingAnimation
                rows={5}
                style={{ width: "60%" }}
                ready={!loadingOrders}
              >
                {orders?.length !== 0 &&
                  orders?.map((order) => (
                    <>
                      <Col
                        key={order?._id}
                        md={8}
                        lg={6}
                        className="border-thin p-0 py-2 all-orders-col"
                      >
                        <div key={Math.random()}>
                          <div className="">
                            <div className="all-orders-at">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <p style={{ width: "7rem" }}>
                                  <i>
                                    Order placed{" "}
                                    {moment(order?.createdAt)
                                      .utc()
                                      .format("MMMM DD, YYYY")}
                                  </i>
                                </p>

                                <div style={{ width: "7rem", cursor: "pointer" }}                                >
                                  <div className="orders-ship-to">
                                    <OverlayTrigger
                                      delay={0}
                                      trigger="click"
                                      placement="bottom"
                                      overlay={
                                        <Popover id={`popover-positioned-bottom`}                                        >
                                          <Popover.Header as="h3">
                                            SHIP TO
                                          </Popover.Header>
                                          <Popover.Body>
                                            <div className="orders-address">
                                              <p>{order?.address?.street}</p>
                                              <p>{order?.address?.town}</p>
                                              <p>{order?.address?.province}</p>
                                              <p>{order?.address?.post_code}</p>
                                            </div>
                                          </Popover.Body>
                                        </Popover>
                                      }
                                    >
                                      <div className="ship-to"                                      >
                                        <>
                                          <i>Ship to</i>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="icon"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                            />
                                          </svg>
                                        </>
                                      </div>
                                    </OverlayTrigger>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Row>
                              <Col
                                style={{
                                  width: "50%",
                                  padding: "0 2rem",
                                }}
                              >
                                {order?.products?.map((product) => (
                                  <>
                                    <div
                                      style={{ display: "flex" }}
                                      key={product?._id}
                                    >
                                      <div className="recent-order-img">
                                        <img src={product?.parent_prod?.product_img} alt="" />
                                      </div>
                                      <div
                                        key={product?._id}
                                        className="all-orders-prod"
                                      >
                                        <p
                                          className="all-orders-prod-name"
                                          onClick={() => navigate(`/home/product/${product?.parent_prod?._id}?subId=${product?.product?._id}`)}
                                        >
                                          {product?.parent_prod?.name}, {product.variant}
                                        </p>
                                        <p>x{product?.quantity}</p>
                                      </div>
                                    </div>
                                    <p
                                      style={{
                                        width: "70%",
                                        fontSize: "0.7rem",
                                        opacity: "0.8",
                                      }}
                                      className="all-orders-prod-desc"
                                    >
                                      {product?.parent_prod?.description?.slice(
                                        0,
                                        80
                                      ) + "..."}
                                    </p>
                                    <p style={{ fontSize: "0.7rem", marginTop: "0.6rem", fontWeight: "500" }}>
                                      {product?.product?.qname}
                                    </p>
                                  </>
                                ))}
                              </Col>
                              <div className="order-id">
                                <p>Order Number: <span>{order?.orderId}</span></p>
                              </div>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </>
                  ))}
              </ReactPlaceholder>
            </div>
          </div>

          {orders?.length === 0 && (
            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={5}
              style={{ width: "60%" }}
              ready={!loadingOrders}
            >
              <div>
                <Alert
                  variant="dark"
                  style={{ margin: "auto", width: "50%" }}
                  className="no-prod-msg-box-alert"
                >
                  <Alert.Heading className="no-prod-msg-box">
                    <span>No orders!</span>
                  </Alert.Heading>

                  <hr />
                  <p className="mb-4 mt-3">
                    Your orders will appear here once you order.
                  </p>
                  <hr />
                  <Alert.Link
                    as="button"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                    }}
                    onClick={() => navigate("/")}
                    className="no-prod-link"
                  >
                    <p className="mt-4">Go to home</p>
                  </Alert.Link>
                </Alert>
              </div>
            </ReactPlaceholder>
          )}
        </Container>
      </motion.div >

      <ToastContainer />
    </>
  );
};

export default AllOrders;

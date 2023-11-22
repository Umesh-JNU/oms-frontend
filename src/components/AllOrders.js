import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { buyAgain, getCart } from "../features/apiCall";
import { useNavigate } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import {
  ordersFailure,
  ordersStart,
  ordersSuccess,
} from "../features/ordersSlice";
import {
  buyAgainFailure,
  buyAgainStart,
  buyAgainSuccess,
} from "../features/buyAgain";

const AllOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const { orders, loadingOrders, ordersErr } = useSelector(
    (state) => state.orders
  );
  const { buyAgainLoading, buyAgainErr } = useSelector(
    (state) => state.buyAgain
  );
  const [filterOrder, setFilterOrder] = useState("all");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleFilterChange = (e) => {
    setFilterOrder(e.target.value);
  };

  const fetchOrders = async () => {
    dispatch(ordersStart());

    try {
      const { data } = await axios.get(`/api/order/all?status=${filterOrder}`, {
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
  }, [filterOrder]);

  const handleReOrder = async (orderId) => {
    // await buyAgain(dispatch, { orderId });
    dispatch(buyAgainStart());

    try {
      const { data } = await axios.post(
        "/api/cart/recent-cart",
        {
          orderId,
        },
        {
          headers: { Authorization: `${token}` },
        }
      );

      getCart(dispatch);
      dispatch(buyAgainSuccess(data));

      navigate("/home/cart");
    } catch (error) {
      toast.error(error?.response?.data?.error?.message, toastOptions);
      dispatch(buyAgainFailure(error?.response?.data?.error?.message));
    }
  };

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
          <div className="filter-order">
            <p>Filter Order by </p>
            <Form.Select
              size="sm"
              onChange={handleFilterChange}
              className="form-select-filter"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="paid">Paid</option>
            </Form.Select>
          </div>
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

                                <div
                                  style={{ width: "7rem", cursor: "pointer" }}
                                >
                                  <div className="orders-ship-to">
                                    <OverlayTrigger
                                      // show={show}
                                      delay={0}
                                      trigger="click"
                                      // trigger={trigger}
                                      placement="bottom"
                                      overlay={
                                        <Popover
                                          id={`popover-positioned-bottom`}
                                        >
                                          <Popover.Header as="h3">
                                            SHIP TO
                                          </Popover.Header>
                                          <Popover.Body>
                                            <div className="orders-address">
                                              <p>{order?.address?.unit}</p>
                                              <p>{order?.address?.street}</p>
                                              <p>{order?.address?.town}</p>
                                              <p>{order?.address?.province}</p>
                                              <p>{order?.address?.post_code}</p>
                                            </div>
                                          </Popover.Body>
                                        </Popover>
                                      }
                                    >
                                      <div
                                        className="ship-to"
                                        // onClick={() => setShow(!show)}
                                      >
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
                              <div>
                                <p
                                  className={`${
                                    order?.status === "pending" &&
                                    "order-pending"
                                  } ${
                                    order?.status === "paid" && "order-paid"
                                  } ${
                                    order?.status === "delivered" &&
                                    "order-delivered"
                                  }`}
                                >
                                  {order?.status}
                                </p>
                              </div>
                            </div>
                            <Row>
                              <Col
                                style={{
                                  width: "50%",
                                  paddingLeft: "2rem",
                                }}
                              >
                                {order?.products?.map((product) => (
                                  <>
                                    <div
                                      style={{ display: "flex" }}
                                      key={product?._id}
                                    >
                                      <div className="recent-order-img">
                                        <img
                                          src={
                                            product?.parent_prod
                                              ?.product_img
                                              // ?.product_images[0]
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div
                                        key={product?._id}
                                        className="all-orders-prod"
                                      >
                                        <p
                                          className="all-orders-prod-name"
                                          onClick={() =>
                                            navigate(
                                              `/home/${product?.parent_prod?._id}?subId=${product?.product?._id}`
                                            )
                                          }
                                        >
                                          {product?.parent_prod?.name}
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
                                    <p
                                      style={{
                                        // width: "70%",
                                        fontSize: "0.7rem",
                                        // opacity: "0.8",
                                        marginTop: "0.6rem",
                                        fontWeight: "500",
                                      }}
                                      // className="all-orders-prod-desc"
                                    >
                                      {product?.product?.qname}
                                    </p>
                                    <div className="add-review">
                                      <Button
                                        variant="dark"
                                        onClick={() =>
                                          navigate(
                                            `/review/review-your-purchase/${product?.parent_prod?._id}`
                                          )
                                        }
                                      >
                                        Write a product review
                                      </Button>
                                    </div>
                                  </>
                                ))}
                              </Col>
                              <Col className="re-order-btn">
                                <div className="re-order-btn-all-order">
                                  <div>
                                    {buyAgainLoading ? (
                                      <Button variant="dark" disabled>
                                        <Spinner
                                          animation="border"
                                          variant="light"
                                        />
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="dark"
                                        style={{ marginRight: "2rem" }}
                                        onClick={() =>
                                          handleReOrder(order?._id)
                                        }
                                      >
                                        <p>Buy again</p>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          class="w-5 h-5"
                                        >
                                          <path
                                            fill-rule="evenodd"
                                            d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                                            clip-rule="evenodd"
                                          />
                                        </svg>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </Col>
                              <div className="order-id">
                                <p>
                                  Order Number: <span>{order?.orderId}</span>
                                </p>
                                {/* <p className="order-id-info">
                                  (Please use this order number for payment
                                  purpose!)
                                </p> */}
                              </div>
                            </Row>
                          </div>
                        </div>
                        <hr />
                        <div className="total-amount">
                          <p>Total</p>
                          <p>${order?.amount?.toFixed(2)}</p>
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
      </motion.div>

      <ToastContainer />
    </>
  );
};

export default AllOrders;

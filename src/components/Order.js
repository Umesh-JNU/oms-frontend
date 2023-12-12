import axios from "../utils/axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io";
import { Alert, Col, Container, Row } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";

import moment from "moment";
import { setCart } from "../features/cartSlice";
import { motion } from "framer-motion";
import { orderFailure, orderStart, orderSuccess } from "../features/orderSlice";
import { MdDownloadDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AlertBox from "./layout/AlertBox";

const Order = () => {
  const { orderDetails, loadingOrder, orderErr } = useSelector(
    (state) => state.order
  );
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [userValues, setUserValues] = useState({
    firstname: "",
    lastname: "",
    mobile_no: undefined,
  });
  const navigate = useNavigate();

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get("/api/user/user-profile", {
        headers: { Authorization: `${token}` },
      });

      setEmail(data?.user?.email);
      setUserValues({
        firstname: data?.user?.firstname,
        lastname: data?.user?.lastname,
        mobile_no: data?.user?.mobile_no,
      });
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchOrder = async () => {
    dispatch(orderStart());

    try {
      const { data } = await axios.get("/api/order/get-order", {
        headers: { Authorization: `${token}` },
      });

      await fetchDetails();
      dispatch(orderSuccess(data?.orders));
    } catch (error) {
      dispatch(orderFailure(error));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();

    dispatch(setCart());
  }, []);

  return (
    <>
      <ReactBreadcrumb path={`Home / Order`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ paddingTop: "5rem" }}>
          <Row className="order-conf">
            {!orderErr && (
              <>
                {/* <Col md={6}>
                  <div className="order-left-sec">
                    <div className="order-left-info">
                      <p>
                        Instructions to pay have been emailed to you (check your
                        INBOX or SPAM folder)
                      </p>
                      <br />
                      <p>
                        TO PAY by INTERAC NOW. please follow the instruction
                        below:
                      </p>
                      <br />
                      <p>
                        Sign in to your online banking on another browser tab or
                        window (keep this page open for reference). Send us an
                        Interac e-Transfer with the following details:
                      </p>
                      <br />
                      <p>RECIPIENT NAME: James C</p>
                      <br />
                      <p>RECIPIENT EMAIL: pay.invoice12@gmail.com</p>
                      <br />
                      <p>
                        MESSAGE SECTION OF E-TRANSFER: enter the ORDER number
                      </p>
                      <br />
                      <p>
                        SECURITY QUESTION: set the question to 'What is the
                        password?'
                      </p>
                      <br />
                      <p>
                        SECURITY ANSWER: set the security answer to 'express'
                      </p>
                      <br />
                    </div>

                    <div className="order-details">
                      <h2 style={{ fontWeight: "700" }}>
                        <>Order details</>
                      </h2>

                      <div className="order-details-heading">
                        <p style={{ fontWeight: "700" }}>PRODOUCT</p>
                        <p style={{ fontWeight: "700" }}>TOTAL</p>
                      </div>
                      <hr className="heading-hr" />

                      <div className="order-product-container">
                        <ReactPlaceholder
                          type="text"
                          color="#F0F0F0"
                          showLoadingAnimation
                          rows={10}
                          ready={!loadingOrder}
                        >
                          {orderDetails?.products?.map((product) => (
                            <div
                              style={{ width: "100%", marginBottom: "0.8rem" }}
                            >
                              <p className="order-div">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <span>
                                    {product?.parent_prod?.name} x{" "}
                                    {product?.quantity}
                                  </span>
                                  <span className="prod-qname">
                                    {product?.product?.qname}
                                  </span>
                                </div>
                                {product?.parent_prod?.sale > 0 ? (
                                  <div>
                                    <p className="order-old-price">
                                      $
                                      {(
                                        product?.product?.amount *
                                        product?.quantity
                                      )?.toFixed(2)}
                                    </p>
                                    <p className="order-updated-price">
                                      $
                                      {(
                                        product?.updatedAmount *
                                        product?.quantity
                                      )?.toFixed(2)}
                                    </p>
                                  </div>
                                ) : (
                                  <p style={{ fontWeight: "700" }}>
                                    $
                                    {product?.product?.amount *
                                      product?.quantity}
                                  </p>
                                )}
                              </p>

                              <hr className="order-hr" />
                            </div>
                          ))}
                        </ReactPlaceholder>

                        <div className="order-subtotal">
                          <p className="order-div">
                            <span style={{ fontWeight: "700" }}>Subtotal:</span>
                            <p style={{ fontWeight: "700" }}>
                              $
                              {(orderDetails?.free_ship
                                ? orderDetails?.amount
                                : orderDetails?.amount -
                                  orderDetails?.shipping_charge
                              ).toFixed(2)}
                            </p>
                          </p>
                        </div>
                        <hr className="order-hr" />

                        <div className="">
                          <p className="order-div">
                            {orderDetails?.free_ship ? (
                              <div
                                style={{ width: "100%" }}
                                className="d-flex flex-column"
                              >
                                <div className="d-flex justify-content-between">
                                  <span
                                    style={{
                                      fontWeight: 700,
                                      textDecoration:
                                        orderDetails?.free_ship &&
                                        "line-through",
                                    }}
                                  >
                                    Shipping:
                                  </span>
                                  <p
                                    style={{
                                      textDecoration:
                                        orderDetails?.free_ship &&
                                        "line-through",
                                    }}
                                  >
                                    $ {orderDetails?.shipping_charge}
                                  </p>
                                </div>

                                <div
                                  className="d-flex justify-content-between mt-2"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  <strong>Free Shipping Applied</strong>
                                  <strong>$ 0</strong>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span style={{ fontWeight: "700" }}>
                                  Shipping:
                                </span>
                                <p style={{ opacity: "0.7" }}>
                                  ${orderDetails?.shipping_charge?.toFixed(2)}
                                </p>
                              </>
                            )}
                          </p>
                        </div>
                        <hr className="order-hr" />

                        <div className="">
                          <p className="order-div">
                            <span style={{ fontWeight: "700" }}>
                              Payment method:
                            </span>
                            <p style={{ opacity: "0.7" }}>Interac e-Transfer</p>
                          </p>
                        </div>
                        <hr className="order-hr" />

                        <div className="">
                          <p className="order-div">
                            <span style={{ fontWeight: "700" }}>Total:</span>
                            <p style={{ fontWeight: "700" }}>
                              ${orderDetails?.amount?.toFixed(2)}
                            </p>
                          </p>
                        </div>
                        <hr className="order-hr" />

                        <div className="billing-addr">
                          <h2 style={{ marginTop: "2rem" }}>
                            <b>Billing address</b>
                          </h2>

                          <ReactPlaceholder
                            type="text"
                            color="#F0F0F0"
                            showLoadingAnimation
                            rows={7}
                            ready={!loadingOrder}
                          >
                            <div className="billing-address-container">
                              <p>
                                {userValues?.firstname} {userValues?.lastname}
                              </p>
                              <p>{orderDetails?.address?.street}</p>
                              <p>
                                <span>
                                  {orderDetails?.address?.unit}{" "}
                                  {orderDetails?.address?.town}{" "}
                                  {orderDetails?.address?.province}{" "}
                                  {orderDetails?.address?.post_code}
                                </span>
                              </p>
                              <p>{userValues?.mobile_no}</p>
                            </div>
                            <p style={{ fontSize: "1.1rem" }}>
                              <i>{email}</i>
                            </p>
                          </ReactPlaceholder>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col> */}
                {/* <Col md={6}> */}
                <Col>
                  <div className="order-confirmation-box">
                    <div className="order-right-sec">
                      <p style={{ color: "orange", fontWeight: "600" }}>
                        Thank you. Your order has been received.
                      </p>

                      <ReactPlaceholder
                        type="text"
                        color="#F0F0F0"
                        showLoadingAnimation
                        rows={7}
                        ready={!loadingOrder}
                      >
                        <div className="order-details">
                          <ul>
                            <li>
                              Order number: <b>{orderDetails?.orderId}</b>
                            </li>
                            <li>
                              Date:{" "}
                              <b>
                                {moment(orderDetails?.createdAt)
                                  .utc()
                                  .format("MMMM DD, YYYY")}
                              </b>
                            </li>
                            <li>
                              Email: <b>{email}</b>
                            </li>
                            {/* <li>
                              Total: <b>${orderDetails?.amount?.toFixed(2)}</b>
                            </li> */}
                            {/* <li>
                              Payment method: <b>Interac e-Transfer</b>
                            </li> */}
                          </ul>
                        </div>
                      </ReactPlaceholder>
                    </div>
                  </div>
                </Col>
                <Col>

                  <Alert variant="success">
                    <Alert.Heading as="h3">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <MdDownloadDone style={{ marginRight: "0.5rem" }} />
                        <p>Order Successfully Placed</p>
                      </div>
                    </Alert.Heading>

                    <hr />

                    <p className="mt-4 mb-4">
                      Thank you for ordering. We received your order and we will
                      begin processing it soon. Your order confirmation appears
                      above with details.
                    </p>

                    <p className="mb-3">Please follow above instructions.</p>

                    <hr />

                    <Alert.Link
                      as="button"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                      }}
                      onClick={() =>
                        navigate("/home/my-orders", { replace: true })
                      }
                      className="no-prod-link"
                    >
                      <span>View order</span>
                    </Alert.Link>
                  </Alert>
                </Col>
              </>
            )}

            {orderErr && (
              <AlertBox
                type={"danger"}
                heading={"Something went wrong!"}
                desc={"We are trying to resolve the issue!"}
                ordersLink={true}
                onHome={true}
              />
            )}
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default Order;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert, Form } from "react-bootstrap";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../features/apiCall";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "../utils/axios";
import {
  shippingDetailsFailure,
  shippingDetailsStart,
  shippingDetailsSuccess,
} from "../features/shippingDetailsSlice";
import AlertBox from "./layout/AlertBox";
import { FaHandPointRight } from "react-icons/fa";

const formatText = (text) => {
  // Format text starting with a dollar sign ($) as bold
  const formattedText = text.replace(/\$(\d+)/g, "<strong>$&</strong> ");
  // Format "Note:-" as bold
  const finalText = formattedText.replace(
    /Note:-/g,
    "<strong><br /><br />Note:-</strong>"
  );

  // console.log({ finalText });
  return finalText;
};

const Cart = () => {
  const { isFetching, cartItems, cartTotalAmount } = useSelector(
    (state) => state.cart
  );
  const { loading, shippingDetails, error } = useSelector(
    (state) => state.shippingDetails
  );

  const { token } = useSelector((state) => state.auth);
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchShippingDetails = async () => {
    dispatch(shippingDetailsStart());
    try {
      const { data } = await axios.get("/api/shipping/all", {
        headers: {
          Authorization: `${token}`,
        },
      });

      dispatch(shippingDetailsSuccess(data?.shippings));

      data?.shippings?.map((ship) => formatText(ship));
    } catch (error) {
      dispatch(shippingDetailsFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    getCart(dispatch);
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (cartItems) {
      setCart(cartItems);
    }

    fetchShippingDetails();
  }, [cartItems]);

  return (
    <>
      <ReactBreadcrumb path={`Home / Shopping Cart`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ paddingTop: "3rem" }}>
          <div className="cart-items-len">
            <h3>Shopping Cart</h3>

            <div className="cart-alert-box">
              <AlertBox
                type={"dark"}
                desc={
                  cartItems?.length === 1 ? (
                    <p>
                      <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                      You have <b>{cartItems?.length}</b> item in your cart
                    </p>
                  ) : (
                    <p>
                      <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                      You have <b>{cartItems?.length}</b> items in your cart
                    </p>
                  )
                }
                cart={true}
                onHome={true}
              />
              {/* <Alert variant="dark">
                {cartItems?.length === 1 ? (
                  <div className="alert-box-content">
                    <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                    <p>
                      You have <b>{cartItems?.length}</b> item in your cart
                    </p>
                  </div>
                ) : (
                  <div className="alert-box-content">
                    <AiOutlineInfoCircle style={{ marginRight: "0.5rem" }} />
                    <p>
                      You have <b>{cartItems?.length}</b> items in your cart
                    </p>
                  </div>
                )}
              </Alert> */}
            </div>

            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={5}
              ready={!loading && !isFetching}
            >
              <div className="shipping-details-cart-cont">
                <div className="shipping-details-cart-heading">
                  <AiOutlineInfoCircle
                    style={{
                      marginRight: "0.3rem",
                    }}
                  />
                  <p>Please note</p>
                </div>
                {shippingDetails?.map((shippingDetail) => (
                  <div
                    className="shipping-details-cart"
                    key={shippingDetail?._id}
                  >
                    <div>
                      <p>
                        <FaHandPointRight
                          style={{
                            marginRight: "1rem",
                          }}
                        />{" "}
                      </p>
                    </div>

                    <div>
                      <p className="shipping-details-label">
                        {shippingDetail?.label}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatText(shippingDetail?.description),
                        }}
                      ></div>
                    </div>
                    {/* <p>{shippingDetail?.description}</p> */}
                  </div>
                ))}
              </div>
            </ReactPlaceholder>

            {/* {cartTotalAmount < 60 && (
              <div className="cart-alert-box">
                <Alert variant="danger">
                  <div className="alert-box-content-cart-total">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <p>
                        <b>
                          A Minimum of $CAD60.00 is required before checking
                          out.
                        </b>
                      </p>
                    </div>
                    <p>
                      Current cart's total: $CAD
                      {cartTotalAmount?.toFixed(2)}
                    </p>
                  </div>
                </Alert>
              </div>
            )} */}
          </div>
          <Row className="product-content justify-content-center">
            <Col md={"auto"} lg={7} className="px-md-5">
              {/* <ReactPlaceholder
                type="text"
                color="#F0F0F0"
                showLoadingAnimation
                rows={7}
                ready={!isFetching}
              > */}
              {!isFetching && cart?.length === 0 ? (
                <div className="cart-alert-box">
                  <AlertBox
                    heading={"Your cart is currently empty!"}
                    type={"dark"}
                    desc={
                      <>
                        <hr />
                        <p className="mt-4 mb-4">
                          Before you proceed to checkout you must add some
                          products to your shopping cart.
                        </p>
                        <hr />
                      </>
                    }
                    cart={true}
                  />
                  {/* <Alert variant="dark">
                    <Alert.Heading>
                      <p>Your cart is currently empty!</p>
                    </Alert.Heading>
                    <hr />

                    <p className="mt-4 mb-4">
                      Before proceed to checkout you must add some products to
                      your shopping cart.
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
                      <span>Go to home</span>
                    </Alert.Link>
                  </Alert> */}
                </div>
              ) : (
                <Row className="m-0">
                  {cart?.map((i) => (
                    <CartItem key={Math.random()} cartItem={i} />
                  ))}
                </Row>
              )}
              {/* </ReactPlaceholder> */}
            </Col>
            <Col md={8} lg={5}>
              <h3 className="mb-3 mt-4">Cart Totals</h3>
              <div className="cart-detail-table">
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h6>SUBTOTAL</h6>
                    </div>
                    <div>
                      <ReactPlaceholder
                        type="text"
                        color="#F0F0F0"
                        showLoadingAnimation
                        rows={1}
                        ready={!isFetching}
                      >
                        <span>$ {cartTotalAmount?.toFixed(2)}</span>
                      </ReactPlaceholder>
                    </div>
                  </div>
                  {/* <tr>
                    <td>
                      <h6>SHIPPING</h6>
                    </td>
                    <td></td>
                    <td>
                      <span>
                        Shipping costs will be calculated once you have provided
                        address.
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <div className="shipping-detail">
                        <h6 className="mt-4">CALCULATE SHIPPING</h6>
                        <div>
                          <div className="cart-select-city">
                            

                            <div className="cart-addr-holder">
                              {addresses?.map((address) => (
                                <div
                                  key={address?._id}
                                  className="cart-addre-cont"
                                >
                                  <Form.Check
                                    type={"radio"}
                                    onChange={(e) =>
                                      setTownCity(e.target.value)
                                    }
                                    checked={townCity === address?.town}
                                    value={address?.town}
                                    label={
                                      <>
                                        <p>{address?.province}</p>
                                        <p>{address?.street}</p>
                                        <p>{address?.town}</p>
                                        <p>{address?.post_code}</p>
                                      </>
                                    }
                                  />
                                </div>
                              ))}
                            </div>

                            {townCity?.length > 0 && (
                              <p className="cart-selected-city">
                                Selected town/city: {townCity}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button className="update-btn" variant="dark">
                          UPDATE TOTAL
                        </Button>
                      </div>
                    </td>
                  </tr> */}
                </>
              </div>
              <h5
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 0",
                  marginTop: "2rem",
                }}
              >
                <span>Total</span>
                <ReactPlaceholder
                  type="text"
                  color="#F0F0F0"
                  showLoadingAnimation
                  rows={1}
                  ready={!isFetching}
                >
                  <span>$ {cartTotalAmount?.toFixed(2)}</span>
                </ReactPlaceholder>
              </h5>
              {cartItems.length > 0 ? (
                // &&
                // townCity?.length > 0
                <Button
                  className="proceed-btn btn-dark"
                  onClick={() => navigate("/home/checkout-address")}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="proceed-btn diasbled-proceed btn-dark"
                  disabled
                >
                  Proceed to Checkout
                </Button>
              )}
            </Col>
          </Row>

          {/* <div className="coupon-sec">
            <div className="coupon-code-box">
              <p className="pt-3 pb-2">Coupon Code</p>
              <div className="p-divider"></div>
            </div>
            <Button className="btn-dark">Apply Coupon</Button>
          </div> */}
        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default Cart;

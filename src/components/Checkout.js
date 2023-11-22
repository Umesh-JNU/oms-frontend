import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import axios from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { useNavigate } from "react-router-dom";
import { getCart } from "../features/apiCall";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import { TbRosetteNumber2 } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setaddress } from "../features/setChecAddr";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [coupon_code, setCoupon_code] = useState("");
  const [addCoupon, setAddCoupon] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const { cartItems, cartTotalAmount, isFetching, inSalePrice } = useSelector(
    (state) => state.cart
  );
  const { addressCheck, charges, total, message, free_ship } = useSelector(
    (state) => state.address
  );
  console.log({ addressCheck, total })
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [values, setValues] = useState({
    province: "",
    street: "",
    post_code: "",
    town: "",
    defaultAddressId: "",
    unit: "",
  });
  const [userValues, setUserValues] = useState({
    firstname: "",
    lastname: "",
    mobile_no: undefined,
    email: "",
  });
  // const [createAccCheck, setCreateAccCheck] = useState(false);
  const [ageCheck, setAgeCheck] = useState(false);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    getCart(dispatch);
  }, []);

  // const createAccCheckChange = (e) => {
  //   setCreateAccCheck(e.target.checked);
  // };

  const ageCheckChange = (e) => {
    setAgeCheck(e.target.checked);
  };

  // const handleValuesChange = (e) => {
  //   setValues({ ...values, [e.target.name]: e.target.value });
  // };

  const handleUserValuesChange = (e) => {
    setUserValues({ ...userValues, [e.target.name]: e.target.value });
  };

  const fetchDetails = async () => {
    const { data } = await axios.get("/api/user/user-profile", {
      headers: { Authorization: token },
    });

    setUserValues({
      firstname: data?.user?.firstname,
      lastname: data?.user?.lastname,
      email: data?.user?.email,
      mobile_no: data?.user?.mobile_no,
    });
  };

  const fetchAddress = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`/api/user/address/${addressCheck}`, {
        headers: {
          Authorization: token,
        },
      });

      setValues({
        province: data?.address?.province,
        town: data?.address?.town,
        street: data?.address?.street,
        post_code: data?.address?.post_code,
        // unit: data?.address?.unit,
      });
      await fetchDetails();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log(error?.response?.data?.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAddress();

    if (!isFetching) {
      setProducts(cartItems);
    }
  }, [isFetching]);

  const handleOrder = async () => {
    setLoading(true);
    // const { province, post_code, town, street } = values;
    const { mobile_no } = userValues;

    const addr_id = addressCheck;

    try {
      const { data } = await axios.post(
        "/api/order/add",
        {
          addr_id,
          // province,
          // post_code,
          // town,
          // street,
          mobile_no,
          coupon_code,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      await dispatch(setaddress());
      navigate("/home/order", { replace: true });
      getCart(dispatch);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error?.message, toastOptions);
      setLoading(false);
    }
  };

  return (
    <>
      <ReactBreadcrumb path={`Home / Checkout`} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ paddingTop: "5rem" }}>
          <div className="checkout-addr-title-cont checkout-step">
            <TbRosetteNumber2 className="checkout-steps" />
            <div>
              <p className="checkout-addr-title">Place your order</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate("/home/checkout-address");
            }}
            className="checkout-choose-addr"
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              opacity: "0.8",
              marginBottom: "1rem",
            }}
          >
            <p>Choose different address</p>
          </div>
          {console.log({ userValues })}
          <Row>
            <Col xs={"auto"} sm={4} md={6} lg={5}>
              <div className="checkout-sec-2">
                <h3 className="mb-3">Billing Details</h3>
                <ReactPlaceholder
                  type="text"
                  color="#F0F0F0"
                  showLoadingAnimation
                  rows={8}
                  ready={!loading}
                >
                  <Form className="billing-form">
                    <Form.Group>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Control
                            disabled
                            type="text"
                            placeholder="First Name *"
                            required
                            name="firstname"
                            onChange={handleUserValuesChange}
                            value={userValues?.firstname}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Control
                            disabled
                            type="text"
                            placeholder="Last Name *"
                            required
                            name="lastname"
                            onChange={handleUserValuesChange}
                            value={userValues?.lastname}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Street Address *"
                        required
                        name="street"
                        disabled
                        value={values?.street}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Town / City *"
                        required
                        name="town"
                        disabled
                        value={values?.town}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Province *"
                        required
                        name="province"
                        disabled
                        value={values?.province}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Postcode / ZIP *"
                        required
                        name="post_code"
                        disabled
                        value={values?.post_code}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="Phone *"
                        required
                        name="mobile_no"
                        onChange={handleUserValuesChange}
                        value={userValues?.mobile_no}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        disabled
                        type="email"
                        placeholder="Email *"
                        required
                        name="email"
                        onChange={handleUserValuesChange}
                        value={userValues?.email}
                      />
                    </Form.Group>

                  </Form>
                </ReactPlaceholder>
              </div>
            </Col>
            <Col>
              <div className="order-sec" style={{ marginTop: "2rem" }}>
                <div style={{ width: "100%" }}>
                  <h5>Your Order</h5>

                  {/* output the cart details here */}
                  <div className="order-heading">
                    <div>PRODUCT</div>
                    <div>SUBTOTAL</div>
                  </div>
                  <hr className="heading-hr" />
                  <div className="order-product-container">
                    <ReactPlaceholder
                      type="text"
                      color="#F0F0F0"
                      showLoadingAnimation
                      rows={10}
                      ready={!isFetching}
                    >
                      {products?.map((product) => (
                        <>
                          <div
                            key={product?.product?._id}
                            style={{ width: "100%" }}
                          >
                            <p
                              className="order-div"
                              key={product?.product?._id}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span className="order-product-name">
                                  {product?.product?.pid?.name} x{" "}
                                  {product?.quantity}
                                </span>
                                <span className="prod-qname">
                                  {product?.product?.qname}
                                </span>
                              </div>
                              <div>
                                {inSalePrice?.filter(
                                  (inSale) =>
                                    inSale?.id === product?.product?._id
                                )?.length > 0 ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-end",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <p className="checkout-prod-price-old">
                                      ${" "}
                                      {(
                                        product?.product?.amount *
                                        product?.quantity
                                      )?.toFixed(2)}
                                    </p>

                                    {inSalePrice
                                      ?.filter(
                                        (inSale) =>
                                          inSale?.id === product?.product?._id
                                      )
                                      ?.map((sale) => (
                                        <p className="checkout-prod-updated-price">
                                          ${" "}
                                          {(
                                            sale?.updatedAmount *
                                            product?.quantity
                                          )?.toFixed(2)}
                                        </p>
                                      ))}
                                  </div>
                                ) : (
                                  <div>
                                    <p>
                                      ${" "}
                                      {(
                                        product?.product?.amount *
                                        product?.quantity
                                      )?.toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </p>
                          </div>
                          <hr className="order-hr" />
                        </>
                      ))}
                      {/* <hr className="order-hr" /> */}
                      <div className="order-subtotal">
                        <p className="order-div">
                          Subtotal
                          <p>$ {cartTotalAmount?.toFixed(2)}</p>
                        </p>
                      </div>
                      <hr className="order-hr" />

                      <div>
                        <p className="order-div">
                          Total <p>$ {total?.toFixed(2)}</p>
                        </p>
                      </div>

                      <hr className="heading-hr" />
                    </ReactPlaceholder>
                  </div>
                </div>
                <div className="order-btn">
                  {/* {ageCheck && */}
                  { values?.province !== "" &&
                    values?.post_code !== "" &&
                    values?.street !== "" &&
                    values?.town !== "" &&
                    userValues?.mobile_no !== "" &&
                    userValues?.mobile_no !== undefined ? (
                    loading ? (
                      <Button variant="dark" size="lg" disabled>
                        <Spinner animation="border" variant="light" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="btn-dark"
                        variant="dark"
                        onClick={() => handleOrder()}
                      >
                        Place Order
                      </Button>
                    )
                  ) : (
                    <Button className="btn-dark" disabled>
                      Place Order
                    </Button>
                  )}
                </div>
                {/* <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "0.5rem",
                    }}
                  >
                    <AiOutlineInfoCircle
                      style={{
                        marginRight: "0.3rem",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      Note:
                    </p>
                  </div>
                  <p
                    style={{
                      marginTop: "0.4rem",
                      textAlign: "left",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                    }}
                  >
                    {message}
                  </p>
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>

      <ToastContainer />
    </>
  );
};

export default Checkout;

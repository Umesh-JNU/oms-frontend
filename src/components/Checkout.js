import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import axios from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";

import { useNavigate } from "react-router-dom";
import { getCart } from "../features/apiCall";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import { TbRosetteNumber2 } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";

import { setaddress } from "../features/setChecAddr";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useGetCategoryQuery } from "../features/productsApi";

const OrderProdItem = ({ item }) => {
  const [category, setCategory] = useState();

  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery(item?.product?.pid?.category);

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData?.category);
    }
  }, [categoryData]);

  console.log({ item });
  return (
    <div style={{ width: "100%" }}>
      <p className="order-div">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="order-product-name">
            {item?.product?.pid?.name} x{" "}
            {item?.quantity}
          </span>
          <span className="prod-qname">
            {item?.product?.quantity} {category?.location === 'CA' ? 'ml' : 'fl. Oz.'}
          </span>
        </div>
      </p>
    </div>
  )
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { cartItems, isFetching } = useSelector((state) => state.cart);
  const { addressCheck } = useSelector((state) => state.address);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [values, setValues] = useState({
    province: "",
    street: "",
    post_code: "",
    town: "",
    defaultAddressId: "",
  });
  const [userValues, setUserValues] = useState({
    firstname: "",
    lastname: "",
    mobile_no: undefined,
    email: "",
  });

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
    try {
      setLoading(true);
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
      });
      await fetchDetails();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.error.message, toastOptions);
    }
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
    const { mobile_no } = userValues;
    const addr_id = addressCheck;

    try {
      const { data } = await axios.post(
        "/api/order/add",
        { addr_id, mobile_no },
        { headers: { Authorization: token } }
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

                  <div className="order-heading">
                    <div>PRODUCT</div>
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
                      {products?.map((product) => <OrderProdItem item={product} key={product?.product?._id} />)}
                    </ReactPlaceholder>
                  </div>
                </div>
                <div className="order-btn">
                  {values?.province !== "" &&
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

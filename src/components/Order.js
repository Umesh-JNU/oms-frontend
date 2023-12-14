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

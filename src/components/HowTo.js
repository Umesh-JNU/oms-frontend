import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";

const HowTo = () => {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <>
      <ReactBreadcrumb path={`Home / how-to`} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container className="pt-5 px-3 px-md-0">
          <Row>
            <div
              style={{
                borderBottom: "1px solid rgba(0,0,0,0.2)",
                padding: "2rem 0",
              }}
            >
              <h3 className="text-center">
                BECOME A CUSTOMER AFTER YOUR 1ST PURCHASE.
              </h3>
              <p className="text-center mt-2">
                AUTOMATICALLY REGISTERED AT CHECKOUT.
              </p>
            </div>
          </Row>
          <h3 className="text-center my-3 py-3">How to Buy Weed Online</h3>
          <Row className="gap-3 justify-content-center">
            <Col md={3}>
              <div className="profile">
                <div className="number-box">
                  <img src="/images/howto/1.png" className="img-fluid" alt="" />
                </div>
                <h6 className="my-3 text-center">SHOP</h6>
                <p className="text-center p-bold">
                  Buy weed online, it's never been easier to order Mail Order
                  Marijuana online! Browse our extensive product line of
                  cannabis strains, concentrates, edibles, vapes, and more! Once
                  finished, add products to your SHOPPING CART. We offer Free
                  Shipping on orders $199+
                </p>
              </div>
            </Col>
            <Col md={3}>
              <div className="profile">
                <div className="number-box">
                  <img src="/images/howto/2.png" className="img-fluid" alt="" />
                </div>
                <h6 className="my-3 text-center">CHECKOUT & CREATE ACCOUNT</h6>
                <p className="text-center p-bold">
                  Once your cart is full, head to CHECKOUT to order online
                  medical marijuana, or whichever products you decided to
                  purchase. Enter your name, email, address, password & complete
                  the order. We will automatically create an account for you!
                </p>
              </div>
            </Col>
            <Col md={3}>
              <div className="profile">
                <div className="number-box">
                  <img src="/images/howto/3.png" className="img-fluid" alt="" />
                </div>
                <h6 className="my-3 text-center">PAYMENT & DELIVERY</h6>
                <p className="text-center p-bold">
                  To pay for your order, you must use Interac e-transfer. The
                  details will be in the receipt email, once we process your
                  payment, we will ship your order. Online dispensary shipping,
                  is secure, discrete, and best of all it only takes 2-3 days!
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.div>
    </>
  );
};

export default HowTo;

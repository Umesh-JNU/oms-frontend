import React from "react";
import { motion } from "framer-motion";
import ReactBreadcrumb from "./layout/BreadCrumb";
import CouponCard from "./layout/CouponCard";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

const MyCoupons = () => {
  return (
    <>
      <ReactBreadcrumb path={`Home / My-Account / My-Coupons`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container className="pt-5 px-3 px-md-0">
          <div>
            <h2>My coupons</h2>

            <div>
              <CouponCard />
            </div>
          </div>
        </Container>
      </motion.div>

      <ToastContainer />
    </>
  );
};

export default MyCoupons;

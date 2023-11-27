import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import ReactPlaceholder from "react-placeholder";
import { ToastContainer, toast } from "react-toastify";


import { Button, Col, Row, Spinner } from "react-bootstrap";
import app_logo_black from "./app_logo_black.png";
import { AiOutlineInfoCircle, AiOutlineTags } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  couponsFailure,
  couponsStart,
  couponsSuccess,
} from "../../features/couponCodeSlice";

const CouponCard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { coupons, loadingCoupons, couponsErr } = useSelector(
    (state) => state.coupons
  );
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = async (couponCode) => {
    try {
      await copyTextToClipboard(`${couponCode}`);

      toast.success("Copied to clipboard", toastOptions);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      toast.error("Please try again!", toastOptions);
      //   console.log(error);
    }
  };

  const fetchCoupons = async () => {
    dispatch(couponsStart());

    try {
      const { data } = await axios.get("/api/user/coupons", {
        headers: { Authorization: token },
      });

      //   console.log("coupons ", data);

      dispatch(couponsSuccess(data));
    } catch (error) {
      dispatch(couponsFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <>
      <Row
        className={`${
          coupons?.length === 0
            ? "align-items-center mt-4 justify-content-center"
            : "align-items-center mt-4"
        }`}
      >
        <ReactPlaceholder
          type="text"
          color="#F0F0F0"
          showLoadingAnimation
          rows={6}
          ready={!loadingCoupons}
        >
          {coupons?.map((coupon) => (
            <Col key={coupon?._id} md={6} lg={4}>
              <div className="coupon-card-cont">
                <div className="coupon-card-upper">
                  <img src={app_logo_black} alt="" />
                  <div className="coupon-card-discount">
                    <p>${coupon?.amount} off</p>
                    <span>OMS</span>
                  </div>
                </div>

                <div className="coupon-card-lower">
                  <p>
                    <AiOutlineTags
                      style={{ marginRight: "0.5rem" }}
                      color="#8B8B8B"
                    />{" "}
                    On any purchase
                  </p>

                  <p>
                    <AiOutlineInfoCircle
                      style={{ marginRight: "0.5rem" }}
                      color="#8B8B8B"
                    />{" "}
                    Paste the code when placing your order.
                  </p>

                  {isCopied ? (
                    <Button variant="dark" key={coupon?._id}>
                      <Spinner variant="light" />
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      onClick={() => handleCopyClick(coupon?._id)}
                    >
                      Copy code!
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          ))}

          {coupons?.length === 0 && (
            <Col md={6} lg={"4"}>
              <div className="coupon-card-cont">
                <div className="coupon-card-upper">
                  <img src={app_logo_black} alt="" />
                  <div className="coupon-card-discount">
                    <span>OMS</span>
                  </div>
                </div>

                <div className="coupon-card-lower">
                  <p>You don't have any coupons.</p>
                </div>
              </div>
            </Col>
          )}
        </ReactPlaceholder>
      </Row>
    </>
  );
};

export default CouponCard;

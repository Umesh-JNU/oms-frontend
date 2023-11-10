import React from "react";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AlertBox = ({
  heading,
  desc,
  onHome,
  type,
  cart,
  fullWidth,
  ordersLink,
}) => {
  const navigate = useNavigate();
  return (
    <Alert
      variant={type}
      // variant="danger"
      style={{ width: !cart && !fullWidth && "50%", margin: !cart && "auto" }}
      className={!cart && "no-prod-msg-box-alert"}
    >
      {heading && (
        <Alert.Heading className="no-prod-msg-box">
          <span>{heading}</span>
        </Alert.Heading>
      )}

      {cart ? (
        <div className="alert-box-content">
          <p className="">{desc}</p>
        </div>
      ) : (
        <>
          <hr />
          <p className="mb-5">{desc}</p>
          <hr />
        </>
      )}

      {!onHome && (
        <Alert.Link
          as="button"
          style={{
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
          }}
          onClick={() => navigate("/", { replace: true })}
          className="no-prod-link"
        >
          <span>Go to home</span>
        </Alert.Link>
      )}

      {ordersLink && (
        <Alert.Link
          as="button"
          style={{
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
          }}
          onClick={() => navigate("/home/my-orders", { replace: true })}
          className="no-prod-link"
        >
          <span>You can view your order here!</span>
        </Alert.Link>
      )}
    </Alert>
  );
};

export default AlertBox;

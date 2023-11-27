import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { resetPassword } from "../features/apiCall";
import { motion } from "framer-motion";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetToken } = useParams();

  const { isFetching, error, errMsg, message } = useSelector(
    (state) => state.auth
  );
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    if (error && !isFetching) {
      toast.error(errMsg.message, toastOptions);
    }
    if (message) {
      toast.success(message, toastOptions);
      setTimeout(() => {
        navigate("/home/sign-in");
      }, 1500);
    }
  }, [error, message]);

  const handlePwdChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword } = values;

    if (password.length < 8) {
      toast.error("Password must contain 8 characters.", toastOptions);
      return false;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return false;
    }

    return true;
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      await resetPassword(dispatch, resetToken, values);
    }
  };

  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container className="pt-5 px-3 px-md-0 f-center flex-column">
          <div className="f-center mb-4">
            <p className="toggle-link-item active-link">Reset Password</p>
          </div>

          <div className="form-box">
            <Form onSubmit={handlePwdSubmit}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter New Password"
                  onChange={handlePwdChange}
                  name="password"
                  required
                  value={values?.password}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
                  onChange={handlePwdChange}
                  name="confirmPassword"
                  required
                  value={values?.confirmPassword}
                />
              </Form.Group>

              <Button type="submit" variant="dark" disabled={isFetching}>
                {isFetching ? <Spinner animation="border" size="sm" variant="light" /> : "Submit"}
              </Button>
            </Form>
          </div>

        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

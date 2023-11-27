import React, { useEffect, useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { forgotPassword } from "../features/apiCall";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const { isFetching, error, errMsg, message } = useSelector(
    (state) => state.auth
  );
  const [email, setEmail] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    await forgotPassword(dispatch, email);
  };

  useEffect(() => {
    if (error && !isFetching) {
      toast.error(errMsg.message, toastOptions);
    }

    if (message) {
      toast.success(message, toastOptions);
    }
  }, [error, message]);

  // const path = window.location.pathname;
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
            <p className="toggle-link-item active-link">Forgot Password</p>
          </div>
          <div className="form-box">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Button type="submit" variant="dark" disabled={isFetching}>
                  {isFetching ? <Spinner animation="border" size="sm" variant="light" /> : "Submit"}
                </Button>
                <Link to="/home/sign-in" className="fs-sm text-primary">Login</Link>
              </div>
            </Form>
          </div>

        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

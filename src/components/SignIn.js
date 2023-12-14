import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button, Spinner } from "react-bootstrap";

import ModalLayout from "./layout/ModalLayout";
import { login } from "../features/apiCall";
import { locationSuccess } from "../features/locationSlice";

const SignIn = () => {
  const { isFetching, error, errMsg, token } = useSelector(
    (state) => state.auth
  );
  const { location } = useSelector((state) => state.location);
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [isLoogedIn, setIsLoogedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!token && !location) {
      setModal(true);
    }
  }, [token, location]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (localStorage.getItem("userToken")) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = values;
    await login(dispatch, { email, password });

    setIsLoogedIn(true);
  };

  if (error && !isFetching && isLoogedIn) {
    toast.error(errMsg.message, toastOptions);

    setIsLoogedIn(false);
  }

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
            <Link to="/home/sign-in" className="toggle-link-item active-link">
              Login
            </Link>
          </div>
          <div className="form-box">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <Button type="submit" variant="dark" disabled={isFetching}>
                  {isFetching ? <Spinner animation="border" size="sm" variant="light" /> : "Submit"}
                </Button>
                <Link to="/forgot-password" className="fs-sm text-primary">Forgot Password</Link>
              </div>
            </Form>
          </div>
        </Container>
      </motion.div>

      {modal && !location && (
        <ModalLayout
          title={"Your Country"}
          status={"location"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={(loc) => {
            dispatch(locationSuccess(loc));
            setModal(!modal);
          }}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default SignIn;

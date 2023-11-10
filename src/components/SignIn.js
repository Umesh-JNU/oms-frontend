import React, { useEffect, useState } from "react";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { Container, Row, Form, Col, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { login } from "../features/apiCall";
import { motion } from "framer-motion";
// import { ageCheckSuccess } from "../../features/ageCheckSlice";
// import ModalLayout from "../layout/ModalLayout";

const SignIn = () => {
  const { isFetching, error, errMsg, token } = useSelector(
    (state) => state.auth
  );
  const { ageCheck } = useSelector((state) => state.ageCheck);
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
    if (!token && !ageCheck) {
      setModal(true);
    }
  }, [token, ageCheck]);

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

  // const path = window.location.pathname;
  return (
    <>
      {/* {(ageCheck || token) && ( */}
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
              {/* <Link to="/home/sign-up" className="toggle-link-item">
                Register
              </Link> */}
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
                <Form.Group className="mb-3"></Form.Group>
                {isFetching ? (
                  <Button variant="dark" size="lg" disabled>
                    <Spinner animation="border" variant="light" />
                  </Button>
                ) : (
                  <Button type="submit" variant="dark">
                    Submit
                  </Button>
                )}
              </Form>
            </div>
          </Container>
        </motion.div>
      {/* )} */}

      {/* {modal && (
        <ModalLayout
          status={"ageCheck"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={() => {
            dispatch(ageCheckSuccess(false));
            navigate("/restricted");
          }}
          handleCloseAge={() => {
            dispatch(ageCheckSuccess(true));
            setModal(!modal);
          }}
        />
      )} */}
      <ToastContainer />
    </>
  );
};

export default SignIn;

import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import ReactBreadcrumb from "./layout/BreadCrumb";
import axios from "../utils/axios";
import ReactPlaceholder from "react-placeholder";

import { ToastContainer, toast } from "react-toastify";

import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { motion } from "framer-motion";
import { BiCopy } from "react-icons/bi";

const ContentContainer = ({ no, item }) => {
  return (
    <div className="content-box">
      <div className="content-header">
        <h5>
          <span>{no}.</span>
          {item.name}
        </h5>
      </div>
      <div className="content-body">
        <div className="content-body-top">
          <h6>{item.det1}</h6>
          {item.det2 && <p>{item.det2}</p>}
        </div>
        <div className="content-body-bottom">{item.content}</div>
      </div>
    </div>
  );
};

const AccountForm = () => {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_no: undefined,
    fax: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

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

  const fetchDetails = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/user/user-profile", {
      headers: { Authorization: `${token}` },
    });

    setValues({
      firstname: data?.user.firstname,
      lastname: data?.user.lastname,
      email: data?.user.email,
      mobile_no: data?.user.mobile_no,
      fax: data?.user.fax,
    });

    setLoading(false);
  };

  const updateProfile = async () => {
    const { firstname, lastname, email, fax, mobile_no } = values;
    setLoading(true);
    await axios.put(
      "/api/user/update-profile",
      { firstname, lastname, email, mobile_no, fax },
      { headers: { Authorization: `${token}` } }
    );

    setLoading(false);

    toast.success("Details updated!", toastOptions);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateProfile();

    fetchDetails();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <ReactPlaceholder
          type="text"
          color="#F0F0F0"
          showLoadingAnimation
          rows={5}
          style={{ width: "80%" }}
          ready={!loading}
        >
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3" controlId="firstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={values?.firstname}
                  name="firstname"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastname">
                <Form.Label>Last Name</Form.Label>

                <Form.Control
                  type="text"
                  required
                  value={values?.lastname}
                  name="lastname"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Mobile No.</Form.Label>
                <Form.Control
                  type="text"
                  maxLength={10}
                  pattern="[0-9]{10}"
                  required
                  name="mobile_no"
                  value={values?.mobile_no}
                  onChange={(e) => {
                    setValues({ ...values, mobile_no: e.target.value.replace(/\D/g, '') })
                  }}
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group controlId="fax">
                <Form.Label>Fax</Form.Label>
                <Form.Control
                  type="text"
                  name="fax"
                  onChange={handleChange}
                  value={values?.fax}
                />
              </Form.Group>
            </Col> */}
          </Row>
          <div className="form-sub-sec">
            <Button type="submit" className="btn-dark">
              Update
            </Button>
          </div>
        </ReactPlaceholder>
      </Form>
    </>
  );
};

const PasswordForm = () => {
  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

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

    const { password, confirmPassword } = values;
    setLoading(true);

    try {
      if (handleValidation()) {
        const { data } = await axios.put(
          "/api/user/update-password",
          { password, confirmPassword },
          { headers: { Authorization: `${token}` } }
        );

        toast.success(data?.message, toastOptions);

        setValues({
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.error.message, toastOptions);

      // toast.error("There was an error. Please again later!", toastOptions);
    }

    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={handlePwdSubmit}>
        <ReactPlaceholder
          type="text"
          color="#F0F0F0"
          showLoadingAnimation
          rows={5}
          style={{ width: "80%" }}
          ready={!loading}
        >
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
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
              onChange={handlePwdChange}
              name="confirmPassword"
              required
              value={values?.confirmPassword}
            />
          </Form.Group>
          <div className="form-sub-sec">
            <Button type="submit" className="btn-dark">
              Update
            </Button>
          </div>
        </ReactPlaceholder>
      </Form>
    </>
  );
};

const AddressBook = () => {
  const [showAdd, setShowAdd] = useState(false);

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [address, setAddress] = useState([]);
  const [values, setValues] = useState({
    province: "",
    town: "",
    street: "",
    post_code: "",
    unit: "",
  });

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [defaultAddress, setDefaultAddress] = useState(true);
  const navigate = useNavigate();

  const handleAddModalClose = () => setShowAdd(false);
  const handleAddModalShow = () => setShowAdd(true);

  const handleAddressAddChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value.toLowerCase() });
  };

  const handleCheckChange = (e) => {
    setDefaultAddress(e.target.checked);
  };

  const fetchAddress = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get("/api/user/address/all", {
        headers: {
          Authorization: `${token}`,
        },
      });

      setAddress(data);
    } catch (error) {
      console.log(error?.response?.data?.error);
    }

    setLoading(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const { province, post_code, street, town, unit } = values;
    setLoading(true);

    try {
      await axios.post(
        "/api/user/address/new",
        { province, post_code, town, street, defaultAddress, unit },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      toast.success("Address added!", toastOptions);
    } catch (error) {
      toast.error(error?.response?.data?.error, toastOptions);
    }

    setShowAdd(false);

    fetchAddress();

    setLoading(false);
  };

  useEffect(() => {
    // window.scrollTo(0, 0);

    fetchAddress();
  }, []);

  return (
    <>
      <Row className="m-0">
        <ReactPlaceholder
          type="text"
          color="#F0F0F0"
          showLoadingAnimation
          rows={4}
          style={{ width: "70%" }}
          ready={!loading}
        >
          {address?.address_book?.length !== 0 ? (
            <>
              <Col md={6} className="f-center border-thin p-0 py-2">
                {address?.address_book?.filter(
                  (add) => add?.defaultAddress === true
                ).length !== 0 ? (
                  address?.address_book
                    ?.filter((add) => add?.defaultAddress === true)
                    .map((add) => (
                      <>
                        <p key={add?._id} className="">
                          <b
                            style={{
                              borderBottom: "0.5px solid #bbbbbb",
                            }}
                          >
                            Default address
                          </b>
                          <br />
                          <p
                            style={{
                              marginTop: "0.5rem",
                            }}
                          >
                            {add?.street} {add?.unit} {add?.town}
                            <br />
                            {add?.province}
                            <br />
                            {add?.post_code}
                          </p>
                        </p>
                      </>
                    ))
                ) : (
                  <p
                    style={{
                      padding: "0rem 0.5rem",
                    }}
                  >
                    No default address. Please go to manage address to choose
                    one.
                  </p>
                )}
              </Col>
              <Col md={6} className="f-center border-thin p-0 py-2 gap-1">
                <div className="manage-addre">
                  {loading ? (
                    <Button variant="primary" size="lg" disabled>
                      <Spinner animation="border" variant="dark" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate("/home/my-address")}
                      variant="dark"
                    >
                      Manage addresses
                    </Button>
                  )}
                </div>
              </Col>
            </>
          ) : (
            <>
              <Col md={6} className="f-center border-thin p-0 py-2">
                <h4>No address</h4>
              </Col>
              <Col md={6} className="f-center border-thin p-0 py-2 gap-1">
                {loading ? (
                  <Button variant="primary" size="lg" disabled>
                    <Spinner animation="border" variant="dark" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddModalShow}
                    className="edit-btn btn-primary-dark"
                  >
                    Add
                  </Button>
                )}
              </Col>
            </>
          )}
        </ReactPlaceholder>
      </Row>

      <Modal show={showAdd} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add your address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAddress}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="street"
                  required
                  name="street"
                  onChange={handleAddressAddChange}
                />
              </Form.Group>
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                placeholder="unit"
                required
                name="unit"
                onChange={handleAddressAddChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>City/Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="city/town"
                required
                name="town"
                onChange={handleAddressAddChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Province</Form.Label>
              <Form.Control
                type="text"
                placeholder="province"
                autoFocus
                required
                name="province"
                onChange={handleAddressAddChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="postcode"
                required
                name="post_code"
                onChange={handleAddressAddChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                disabled
                label="Default address"
                defaultChecked={defaultAddress}
                onChange={handleCheckChange}
              />
            </Form.Group>
            {loading ? (
              <Button variant="primary" size="lg" disabled>
                <Spinner animation="border" variant="light" />
              </Button>
            ) : (
              <Button type="submit" variant="dark">
                Add Address
              </Button>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AllOrders = () => {
  const navigate = useNavigate();

  return (
    <>
      <Row className="m-0">
        <p
          style={{
            marginBottom: "1.5rem",
          }}
        >
          Click here to see all your previous orders!
        </p>
        <Button variant="dark" onClick={() => navigate("/home/my-orders")}>
          My Orders
        </Button>
      </Row>
    </>
  );
};

const ReferFriend = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { user } = useSelector((state) => state.auth);

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

  const handleCopyClick = async () => {
    try {
      await copyTextToClipboard(`${user}`);

      toast.success("Copied to clipboard", toastOptions);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Alert variant="dark">
        <Alert.Heading>Discount code</Alert.Heading>
        <p className="mb-2 mt-3">
          Has sharing ever got you free stuff? It will now! Refer our products
          to your friends and get discount on your next purchase.
        </p>

        <p className="mb-4 mt-4">
          Paste this code during sign-up to receive the discount.
        </p>
        <hr />
        <p className="mb-0">
          <Button variant="dark" onClick={() => handleCopyClick()}>
            {isCopied ? (
              "Copied!"
            ) : (
              <>
                <p>
                  Copy code <BiCopy />
                </p>
              </>
            )}
          </Button>
        </p>
      </Alert>

      {/* <Row className="m-0">
        <Col md={6} className="f-center border-thin px-2 py-2">
          <p>
            Has sharing ever got you free stuff? It will now! Refer our products
            to your friends and get flat discount of $20 on your next purchase.
          </p>
        </Col>
        <Col md={6} className="f-center border-thin px-2 py-2">
          <Button variant="dark" onClick={() => handleCopyClick()}>
            {isCopied ? (
              "Copied!"
            ) : (
              <>
                <p>
                  Click here to copy your code <BiCopy />
                </p>
              </>
            )}
          </Button>
        </Col>
      </Row> */}
    </>
  );
};

const MyCoupon = () => {
  const navigate = useNavigate();
  return (
    <>
      <Alert variant="dark">
        <Alert.Heading>View your coupons!</Alert.Heading>
        <p className="mb-2 mt-3">Click here to check available coupons!</p>

        <hr />
        <p className="mb-0">
          <Button variant="dark" onClick={() => navigate("/home/my-coupons")}>
            My coupons
          </Button>
        </p>
      </Alert>
    </>
  );
};

const contentList = [
  {
    name: "edit your account information",
    det1: "my account information",
    det2: "Your Personal Details",
    content: <AccountForm />,
  },
  {
    name: "change your password",
    det1: "change password",
    det2: "Your Password",
    content: <PasswordForm />,
  },
  {
    name: "modify your address book entries",
    det1: "address book entries",
    det2: "",
    content: <AddressBook />,
  },
  {
    name: "Your Orders",
    det1: "Your orders will appear here",
    det2: "",
    content: <AllOrders />,
  },
  // {
  //   name: "Refer a friend",
  //   det1: "Exciting news!",
  //   det2: "",
  //   content: <ReferFriend />,
  // },
  // {
  //   name: "Coupons",
  //   det1: "",
  //   det2: "",
  //   content: <MyCoupon />,
  // },
];

const Profile = () => {
  const path = window.location.pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ReactBreadcrumb path={`Home / My-Account`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container className="pt-5 px-3 px-md-0">
          <div
            className="f-center flex-column profile-container"
            style={{ marginTop: "2rem" }}
          >
            {contentList.map((item, i) => (
              <ContentContainer key={item.name} no={i + 1} item={item} />
            ))}
          </div>
        </Container>
      </motion.div>

      <ToastContainer />
    </>
  );
};

export default Profile;

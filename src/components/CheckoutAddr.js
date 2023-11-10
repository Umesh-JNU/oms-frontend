import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Modal,
  Alert,
} from "react-bootstrap";
import axios from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../features/apiCall";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import {
  addressesFailure,
  addressesStart,
  addressesSuccess,
} from "../features/allAddressSlice";
import {
  addressSuccess,
  setaddress,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../features/setChecAddr";
import { TbRosetteNumber1 } from "react-icons/tb";
import { ImSad } from "react-icons/im";
import ModalLayout from "./modal/ModalLayout";
import { AiOutlinePlus } from "react-icons/ai";

const CheckoutAddr = () => {
  const { token } = useSelector((state) => state.auth);

  const { addresses, addressesErr, loadingAddr } = useSelector(
    (state) => state.addresses
  );
  const { addressCheck, fetchingUpdate } = useSelector(
    (state) => state.address
  );
  const dispatch = useDispatch();
  const [townCity, setTownCity] = useState();
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [addAddressValues, setAddAddressValues] = useState({
    province: "",
    town: "",
    street: "",
    post_code: "",
    unit: "",
    defaultAddress: undefined,
  });

  const handleAddAdressChange = (e) => {
    setAddAddressValues({
      ...addAddressValues,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const handleAddAddressCheck = (e) => {
    // setDefaultAddressAdd(e.target.checked);
    setAddAddressValues({
      ...addAddressValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAddModalClose = () => setShowAdd(false);

  const fetchAddress = async () => {
    dispatch(addressesStart());

    try {
      const { data } = await axios.get("/api/user/address/all", {
        headers: {
          Authorization: `${token}`,
        },
      });

      dispatch(addressesSuccess(data?.address_book));
    } catch (error) {
      dispatch(addressesFailure(error?.response?.data?.error?.message));

      toast.error("Something wenr wrong! Please try again.", toastOptions);
    }
  };

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAddress();

    getCart(dispatch);
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const { province, post_code, street, town, defaultAddress, unit } =
      addAddressValues;

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
      fetchAddress();
      setLoading(false);
    } catch (error) {
      // console.log(error?.response?.data?.error?.message);
      setLoading(false);
      // console.log(error?.response?.data?.error?.message);

      toast.error("Something wenr wrong! Please try again.", toastOptions);
    }

    setLoading(false);
    setShowAdd(false);
  };

  const handleAddress = async (id) => {
    await dispatch(addressSuccess(id));
  };

  const handleUpdate = async () => {
    dispatch(updateStart());

    try {
      const { data } = await axios.get(
        `/api/user/calc-shipping/?addr_id=${addressCheck}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      await dispatch(
        updateSuccess({
          charges: data?.charge,
          free_ship: data?.free_ship,
          total: data?.total,
          message: data?.message,
        })
      );
      navigate("/home/checkout", { replace: true });
    } catch (error) {
      // console.log(error?.response?.data?.error);
      dispatch(updateFailure(error?.response?.data?.error?.message));

      toast.error(error?.response?.data?.error?.message, toastOptions);
    }
  };

  useEffect(() => {
    dispatch(setaddress());
  }, []);

  return (
    <>
      <ReactBreadcrumb path={`Home / Checkout`} />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ paddingTop: "5rem" }}>
          <div className="checkout-addr-top">
            <div className="checkout-addr-title-cont">
              <TbRosetteNumber1 className="checkout-steps" />

              <div>
                <p className="checkout-addr-title">Select a delivery address</p>
              </div>
            </div>
            <div className="checkout-addr-btn">
              <Button variant="dark" onClick={() => setShowAdd(true)}>
                Add New Address <AiOutlinePlus />
              </Button>
            </div>
          </div>

          <div>
            {/* <div>
              <h6>SHIPPING</h6>
            </div> */}
            <div>
              <span className="checkout-addr-span">
                Shipping costs will be calculated once you have provided
                address.
              </span>
            </div>
          </div>
          <div>
            <div>
              <div className="shipping-detail">
                <h6 className="mt-4">CALCULATE SHIPPING</h6>
                <div>
                  <ReactPlaceholder
                    type="text"
                    color="#F0F0F0"
                    showLoadingAnimation
                    rows={8}
                    ready={!loading && !loadingAddr}
                  >
                    <div className="cart-select-city">
                      <div className="cart-addr-holder">
                        {!loadingAddr && addresses?.length <= 0 ? (
                          <Alert
                            variant="danger"
                            style={{ width: "50%", margin: "auto" }}
                            className="no-prod-msg-box-alert"
                          >
                            <Alert.Heading className="no-prod-msg-box">
                              <span>
                                {" "}
                                <ImSad /> You don't have any addresses!
                              </span>
                            </Alert.Heading>

                            <hr />
                            <p className="mb-5">
                              Add your address to place your order.
                            </p>
                          </Alert>
                        ) : (
                          addresses?.map((address) => (
                            <div key={address?._id} className="cart-addre-cont">
                              <Form.Check
                                type={"radio"}
                                onChange={(e) => {
                                  setTownCity(e.target.value);
                                  handleAddress(address?._id);
                                  // console.log(address?._id);
                                }}
                                checked={address?._id === addressCheck}
                                value={address?.town}
                                label={
                                  <>
                                    <p>
                                      {address?.unit} {address?.street},{" "}
                                      {address?.town}, {address?.province},{" "}
                                      {address?.post_code}
                                    </p>
                                  </>
                                }
                              />
                            </div>
                          ))
                        )}
                      </div>

                      {townCity?.length > 0 && (
                        <p className="cart-selected-city">
                          Selected town/city: {townCity}
                        </p>
                      )}
                    </div>
                  </ReactPlaceholder>
                </div>
                {!fetchingUpdate ? (
                  townCity?.length > 0 ? (
                    <Button
                      className="update-btn"
                      variant="dark"
                      onClick={() => handleUpdate()}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button disabled className="update-btn" variant="dark">
                      Next
                    </Button>
                  )
                ) : (
                  <Button variant="dark" className="update-btn" disabled>
                    <Spinner animation="border" variant="light" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Container>
      </motion.div>

      <ModalLayout
        show={showAdd}
        handleClose={handleAddModalClose}
        handleAddAdressChange={handleAddAdressChange}
        loading={loading}
        status={"add"}
        addAddressValues={addAddressValues}
        handleAddAddress={handleAddAddress}
        handleAddAddressCheck={handleAddAddressCheck}
      />

      <ToastContainer />
    </>
  );
};

export default CheckoutAddr;

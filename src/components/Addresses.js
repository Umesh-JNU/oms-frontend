import axios from "../utils/axios";
import { getError } from "../utils/error";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";

import { ToastContainer, toast } from "react-toastify";

import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { ModalLayout } from "./layout";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        addresses: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "GET_REQUEST":
      return { ...state, getAddrLoading: true };
    case "GET_SUCCESS":
      return { ...state, getAddrLoading: false, address: action.payload };
    case "GET_FAIL":
      return { ...state, getAddrLoading: false, error: action.payload };
  }
};

const Addresses = () => {
  const [{ loading, getAddrLoading, addresses, address, error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const { token } = useSelector((state) => state.auth);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState("");
  const [editAddressId, setEditAddressId] = useState("");
  // const [defaultAddress, setDefaultAddress] = useState(false);
  // const [defaultAddressAdd, setDefaultAddressAdd] = useState(false);
  const [values, setValues] = useState({
    province: "",
    town: "",
    street: "",
    post_code: "",
    unit: "",
    defaultAddress: undefined,
  });
  const [addAddressValues, setAddAddressValues] = useState({
    province: "",
    town: "",
    street: "",
    post_code: "",
    unit: "",
    defaultAddress: undefined,
  });

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleCheckChange = (e) => {
    // setDefaultAddress(e.target.checked);
    setValues({ ...values, [e.target.name]: e.target.checked });
  };

  const handleAddAddressCheck = (e) => {
    // setDefaultAddressAdd(e.target.checked);
    setAddAddressValues({
      ...addAddressValues,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAddressChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value.toLowerCase() });
  };

  const handleAddAdressChange = (e) => {
    setAddAddressValues({
      ...addAddressValues,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const fetchAddress = async () => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const { data } = await axios.get("/api/user/address/all", {
        headers: {
          Authorization: `${token}`,
        },
      });

      dispatch({ type: "FETCH_SUCCESS", payload: data?.address_book });
    } catch (err) {
      // console.log(error?.response?.data?.error);
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err)
      });

      toast.error(error, toastOptions);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAddress();
  }, []);

  const getAddress = async (addressId) => {
    dispatch({ type: "GET_REQUEST" });
    try {
      const { data } = await axios.get(`/api/user/address/${addressId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });

      console.log({ address: data.address })
      setValues({
        province: data?.address?.province,
        town: data?.address?.town,
        street: data?.address?.street,
        post_code: data?.address?.post_code,
        unit: data?.address?.unit,
        defaultAddress: data?.address?.defaultAddress,
      });
      dispatch({ type: "GET_SUCCESS", payload: data?.address });
      // if (data?.address?.defaultAddress) {
      //   setDefaultAddress(data?.address?.defaultAddress);
      // }
    } catch (err) {
      dispatch({
        type: "GET_FAIL",
        payload: getError(err)
      });

      toast.error(error, toastOptions);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      if (deleteModal) {
        const { data } = await axios.delete(`/api/user/address/${addressId}`, {
          headers: { Authorization: `${token}` },
        });

        toast.success(data?.message, toastOptions);

        fetchAddress();
      }
    } catch (err) {
      toast.error(getError(err), toastOptions);
    }
  };

  const editAddress = async (addressId) => {
    const { province, town, street, post_code, defaultAddress, unit } = values;

    try {
      await axios.put(
        `/api/user/address/${addressId}`,
        { province, town, street, post_code, defaultAddress, unit },
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Address updated!", toastOptions);

      fetchAddress();
    } catch (err) {
      toast.error(getError(err), toastOptions);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    // const defaultAddress = defaultAddressAdd;

    const { province, post_code, street, town, defaultAddress, unit } = addAddressValues;

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
    } catch (err) {
      toast.error(getError(err), toastOptions);
    }

    setShowAdd(false);
  };

  const handleAddModalClose = () => setShowAdd(false);
  const handleAddModalShow = () => setShowAdd(true);

  const handleEditModalClose = () => setShowEdit(false);

  const handleEditModalShow = (addressId) => {
    setShowEdit(true);

    getAddress(addressId);

    setEditAddressId(addressId);
  };

  const handleDeleteShow = (addressId) => {
    setShowDelete(true);

    setDeleteModal(true);

    setDeleteAddressId(addressId);
  };

  const handleDelete = () => {
    setShowDelete(false);

    deleteAddress(deleteAddressId);
  };

  const handleEditModal = (e) => {
    e.preventDefault();

    editAddress(editAddressId);

    setShowEdit(false);
  };

  const handleClose = () => {
    setShowDelete(false);
    setDeleteModal(false);
  };

  return (
    <>
      <ReactBreadcrumb path={`Home / My-Account / Addresses`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container>
          <div className="all-addr-upper">
            <h2 className="all-addr-title">Your Addresses</h2>
            <div className="add-address-btn">
              <Button onClick={handleAddModalShow} variant="dark">
                Add Address <AiOutlinePlus />
              </Button>
            </div>
          </div>
          <ReactPlaceholder
            type="text"
            color="#F0F0F0"
            showLoadingAnimation
            rows={7}
            ready={!loading}
          >
            {addresses?.length !== 0 ? (
              addresses?.map((address) => (
                <>
                  <Row
                    key={address?._id}
                    className="m-0 justify-content-center"
                    style={{
                      paddingTop: "1.5rem",
                      paddingBottom: "1.5rem",
                      paddingRight: "2rem",
                      paddingLeft: "2rem",
                    }}
                  >
                    <Col
                      md={4}
                      className="border-thin p-0 py-2"
                      style={{
                        borderRadius: "0.5rem",
                      }}
                    >
                      <p className="all-adrr-cont">
                        {address?.defaultAddress && (
                          <p className="all-addr-default">
                            Default:{" "}
                            <span
                              style={{
                                fontWeight: 500,
                              }}
                            >
                              OMS
                            </span>
                          </p>
                        )}
                        {address?.street} {address?.unit} {address?.town}
                        <br />
                        {address?.province}
                        <br />
                        {address?.post_code}
                      </p>
                    </Col>
                    <Col
                      md={4}
                      style={{
                        borderRadius: "0.5rem",
                      }}
                      className="f-center border-thin p-0 py-2 gap-1"
                    >
                      <Button
                        onClick={() => handleEditModalShow(address?._id)}
                        className="edit-btn btn-dark"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteShow(address?._id)}
                        // className="btn-dark"
                        variant="danger"
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </>
              ))
            ) : (
              <p className="all-addr-empty">
                Add your address to see them here!
              </p>
            )}
          </ReactPlaceholder>
        </Container>
      </motion.div>

      {!getAddrLoading && (
        <ModalLayout
          show={showEdit}
          handleClose={handleEditModalClose}
          status={"edit"}
          handleEditModal={handleEditModal}
          address={address}
          addresses={address}
          values={values}
          handleAddressChange={handleAddressChange}
          handleCheckChange={handleCheckChange}
        />
      )}

      <ModalLayout
        show={showDelete}
        handleClose={handleClose}
        status={"delete"}
        handleDelete={handleDelete}
      />

      <ModalLayout
        show={showAdd}
        handleClose={handleAddModalClose}
        status={"add"}
        addAddressValues={addAddressValues}
        handleAddAddress={handleAddAddress}
        handleAddAdressChange={handleAddAdressChange}
        handleAddAddressCheck={handleAddAddressCheck}
        loading={loading}
      />

      <ToastContainer />
    </>
  );
};

export default Addresses;

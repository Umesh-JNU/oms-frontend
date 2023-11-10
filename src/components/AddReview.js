import React, { useEffect, useReducer, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useGetProductQuery } from "../features/productsApi";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rating } from "react-simple-star-rating";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { motion } from "framer-motion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        review: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "ADD_SUCCESS":
      return { ...state, loading: false };
    case "ADD_FAIL":
      return { ...state, loading: false, error: action.payload };
  }
};

const AddReview = () => {
  const [{ loading, review, error, submit }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const params = useParams();
  const [product, setProduct] = useState();
  const [rating, setRating] = useState(0);
  const [values, setValues] = useState({
    review: "",
    submit: false,
  });

  const starTooltip = [
    "Terrible",
    "Terrible+",
    "Bad",
    "Bad+",
    "Good",
    "Good+",
    "Great",
    "Great+",
    "Awesome",
    "Awesome+",
  ];

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const { data: productData, isLoading: productLoading } = useGetProductQuery(
    params?.id
  );

  useEffect(() => {
    if (productData) {
      setProduct(productData?.product);
    }
  }, [productData]);

  const getReview = async () => {
    dispatch({ type: "FETCH_REQUEST" });

    try {
      const { data } = await axios.get(`/api/review/${params?.id}`, {
        headers: { Authorization: token },
      });

      setValues({
        review: data?.review?.comment,
        submit: true,
      });

      setRating(data?.review?.rating);
      dispatch({ type: "FETCH_SUCCESS", payload: data?.review });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: error });
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { review } = values;

    const product = params?.id;
    const comment = review;

    if (rating !== 0) {
      dispatch({ type: "ADD_REQUEST" });
      try {
        const { data } = await axios.post(
          `/api/review/create`,
          { rating, product, comment },
          { headers: { Authorization: token } }
        );

        dispatch({ type: "ADD_SUCCESS" });
        toast.success("Review submitted - Thank you", toastOptions);

        getReview();

        setTimeout(() => {
          navigate("/home/my-orders");
        }, 2000);
      } catch (error) {
        dispatch({ type: "ADD_FAIL", payload: error });
      }
    } else {
      toast.error("Please select rating", toastOptions);
    }
  };

  return (
    <>
      <ReactBreadcrumb path={`Home / My-Account / My-Orders / review`} />

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container style={{ marginTop: "6rem" }}>
          <h3>Create Review</h3>

          <div className="add-review-cont">
            <ReactPlaceholder
              type="media"
              color="#F0F0F0"
              showLoadingAnimation
              rows={7}
              ready={!productLoading}
            >
              <div className="product-review-cont">
                <div>
                  <img
                    className="product-review-img"
                    src={product?.product_images[0]}
                    alt={product?.name}
                  />
                </div>
                <div className="product-review-desc">
                  <p>{product?.description?.slice(0, 140)}...</p>
                </div>
              </div>
            </ReactPlaceholder>

            <hr />
            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={3}
              ready={!loading}
            >
              <div className="overall-star-div">
                <h5>Overall Rating</h5>

                <div className="overall-star">
                  <Rating
                    transition={true}
                    showTooltip={true}
                    initialValue={rating}
                    onClick={handleRating}
                    allowFraction={true}
                    tooltipClassName="rating-tooltip"
                    tooltipArray={starTooltip}
                    readonly={values?.submit ? true : false}
                    allowHover={values?.submit ? false : true}
                  />
                </div>
              </div>
            </ReactPlaceholder>
            <hr />

            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={7}
              ready={!loading}
            >
              <div className="add-title">
                <div className="title-form">
                  <Form onSubmit={handleSubmit}>
                    {/* <h5>Add a headline</h5>
                  <Form.Control
                    type="text"
                    placeholder="What's most important to know?"
                    id="inputtext"import { motion } from 'framer-motion';

                    className="form-input"
                    name="headline"
                    value={values?.headline}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    required
                  /> */}
                    <h5>Add a review</h5>

                    <Form.Control
                      as="textarea"
                      placeholder="What did you like or dislike? What did you use this product for?"
                      required
                      rows={5}
                      value={values?.review}
                      className="form-input"
                      name="review"
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <hr />

                    {!values?.submit && (
                      <div className="form-btn">
                        <Button variant="dark" type="submit">
                          Submit
                        </Button>
                      </div>
                    )}
                  </Form>
                </div>
              </div>
            </ReactPlaceholder>
          </div>
        </Container>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default AddReview;

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

import ReactBreadcrumb from "./layout/BreadCrumb";
import ReactPlaceholder from "react-placeholder";

import CardTop from "./card/CardTop";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCategoryQuery,
  useGetSubCategoryQuery,
} from "../features/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { addCart, getCart } from "../features/apiCall";

import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import axios from "../utils/axios";
import { Rating } from "react-simple-star-rating";
import {
  reviewFailure,
  reviewStart,
  reviewSuccess,
} from "../features/reviewSlice";
import { motion } from "framer-motion";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
} from "../features/getProdSlice";
import ReactImageMagnify from "react-image-magnify";
import ProductDetailsTabs from "./layout/ProductDetailsTabs";
import RelatedProds from "./layout/RelatedProds";
// import ModalLayout from "./modal/ModalLayout";
import { ageCheckSuccess } from "../features/ageCheckSlice";
import AlertBox from "./layout/AlertBox";

const ProductDetails = () => {
  const [productAddded, setProductAddded] = useState(false);
  const navigate = useNavigate();
  // const { reviews } = useSelector((state) => state.review);

  const { token } = useSelector((state) => state.auth);
  const { cartItems, isFetching } = useSelector((state) => state.cart);
  const { product, loadingProduct, productErr } = useSelector(
    (state) => state.product
  );
  const { ageCheck } = useSelector((state) => state.ageCheck);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [count, setCount] = useState(1);
  const [category, setCategory] = useState();
  // const [subcategory, setSubcategory] = useState();
  const [prodPrice, setProdPrice] = useState();
  const [updatedProdPrice, setUpdatedProdPrice] = useState();
  const [selectedQty, setSelectedQty] = useState();
  const [subId, setSubId] = useState();
  const [volume, setVolume] = useState();
  const [stock, setStock] = useState();
  const [selectedImg, setSelectedImg] = useState("");

  const getProduct = async () => {
    dispatch(getProductStart());
    try {
      const { data } = await axios(`/api/product/${params?.id}`);

      dispatch(getProductSuccess(data?.product));
      setSelectedImg(data?.product?.product_images[0]);
    } catch (error) {
      dispatch(getProductFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    if (!token && !ageCheck) {
      setModal(true);
    }
  }, [token, ageCheck]);

  useEffect(() => {
    if (token) {
      getCart(dispatch);
    }
  }, [token]);

  // const getReviews = async () => {
  //   dispatch(reviewStart());

  //   try {
  //     const { data } = await axios.get(`/api/review/all/${params?.id}`, {
  //       headers: { Authorization: token },
  //     });

  //     dispatch(reviewSuccess(data?.reviews));
  //   } catch (error) {
  //     dispatch(reviewFailure(error?.response?.data?.error?.message));
  //   }
  // };

  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery(product?.category?._id);

  // const { data: subCategoryData, isLoading: subCategoryLoading } =
  //   useGetSubCategoryQuery(product?.sub_category?._id);

  useEffect(() => {
    window.scroll(0, 0);
    getProduct();

    setCategory(categoryData?.category);

    // setSubcategory(subCategoryData?.subCategory);

    // getReviews();
    // }, [categoryData?.category, subCategoryData?.subCategory]);
  }, [categoryData?.category]);

  useEffect(() => {
    setSubId(
      product?.subProducts?.filter(
        (subItem) => subItem?._id === window.location.search?.split("=")[1]
      )[0]?._id
    );
  }, [product?.subProducts]);

  const handleCount = (change) => {
    if (change === "dec") {
      if (count === 1) {
        setCount(count);
        return;
      } else {
        setCount((prev) => prev - 1);
        return;
      }
    }

    if (change === "inc" && count < volume) {
      setCount((prev) => prev + 1);
      return;
    } else {
      toast.error(
        `There are only ${volume} in stock for this quantity.`,
        toastOptions
      );
      return;
    }
  };

  useEffect(() => {
    if (cartItems.length !== 0) {
      if (
        cartItems
          ?.filter(
            (prod) =>
              prod?.product?.qname === selectedQty &&
              prod?.product?.pid?._id === product?._id
          )
          .map((prod) => prod?.quantity)
          .toString() < count?.toString()
        // .toString() !== count?.toString()
      ) {
        setProductAddded(false);
      } else {
        setProductAddded(true);
      }
    }
  }, [cartItems, count, params.id, selectedQty]);

  const handleCart = async (product, count, amount) => {
    const prodId = subId;
    await addCart(dispatch, { prodId, count });

    await getCart(dispatch);

    setTimeout(() => {
      navigate("/home/cart");
    }, 1000);
  };

  const zoomOutProperties = {
    autoplay: false,
    indicators: true,
    scale: 0.4,
    arrows: true,
  };

  useEffect(() => {
    if (product?.sale > 0) {
      setUpdatedProdPrice(
        product?.subProducts
          ?.filter((subItem) => subItem?._id === subId)[0]
          ?.updatedAmount?.toFixed(2)
      );
    }

    setProdPrice(
      product?.subProducts
        ?.filter((subItem) => subItem?._id === subId)[0]
        ?.amount?.toFixed(2)
    );
    setSelectedQty(
      product?.subProducts?.filter((subItem) => subItem?._id === subId)[0]
        ?.quantity?.canada
    );
    setStock(
      product?.subProducts?.filter((subItem) => subItem?._id === subId)[0]
        ?.stock
    );
    setVolume(
      product?.subProducts?.filter((subItem) => subItem?._id === subId)[0]
        ?.volume
    );
    setCount(1);
  }, [subId]);

  return (
    <>
      {!loadingProduct && <ReactBreadcrumb path={`Home / Shop-Product`} />}
      {/* {(ageCheck || token) && ( */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        {productErr ? (
          <Container style={{ paddingTop: "5rem" }}>
            <AlertBox
              type={"danger"}
              heading={"Requested product not found!"}
              desc={"This product no longer exists."}
            />
          </Container>
        ) : (
          <Container style={{ paddingTop: "3rem" }}>
            <Row className="product-content">
              <ReactPlaceholder
                type="media"
                color="#F0F0F0"
                showLoadingAnimation
                rows={7}
                ready={
                  !loadingProduct && !categoryLoading
                  // !loadingProduct && !categoryLoading && !subCategoryLoading
                }
              >
                <Col md={5} className="">
                  {/* <Zoom {...zoomOutProperties}> */}
                  {/* {product?.product_images?.map((each, index) => ( */}
                  <div
                    key={Math.random()}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    {/* <CardTop key={product?._id} path={each} /> */}
                    <div className="shop-top-img">
                      {product?.sale > 0 && (
                        <div className="top-right">
                          <span>{product?.sale}%</span>
                          {/* <span>New</span> */}
                        </div>
                      )}
                      <ReactImageMagnify
                        {...{
                          smallImage: {
                            alt: "image",
                            // isFluidWidth: true,
                            src: product?.product_img,
                            width: 300,
                            height: 300,
                            // sizes: "(min-width: 800px) 2rem",
                            // "(min-width: 800px) 10rem, (min-width: 415px) 50vw, 10rem",
                          },
                          largeImage: {
                            src: product?.product_img,
                            width: 800,
                            height: 800,
                          },
                        }}
                        isHintEnabled={true}
                        hintTextTouch="Long-Touch to Zoom"
                      // enlargedImagePosition="over"
                      />
                    </div>
                  </div>
                  {/* ))} */}
                  {/* </Zoom> */}
                  {/* <Row className="m-0 mt-2">
                    <Col className="px-0 justify-content-center align-items-center">
                      <div className="sub-images">
                        <div className="sub-images">
                          <img
                            src={product?.product_img}
                            alt=""
                            onClick={() => setSelectedImg(product.product_img)}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row> */}
                </Col>
                <Col md={6}>
                  <div className="prod-header">
                    <p className="sub-head-1 m-0">
                      {/* Vendors<span> / </span> */}
                      {category?.name}
                    </p>
                    <h1 className="sub-head-2">
                      {product?.name}, {selectedQty}
                    </h1>
                  </div>
                  <div className="divider"></div>
                  <div className="prod-body">
                    {product?.sale > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div className="old-price">
                          <span>
                            <bdi>
                              <span>$</span>
                            </bdi>
                            {prodPrice}
                            {/* {product?.amount?.toFixed(2)} */}
                          </span>
                        </div>

                        <div className="updated-price">
                          <span>
                            <bdi>
                              <span>$</span>
                            </bdi>
                            {updatedProdPrice}
                            {/* {product?.amount?.toFixed(2)} */}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="price">
                        <span>
                          <bdi>
                            <span>$</span>
                          </bdi>
                          {prodPrice}
                          {/* {product?.amount?.toFixed(2)} */}
                        </span>
                      </div>
                    )}

                    {/* <div className="product-rating">
                      <Rating
                        initialValue={product?.rating}
                        // size={16}
                        readonly={true}
                        allowHover={false}
                        allowFraction={true}
                        style={{ zIndex: -1 }}
                      // showTooltip
                      />
                      <p style={{ marginLeft: "1rem" }}>
                        {reviews?.length} ratings
                      </p>
                    </div> */}
                    {/* <div className="prod-desc">
                      <p>{product?.description}</p>
                    </div> */}
                    <div className="prod-qty-select-cont">
                      <p>You can change the product quantity from here</p>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => {
                          setSubId(e.target.value);
                        }}
                        className="prod-qty-select"
                      >
                        {product?.subProducts?.map((subItem) => (
                          <option value={subItem?._id} key={subItem?._id}>
                            {subItem?.quantity.canada} ml
                          </option>
                        ))}
                      </Form.Select>
                      <p>Selected quantity: {selectedQty} ml</p>
                    </div>
                    <div className="prod-btn-box">
                      <div className="prod-btn-box-1">
                        <div onClick={() => handleCount("dec")}>-</div>
                        <span>{count}</span>
                        <div onClick={() => handleCount("inc")}>+</div>
                      </div>
                      <div className="prod-btn-box-2">
                        {token ? (
                          productAddded || !stock ? (
                            <Button disabled variant="dark">
                              Add to cart
                            </Button>
                          ) : isFetching ? (
                            <Button variant="dark" disabled>
                              <Spinner animation="border" size="sm" variant="light" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() =>
                                handleCart(product, count, product?.amount)
                              }
                              variant="dark"
                            >
                              Add to cart
                            </Button>
                          )
                        ) : (
                          <Button
                            onClick={() => navigate("/home/sign-in")}
                            variant="dark"
                          >
                            Sign in!
                          </Button>
                        )}
                      </div>
                      {productAddded && <i>Added to cart</i>}
                      {!stock && <i style={{ color: "red" }}>Out of stock</i>}
                    </div>
                  </div>
                  <div className="prod-footer mt-2">
                    <ReactPlaceholder
                      type="text"
                      color="#F0F0F0"
                      showLoadingAnimation
                      rows={1}
                      ready={!categoryLoading}
                      // ready={!categoryLoading && !subCategoryLoading}
                    >
                      <p>
                        Categories: {category?.name}
                        {/* Categories: {category?.name} / {subcategory?.name} */}
                      </p>
                    </ReactPlaceholder>
                  </div>
                </Col>
              </ReactPlaceholder>
            </Row>

            <ProductDetailsTabs
              loadingProduct={loadingProduct}
              product={product}
            />

            <hr />

            <RelatedProds
              categoryLoading={categoryLoading}
              // subCategoryLoading={subCategoryLoading}
              categoryId={product?.category?._id}
            />
          </Container>
        )}
      </motion.div>
      {/* )} */}

      <ToastContainer />

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

export default ProductDetails;

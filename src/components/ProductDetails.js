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
import { locationSuccess } from "../features/locationSlice";
import AlertBox from "./layout/AlertBox";
import ModalLayout from "./layout/ModalLayout";

const toastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { location } = useSelector((state) => state.location);
  const { cartItems, isFetching } = useSelector((state) => state.cart);
  const { product, loadingProduct, productErr } = useSelector((state) => state.product);

  const { data: categoryData, isLoading: categoryLoading } = useGetCategoryQuery(product?.category?._id);

  const [productAddded, setProductAddded] = useState(false);
  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState();
  const [selectedQty, setSelectedQty] = useState();
  const [subId, setSubId] = useState();
  const [volume, setVolume] = useState();
  const [stock, setStock] = useState();
  const [selectedImg, setSelectedImg] = useState("");

  console.log("PRODUCT DETAILS", { category })
  const getProduct = async () => {
    dispatch(getProductStart());
    try {
      const { data } = await axios(`/api/product/${params?.id}`);

      dispatch(getProductSuccess(data?.product));
      setSelectedImg(data?.product?.product_img);
    } catch (error) {
      dispatch(getProductFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    if (!token && !location) {
      setModal(true);
    }

    if (token) {
      getCart(dispatch);
    }
  }, [token, location]);

  useEffect(() => {
    window.scroll(0, 0);
    getProduct();

    setCategory(categoryData?.category);
  }, [categoryData?.category]);

  useEffect(() => {
    setSubId(
      product?.subProducts?.filter(
        (subItem) => subItem?._id === window.location.search?.split("=")[1]
      )[0]?._id
    );
  }, [product?.subProducts]);

  useEffect(() => {
    if (cartItems.length !== 0) {
      console.log({ cartItems })
      if (
        cartItems
          ?.filter((prod) =>
            prod?.product?.quantity === selectedQty &&
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

  useEffect(() => {
    setSelectedQty(
      product?.subProducts?.filter((subItem) => subItem?._id === subId)[0]
        ?.quantity
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

    if (change === "inc" && stock) {
      setCount((prev) => prev + 1);
      return;
    } else {
      toast.error('The product variant is out of stock.', toastOptions);
      return;
    }
  };

  const handleCart = async (product, count, amount) => {
    const prodId = subId;
    await addCart(dispatch, { prodId, count });

    await getCart(dispatch);

    setTimeout(() => {
      navigate("/home/cart");
    }, 1000);
  };

  return (
    <>
      {!loadingProduct && <ReactBreadcrumb path={`Home / Shop-Product`} />}
      {(location || token) && (
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
                  ready={!loadingProduct && !categoryLoading}
                >
                  <Col md={5} className="">
                    <div
                      key={Math.random()}
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <div className="shop-top-img">
                        <ReactImageMagnify
                          {...{
                            smallImage: {
                              alt: "image",
                              src: product?.product_img,
                              width: 300,
                              height: 300,
                            },
                            largeImage: {
                              src: product?.product_img,
                              width: 800,
                              height: 800,
                            },
                          }}
                          isHintEnabled={true}
                          hintTextTouch="Long-Touch to Zoom"
                          className="magnify"
                        // enlargedImagePosition="over"
                        />
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="prod-header">
                      <p className="sub-head-1 m-0">
                        {category?.name}
                      </p>
                      <h1 className="sub-head-2">
                        {product?.name}, {selectedQty} {product?.category?.location === 'CA' ? 'ml' : 'fl. Oz.'}
                      </h1>
                    </div>

                    <div className="divider"></div>

                    <div className="prod-body">
                      <div className="prod-qty-select-cont">
                        <p>You can change the product quantity from here</p>
                        <Form.Select
                          className="prod-qty-select"
                          aria-label="Default select example"
                          onChange={(e) => {
                            const val = JSON.parse(e.target.value);
                            console.log(e.target.value, e.currentTarget, "change", val)
                            setSubId(val?._id);
                            setStock(val?.stock);
                            setCount(1);
                          }}
                        >
                          {product?.subProducts?.map((subItem) => (
                            <option value={JSON.stringify(subItem)} key={subItem?._id}>
                              {subItem?.quantity} {product?.category?.location === 'CA' ? 'ml' : 'fl. Oz.'}
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
                      >
                        <p>
                          Categories: {category?.name}
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

              {/* <hr />

            <RelatedProds
              categoryLoading={categoryLoading}
              // subCategoryLoading={subCategoryLoading}
              categoryName={product?.category?.name}
            /> */}
            </Container>
          )}
        </motion.div>
      )}

      <ToastContainer />

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

export default ProductDetails;

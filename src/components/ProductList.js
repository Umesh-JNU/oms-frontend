import React, { useEffect, useReducer, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReactBreadcrumb from "./layout/BreadCrumb";
import { useGetAllCategoriesQuery, useGetShopDetailsQuery } from "../features/productsApi";
import axios from "../utils/axios";
import { motion } from "framer-motion";
import Product from "./layout/Product";
import SideCate from "./layout/SideCate";
import { useDispatch, useSelector } from "react-redux";
// import ModalLayout from "./modal/ModalLayout";
import {
  getProductListFailure,
  getProductListStart,
  getProductListSuccess,
} from "../features/productListSlice";
import { ageCheckSuccess } from "../features/ageCheckSlice";
import AlertBox from "./layout/AlertBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload,
        productsCount: action.payload?.length,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "AGECHECK_SUCCESS":
      return {
        ...state,
        ageCheck: action.payload,
      };

    default:
      return state;
  }
};

const Shop = () => {
  const [searchParams, _] = useSearchParams(document.location.search);
  const queryCategory = decodeURIComponent(searchParams.get('category'));
  console.log({ queryCategory })
  // const [{ loading, products, productsCount, error, ageCheck }, dispatch] =
  //   useReducer(reducer, { loading: true, error: "" });
  const { ageCheck } = useSelector((state) => state.ageCheck);
  const { loading, products, productsCount, error } = useSelector((state) => state.productList);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [modal, setModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [width, setWidth] = useState();
  const params = useParams();
  const [showList, setShowList] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");

  const getSearchedProducts = async () => {
    if (searchProduct.length > 0) {
      dispatch(getProductListStart());

      try {
        console.log({ searchProduct })
        const { data } = await axios.get(
          `/api/product/all/?keyword=${searchProduct}`
        );

        // console.log(data?.products);

        dispatch(getProductListSuccess(data?.products));
        // dispatch({ type: "FETCH_SUCCESS", payload: data?.products });
      } catch (error) {
        // console.log(error?.response?.data?.error?.message);
        dispatch(getProductListFailure(error?.response?.data?.error?.message));
        // dispatch({
        //   type: "FETCH_FAIL",
        //   payload: error?.response?.data?.error?.message,
        // });
      }
    }
  };

  const handleProductSearch = () => {
    navigate('/home/products/?category=');
    getSearchedProducts();
  }

  const getCategory = async () => {
    // dispatch({ type: "FETCH_REQUEST" });
    dispatch(getProductListStart());
    try {
      console.log({ queryCategory, type: typeof queryCategory })
      const url = `/api/category/${queryCategory ? queryCategory : 'null' }/products`;
      console.log({ url })
      const { data } = await axios.get(url);

      console.log({ data })
      dispatch(getProductListSuccess(data?.products));
      // dispatch({ type: "FETCH_SUCCESS", payload: data?.products });
    } catch (error) {
      dispatch(getProductListFailure(error?.response?.data?.error?.message));
      // dispatch({
      //   type: "FETCH_FAIL",
      //   payload: error?.response?.data?.error?.message,
      // });
    }
  };

  const { data: categoryData, isLoading: shopDetailsLoading } = useGetAllCategoriesQuery();
  console.log({ categoryData })

  useEffect(() => {
    if (!token && !ageCheck) {
      setModal(true);
    }
  }, [token, ageCheck]);

  useEffect(() => {
    window.scrollTo(0, 0);

    getCategory();

    setWidth(window.innerWidth);
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [params?.id, categoryData, queryCategory]);

  console.log({ categoryData })
  return (
    <>
      {!shopDetailsLoading && !loading && (
        <ReactBreadcrumb path={`Home / Products`} />
      )}
      {/* {(ageCheck || token) && ( */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container>
          <div className="shop-sec-1">
            <div className="filter-results">
              <div className="filters-txt">
                <p>Filters</p>
              </div>

              <ReactPlaceholder
                type="text"
                color="#efefef"
                showLoadingAnimation
                rows={1}
                style={{ width: "60%" }}
                ready={!shopDetailsLoading && !loading}
              >
                <>
                  <p className="m-0 result-length">
                    {productsCount > 0 &&
                      `Showing 1-${productsCount} of ${productsCount} results`}
                  </p>
                </>
              </ReactPlaceholder>
            </div>
            <div className="search-form">
              <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="search-box"
                    aria-label="Search"
                    onChange={(e) => setSearchProduct(e.target.value)}
                    value={searchProduct}
                  />
                  <InputGroup.Text
                    onClick={handleProductSearch}
                    className="search-icon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </InputGroup.Text>
                </InputGroup>
              </Form>
            </div>
          </div>
          <div className="divider"></div>
          <div className="categories-txt">
            <p>
              {width > 991 ? (
                "Categories"
              ) : (
                <div className="toggle-category">
                  <p>Categories</p>
                  {width < 991 && (
                    <p
                      className="drop-arrow"
                      onClick={() => setShowList(!showList)}
                    >
                      {showList ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="category-down"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="category-down"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      )}
                    </p>
                  )}
                </div>
              )}
            </p>
          </div>
          <Row>
            {width < 991 ? (
              showList && (
                <SideCate
                  shopDetailsLoading={shopDetailsLoading}
                  categories={categoryData?.categories}
                  setSearchProduct={setSearchProduct}
                  setShowList={setShowList}
                  showList={showList}
                />
              )
            ) : (
              <SideCate
                shopDetailsLoading={shopDetailsLoading}
                categories={categoryData?.categories}
                setSearchProduct={setSearchProduct}
                setShowList={setShowList}
                showList={showList}
              />
            )}
            <Col>
              <Row>
                <ReactPlaceholder
                  type="media"
                  color="#F0F0F0"
                  showLoadingAnimation
                  rows={7}
                  delay={200}
                  ready={!loading && !shopDetailsLoading}
                >
                  {error ? (
                    <AlertBox
                      type={"danger"}
                      heading={"Requested product not found!"}
                      desc={"This product no longer exists."}
                    />
                  ) : (
                    <>
                      {console.log({ products })}
                      {products?.length > 0
                        ? products?.map(
                          (item) => (
                            // item?.subProducts?.map((subItem) => (
                            <Product
                              key={item._id}
                              item={item}
                              // subItem={subItem}
                              loading={loading}
                            />
                          )
                          // ))
                        )
                        : (searchProduct?.length > 0 ||
                          products?.length === 0) && (
                          <AlertBox
                            type={"danger"}
                            heading={"Oh snap! Products not found."}
                            desc={"Products will be added soon!"}
                          />
                        )}
                    </>
                  )}
                </ReactPlaceholder>
              </Row>
            </Col>
          </Row>
        </Container >
      </motion.div >
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
            // dispatch({ type: "AGECHECK_SUCCESS", payload: true });
            setModal(!modal);
          }}
        />
      )} */}
    </>
  );
};

export default Shop;

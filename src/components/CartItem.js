import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CardImg from "./card/CardImg";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";


import { deleteCart, updateCart } from "../features/apiCall";
import { useGetCategoryQuery } from "../features/productsApi";
import { useNavigate } from "react-router-dom";

const CartItem = ({ cartItem }) => {
  console.log({ cartItem });
  const { isFetching, inSalePrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [count, setCount] = useState(cartItem?.quantity);
  const [category, setCategory] = useState();
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery(cartItem?.product?.pid?.category);

  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData?.category);
    }
  }, [categoryData]);

  const prodId = cartItem?.product?._id;

  const handleCount = (change) => {
    if (change === "dec") {
      if (count === 1) {
        setCount(count);
        deleteCart(dispatch, { prodId });
        toast.error("Product deleted!", toastOptions);
      } else {
        setCount(count - 1);
      }
    }

    if (change === "inc") {
      setCount(count + 1);
    }
  };

  useEffect(() => {
    if (count !== cartItem?.quantity) {
      // toast.success("Product updated!", toastOptions);
      updateCart(dispatch, { prodId, count });
    }
  }, [count, cartItem?.quantity, prodId, dispatch]);

  const handleDelete = () => {
    deleteCart(dispatch, { prodId });
    toast.error("Product deleted!", toastOptions);
  };

  return (
    <>
      <div className="cart-item">
        <Row>
          <Col sm={4}>
            <div>
              <img
                src={cartItem?.product?.pid?.product_img}
                // src={cartItem?.product?.pid?.product_images[0]}
                alt="productImage"
                className="img-fluid"
              />
            </div>
          </Col>
          <Col sm={4} className="f-center flex-column">
            {isFetching ? (
              <div className="overlay-cart">
                <h6>
                  {cartItem?.product?.pid?.name}
                </h6>
                <p className="mt-2">{category?.name}</p>
              </div>
            ) : (
              <div>
                <h6 onClick={() => navigate(`/home/product/${cartItem?.product?.pid?._id}?subId=${cartItem?.product?._id}`)}
                >
                  {cartItem?.product?.pid?.name}
                </h6>
                <p
                  className="mt-2"
                  onClick={() => navigate(`/shop/${cartItem?.product?.pid?.category}`)}
                >
                  {category?.name}
                </p>
              </div>
            )}
          </Col>
          <Col sm={4} className="f-center flex-column position-relative">
            <IoMdClose className="close-btn" onClick={() => handleDelete()} />
            <div className="btn-box">
              <div className="prod-btn-box-1">
                {isFetching ? (
                  <div
                    style={{
                      opacity: 0.5,
                    }}
                  >
                    -
                  </div>
                ) : (
                  <div onClick={() => handleCount("dec")}>-</div>
                )}
                <span>{count}</span>
                {isFetching ? (
                  <div
                    style={{
                      opacity: 0.5,
                    }}
                  >
                    +
                  </div>
                ) : (
                  <div onClick={() => handleCount("inc")}>+</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div >
      <ToastContainer />
    </>
  );
};

export default CartItem;

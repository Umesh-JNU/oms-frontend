import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CardImg from "./card/CardImg";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { deleteCart, updateCart } from "../features/apiCall";
import { useGetCategoryQuery } from "../features/productsApi";
import { useNavigate } from "react-router-dom";

const CartItem = ({ cartItem }) => {
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
          <Col>
            <img
              src={cartItem?.product?.pid?.product_images[0]}
              alt="productImage"
              className="cart-item-img"
            />
            {/* <CardImg imgPath={cartItem?.product?.product_images[0]} /> */}
          </Col>
          <Col>
            {isFetching ? (
              <div className="overlay-cart">
                <p
                  className="cart-prod-name"
                  // onClick={() => navigate(`/home/${cartItem?.product?._id}`)}
                >
                  {cartItem?.product?.pid?.name}
                </p>
                <p
                  className="cart-prod-cate"
                  // onClick={() =>
                  //   navigate(`/shop/${cartItem?.product?.category}`)
                  // }
                >
                  {category?.name}
                </p>
                <div className="cart-prod-subProd">
                  <div>
                    {inSalePrice?.filter(
                      (inSale) => inSale?.id === cartItem?.product?._id
                    )?.length > 0 ? (
                      <div className="cart-prod-sale">
                        <p className="cart-prod-price-old">
                          $ {cartItem?.product?.amount?.toFixed(2)}
                        </p>

                        {inSalePrice
                          ?.filter(
                            (inSale) => inSale?.id === cartItem?.product?._id
                          )
                          ?.map((sale) => (
                            <p className="cart-prod-updated-price">
                              $ {sale?.updatedAmount?.toFixed(2)}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <div>
                        <p className="cart-prod-price">
                          $ {cartItem?.product?.amount?.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="cart-prod-qname">{cartItem?.product?.qname}</p>
                </div>
              </div>
            ) : (
              <>
                <p
                  className="cart-prod-name"
                  onClick={() =>
                    navigate(
                      `/home/${cartItem?.product?.pid?._id}?subId=${cartItem?.product?._id}`
                    )
                  }
                >
                  {cartItem?.product?.pid?.name}
                </p>
                <p
                  className="cart-prod-cate"
                  onClick={() =>
                    navigate(`/shop/${cartItem?.product?.pid?.category}`)
                  }
                >
                  {category?.name}
                </p>
                <div className="cart-prod-subProd">
                  <div>
                    {inSalePrice?.filter(
                      (inSale) => inSale?.id === cartItem?.product?._id
                    )?.length > 0 ? (
                      <div className="cart-prod-sale">
                        <p className="cart-prod-price-old">
                          $ {cartItem?.product?.amount?.toFixed(2)}
                        </p>

                        {inSalePrice
                          ?.filter(
                            (inSale) => inSale?.id === cartItem?.product?._id
                          )
                          ?.map((sale) => (
                            <p className="cart-prod-updated-price">
                              $ {sale?.updatedAmount?.toFixed(2)}
                            </p>
                          ))}
                      </div>
                    ) : (
                      <div>
                        <p className="cart-prod-price">
                          $ {cartItem?.product?.amount?.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="cart-prod-qname">{cartItem?.product?.qname}</p>
                </div>
              </>
            )}
          </Col>
          <Col>
            <div className="btn-box">
              <IoMdClose className="close-btn" onClick={() => handleDelete()} />
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
      </div>
      <ToastContainer />
    </>
  );
};

export default CartItem;

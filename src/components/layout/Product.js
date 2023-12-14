import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardTop from "../card/CardTop";
import ReactPlaceholder from "react-placeholder";
import { ToastContainer, toast } from "react-toastify";
import { addCart, getCart } from "../../features/apiCall";
import { useDispatch } from "react-redux";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

const Product = ({ item, loading }) => {
  console.log({ item, loading })
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [subId, setSubId] = useState();
  const [count, setCount] = useState(1);
  const [stock, setStock] = useState();

  useEffect(() => {
    if (item && item.subProducts) {
      setSubId(item.subProducts[0]._id);
      setStock(item.subProducts[0].stock);
    }
  }, []);

  console.log({ subId, stock });
  const [selectedQty, setSelectedQty] = useState();

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

    toast.success("Item added to cart", toastOptions);
    setCount(1);
  };

  return (
    <Col md={4} sm={6} key={item?._id}>
      <ReactPlaceholder
        type="media"
        color="#F0F0F0"
        showLoadingAnimation
        rows={5}
        ready={!loading}
        key={item?._id}
      >
        <div className="products-container" onClick={() =>
          navigate(`/home/product/${item?._id}/?subId=${item?.subProducts[0]?._id}`)}>
          <CardTop sale={item?.sale} path={item?.product_img} />
          <div className="product-detail px-2">
            <div className="prods-sub-details">
              <p className="mb-0" style={{ fontWeight: 600 }}>
                {item?.name}
              </p>
              <p
                className="mb-0"
                style={{
                  paddingLeft: "0.5rem",
                }}
              >
                {item?.subProducts[0]?.qname}
                {/* {subItem?.qname} */}
              </p>
            </div>
            <p className="product-desc">
              {item?.description?.slice(0, 80)}...
            </p>
          </div>
        </div>
        <div className="add-cart-box">
          <Row>
            <Col sm={6}>
              <Form.Select
                aria-label="Default select example"
                onChange={(e) => {
                  const val = JSON.parse(e.target.value);
                  console.log(e.target.value, e.currentTarget, "change", val)
                  setSubId(val?._id);
                  setStock(val?.stock);
                  setCount(1);
                }}
              >
                {item?.subProducts?.map((subItem) => (
                  <option value={JSON.stringify(subItem)} key={subItem?._id}>
                    {subItem?.quantity} {item?.category?.location === 'CA' ? 'ml' : 'fl. Oz.'}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={6}>
              <div className="f-center prod-btn-box-1">
                <div onClick={() => handleCount("dec")}>-</div>
                <span>{count}</span>
                <div onClick={() => handleCount("inc")}>+</div>
              </div>
            </Col>
            <Col>
              <Button variant="dark" className="cart-btn" onClick={() => handleCart(item, count, item?.amount)} disabled={!stock}>
                {/* {stock ? 'Add to cart' : 'Out of Stock'} */}
                Add to cart
              </Button>
            </Col>
          </Row>
        </div>
      </ReactPlaceholder>
      <ToastContainer />
    </Col >
  );
};

export default Product;

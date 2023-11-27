import React from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardTop from "../card/CardTop";
import ReactPlaceholder from "react-placeholder";


const Product = ({ item, subItem, loading }) => {
  const navigate = useNavigate();

  return (
    <Col md={4} sm={6} key={item?._id}>
      <div
        className="products-container"
        onClick={() =>
          navigate(`/home/product/${item?._id}/?subId=${item?.subProducts[0]?._id}`)
        }
        // onClick={() => navigate(`/home/${item?._id}?subId=${subItem?._id}`)}
      >
        <ReactPlaceholder
          type="media"
          color="#F0F0F0"
          showLoadingAnimation
          rows={5}
          ready={!loading}
          key={item?._id}
        >
          {/* <CardTop sale={item?.sale} path={item?.product_images[0]} /> */}
          <CardTop sale={item?.sale} path={item?.product_img} />
          <div className="product-detail">
            <div className="prods-sub-details">
              <p className="mb-0" style={{ fontWeight: 600 }}>
                {item?.name},
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
            <p className="mb-0" style={{ color: "#8c8b8b" }}>
              {item?.description?.slice(0, 80)}...
            </p>
            <div className="">
              {item?.sale > 0 ? (
                <div className="sale-prod">
                  <p className="sale-old-amount">
                    $ {item?.subProducts[0]?.amount?.toFixed(2)}
                    {/* $ {subItem?.amount?.toFixed(2)} */}
                  </p>

                  <div className="sale-updated-amount">
                    <p>$ {item?.subProducts[0]?.updatedAmount?.toFixed(2)}</p>
                    {/* <p>$ {subItem?.updatedAmount?.toFixed(2)}</p> */}
                  </div>
                </div>
              ) : (
                <p className="">$ {item?.subProducts[0]?.amount?.toFixed(2)}</p>
                // <p className="">$ {subItem?.amount?.toFixed(2)}</p>
              )}
            </div>
            {/* ))} */}
          </div>
        </ReactPlaceholder>
      </div>
    </Col>
  );
};

export default Product;

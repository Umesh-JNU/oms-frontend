import React, { useEffect } from "react";
import ReactPlaceholder from "react-placeholder";

import { Slide } from "react-slideshow-image";
import {
  relatedProdsFailure,
  relatedProdsStart,
  relatedProdsSuccess,
} from "../../features/relatedProdSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import CardTop from "../card/CardTop";

// this component can be used to render the product related products using the category id

const responsiveSettings = [
  {
    breakpoint: 3000,
    settings: {
      slidesToShow: 5,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 1000,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 800,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 500,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 400,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 300,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: 200,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
];

const RelatedProds = ({ categoryLoading, subCategoryLoading, categoryId }) => {
  const dispatch = useDispatch();
  const { relatedProducts, loadingRelatedProds } = useSelector(
    (state) => state.relatedPrds
  );
  const navigate = useNavigate();

  useEffect(() => {
    const getRelatedProds = async () => {
      dispatch(relatedProdsStart());
      try {
        const { data } = await axios.get(
          `/api/category/${categoryId}/products`
        );
        dispatch(relatedProdsSuccess(data?.products));
      } catch (error) {
        dispatch(relatedProdsFailure(error?.response?.data?.error?.message));
      }
    };

    getRelatedProds();
  }, [categoryId]);

  return (
    relatedProducts?.length !== 0 && (
      <ReactPlaceholder
        type="text"
        color="#F0F0F0"
        showLoadingAnimation
        rows={7}
        ready={!loadingRelatedProds && !categoryLoading && !subCategoryLoading}
      >
        <div className="related-products">
          <h4 style={{ paddingLeft: "2rem" }} className="related-products-txt">
            Customers who viewed this item also viewed
          </h4>

          <div style={{ padding: "2rem" }}>
            <div>
              <Slide
                indicators={true}
                autoplay={false}
                infinite={false}
                prevArrow={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="left-arrow"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                    />
                  </svg>
                }
                nextArrow={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="right-arrow"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                }
                responsive={responsiveSettings}
              >
                {relatedProducts?.map(
                  (related) => (
                    // related?.subProducts?.map((subRelated) => (
                    <div
                      className="related-product"
                      key={related?._id}
                      onClick={() => {
                        navigate(
                          `/home/${related?._id}?subId=${related?.subProducts[0]?._id}`
                        );
                        window.scrollTo(0, 0);
                      }}
                    >
                      <>
                        <>
                          <div>
                            <div className="related-products-img">
                              <CardTop
                                sale={related?.sale}
                                path={related?.product_images[0]}
                              />
                            </div>
                            <div className="">
                              <div className="relatedprods-sub-details">
                                <p className="mb-0" style={{ fontWeight: 600 }}>
                                  {related?.name},{" "}
                                  <span className="mb-0">
                                    {related?.subProducts[0]?.qname}
                                  </span>
                                </p>
                              </div>
                              <p className="mb-0" style={{ width: "80%" }}>
                                {`${related?.description?.slice(0, 33)}...`}
                              </p>
                              {related?.sale > 0 ? (
                                <div className="sale-prod">
                                  <p className="sale-old-amount">
                                    ${" "}
                                    {related?.subProducts[0]?.amount?.toFixed(
                                      2
                                    )}
                                  </p>

                                  <div className="sale-updated-amount">
                                    <p>
                                      ${" "}
                                      {related?.subProducts[0]?.updatedAmount?.toFixed(
                                        2
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <p className="">
                                  ${" "}
                                  {related?.subProducts[0]?.amount?.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                      </>
                    </div>
                  )
                  // ))
                )}
              </Slide>
            </div>
          </div>
        </div>
      </ReactPlaceholder>
    )
  );
};

export default RelatedProds;

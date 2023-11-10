import React, { useState } from "react";
import { Button, Row, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Rating } from "react-simple-star-rating";

const ProductDetailsTabs = ({ loadingProduct, product }) => {
  const { loadingReview, reviews } = useSelector((state) => state.review);
  const [isCopied, setIsCopied] = useState(false);

  const toastOptions = {
    position: "bottom-center",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleCopyClick = async () => {
    try {
      await copyTextToClipboard(window.location.href);

      toast.success("Copied to clipboard", toastOptions);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Row className="py-5">
      <Tabs
        defaultActiveKey="description"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="description" title="Description">
          <ReactPlaceholder
            type="text"
            color="#F0F0F0"
            showLoadingAnimation
            rows={7}
            ready={!loadingProduct}
          >
            <p className="tab-desc">{product?.description}</p>
          </ReactPlaceholder>
        </Tab>
        <Tab
          eventKey="reviews"
          title={`Reviews (${reviews?.length})`}
          // onEnter={() => getReviews()}
        >
          <div className="review-tab">
            <div className="review-heading">
              <h3>Top reviews</h3>
            </div>
            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={5}
              ready={!loadingReview}
            >
              <div className="review-data">
                {reviews?.length > 0 ? (
                  reviews?.map((review, i) => (
                    <div key={review?.id}>
                      <div className="review-data-container">
                        <p className="review-name">
                          {review?.user?.firstname +
                            " " +
                            review?.user?.lastname}
                        </p>
                        <span>
                          <Rating
                            className="star"
                            initialValue={review?.rating}
                            size={16}
                            readonly={true}
                            allowHover={false}
                            allowFraction={true}
                          />
                          {/* <b className="review-title">{review?.title}</b> */}
                        </span>

                        <p className="review-date">
                          Reviewed on{" "}
                          {moment(review?.createdAt)
                            .utc()
                            .format("MMMM DD, YYYY")}
                        </p>

                        <p className="review-desc">{review?.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>
                      <i>No reviews added!</i>
                    </p>
                  </div>
                )}
              </div>
            </ReactPlaceholder>
          </div>
        </Tab>

        <Tab eventKey="share" title="Share this product">
          <Button variant="dark" onClick={() => handleCopyClick()}>
            {isCopied ? (
              "Copied!"
            ) : (
              <>
                <p>
                  Share{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>
                </p>
              </>
            )}
          </Button>
        </Tab>
      </Tabs>
    </Row>
  );
};

export default ProductDetailsTabs;

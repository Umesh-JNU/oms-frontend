import React from "react";
import { Card } from "react-bootstrap";

const CardImg = ({ imgPath }) => {
  // console.log(props)
  return (
    // <div style={{ width: "" }}>
    <div className="category-img-box">
      <Card.Img variant="top" src={imgPath} className="img-fluid card-img" />
      {/* <Card.Img variant="top" src={`/images/${imgPath}`} className="img-fluid" /> */}
      <div className="overlay"></div>
      {/* </div> */}
    </div>
  );
};

export default CardImg;

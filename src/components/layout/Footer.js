import { Col, Row } from "react-bootstrap";
import { AiOutlineInstagram } from "react-icons/ai";
import { RiSnapchatFill } from "react-icons/ri";
// import app_logo_black from "./app_logo_black.png";
// import app_logo_white from "./app_logo_white.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const path = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {path.pathname === "/" ? (
        <footer
          className=""
          style={{
            width: "100%",
            position: "static",
            bottom: "0px",
            backgroundColor: "#000",
          }}
        >
          <div className="footer-div-home">
            <img
              alt=""
              // src={app_logo_white}
              src="/logo/logo.jpg"
              width="90"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />

            <div>
              <p>
                "So by now, your probably wondering, what’s the difference
                between an online and a physical dispensary? Well, allow us take
                you on a tour of our online dispensary to see for yourself."
              </p>

              {/* <div className="footer-divider"></div> */}
              <hr className="footer-divider-home" />
              <div className="rights-footer-home">
                <p>@ 2023 OMS. all rights reserved</p>
              </div>
            </div>
          </div>
        </footer>
      ) : (
        <footer
          className=""
          style={{
            width: "100%",
            position: "static",
            bottom: "0px",
            backgroundColor: "#EFEFEF",
            marginTop: "6rem",
          }}
        >
          <div className="footer-div">
            <>
              <img
                alt=""
                src="/logo/logo.jpg"
                // src={app_logo_black}
                width="90"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
                // height="30"
                // className="d-inline-block align-top app-logo"
              />
            </>
            <Row className="justify-content-between">
              <Col md={4} lg={"auto"}>
                <div className="footer-icons">
                  <div className="icons">
                    {/* <Link to=''> */}
                    <p>
                      <AiOutlineInstagram />
                    </p>
                    {/* </Link> */}

                    {/* <Link to="/"> */}
                    <p>
                      <RiSnapchatFill />
                    </p>
                    {/* </Link> */}
                  </div>

                  {/* <div className="address">
                    <p className="address-txt">
                      <b>Address</b>{" "}
                      <div className="options-txt">
                        <p>+123 654 987 877 The Bronx, NY 14568, USA</p>
                      </div>
                    </p>
                  </div> */}
                </div>
              </Col>
              {/* <Col xs={1} className="footer-info"> */}
              <Col md={4} lg={4}>
                <div>
                  <p className="heading-txt">My account</p>

                  <div className="options-txt">
                    <Link to="home/sign-in">
                      <p>Sign in</p>
                    </Link>
                    <Link to="home/my-orders">
                      <p>My Order</p>
                    </Link>
                  </div>
                </div>
              </Col>
              <Col md={4} lg={4}>
                <div>
                  <p className="heading-txt">Help</p>

                  <div className="options-txt">
                    {/* <Link to="/home/how-to" style={{ textDecoration: "none" }}>
                      <p>How to</p>
                    </Link> */}
                    <Link to="/home/faq">
                      <p>FAQ</p>
                    </Link>
                    {/* <Link to="home/my-orders">
                      <p>Shipping</p>
                    </Link> */}
                  </div>
                </div>
              </Col>
              {/* <Col md={2} lg={2}>
                <div>
                  <p className="heading-txt">Shop</p>

                  <div className="options-txt">
                    <Link to="shop/6409f7606a7a170020c25018">
                      <p>All products</p>
                    </Link>

                    <Link to="home/my-account#refer">
                      <p>Refer a friend</p>
                    </Link>

                  </div>
                </div>
              </Col> */}

              {/* </Col> */}
            </Row>
            <div>
              {/* <div className="footer-divider"></div> */}
              <Row>
                <div className="rights-footer">
                  <center>
                    <p>@ 2023 OMS. all rights reserved</p>
                  </center>
                </div>
              </Row>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;

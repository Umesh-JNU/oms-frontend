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
              src="/logo/logo-light.png"
              width="200"
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
            padding: "2rem 0 1rem 0", 
            width: "100%",
            position: "static",
            bottom: "0px",
            backgroundColor: "#EFEFEF",
            marginTop: "6rem",
          }}
        >
          <div className="footer-div">
            <Row className="justify-content-between">
              <Col md={4} lg={"auto"}>
                <img
                  alt=""
                  src="/logo/logo-dark.png"
                  // src={app_logo_black}
                  width="200"
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                // height="30"
                // className="d-inline-block align-top app-logo"
                />
              </Col>
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
                    <Link to="/home/faq">
                      <p>FAQ</p>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
            <div>
              <Row>
                <div className="rights-footer">
                  <center>
                    <p>@ 2023 OMS. all rights reserved</p>
                  </center>
                </div>
              </Row>
            </div>
          </div>
        </footer >
      )}
    </>
  );
};

export default Footer;

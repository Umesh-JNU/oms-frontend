import React from "react";
import { motion } from "framer-motion";
import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const NotFound = () => {
  return (
    <>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.75, ease: "easeInOut" }}
      >
        <Container>
          <div className="not-found-cont">
            <div className="not-found-text1">
              <h1>Oops!</h1>
            </div>

            <div className="not-found-text2">
              <p>404</p>
            </div>

            <div className="not-found-text3">
              <p>Sorry, an error has occured, Requested page not found!</p>
            </div>

            <div className="go-to-btn">
              <Link role="button" className="nav-link" tabIndex="0" to={"/"}>
                <Button variant="dark">
                  <div className="not-found-text4">
                    <AiOutlineHome />
                    <p>Home</p>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </motion.div>
    </>
  );
};

export default NotFound;

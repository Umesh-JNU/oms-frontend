import { Container } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import ReactPlaceholder from "react-placeholder";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { faqFailure, faqStart, faqSuccess } from "../features/faqSlice";
import { ageCheckSuccess } from "../features/ageCheckSlice";
import ModalLayout from "./layout/ModalLayout";
import { useNavigate } from "react-router-dom";
import AlertBox from "./layout/AlertBox";

function FaqPage() {
  const { token } = useSelector((state) => state.auth);
  const { ageCheck } = useSelector((state) => state.ageCheck);
  const { faq, loading, error } = useSelector((state) => state.faq);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchFaq = async () => {
    dispatch(faqStart());
    try {
      const { data } = await axios.get("/api/faq/all", {
        headers: { Authorization: token },
      });

      dispatch(faqSuccess(data?.faqs));
    } catch (error) {
      // console.log(error?.response?.data?.error?.message);
      dispatch(faqFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    if (!token && !ageCheck) {
      setModal(true);
    }
  }, [token, ageCheck]);

  useEffect(() => {
    window.scroll(0, 0);

    fetchFaq();
  }, []);

  console.log(Object.entries(faq)?.forEach(([key, value]) => key));
  // Object.entries(faq)?.forEach(([key, value]) => {
  //   // console.log(key, value);
  //   value
  //     ?.filter((faq) => faq?.type === key)
  //     ?.map((faq) => console.log(faq?.type));
  // });

  return (
    <>
      {(ageCheck || token) && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <Container className="pt-5 px-3 px-md-0">
            <h3 className="mb-3">
              Have Questions? Check Out This Section Before Contacting Us
            </h3>
            <h4 className="mb-4 fade-color">
              Here are some of the top questions
            </h4>

            <ReactPlaceholder
              type="text"
              color="#F0F0F0"
              showLoadingAnimation
              rows={7}
              ready={!loading}
            >
              {error ? (
                <AlertBox
                  heading={"Please wait while we add FAQ's for you!"}
                  desc={
                    "Sorry for the delay we are constantly working on this!"
                  }
                  type={"dark"}
                />
              ) : (
                <>
                  {/* <h5
                    className="my-4 fade-color"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {Object.entries(faq)?.forEach(([key, value]) => key)}
                  </h5> */}
                  {Object.entries(faq)?.map((faq) =>
                    faq[1]?.map((faq) => (
                      <>
                        <h5
                          className="my-4 fade-color"
                          style={{
                            textTransform: "capitalize",
                          }}
                        >
                          {faq?.type}
                        </h5>
                        <Accordion flush>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <span
                                style={{
                                  textTransform: "capitalize",
                                }}
                              >
                                {faq?.question}
                              </span>
                            </Accordion.Header>
                            <Accordion.Body>{faq?.answer}</Accordion.Body>
                          </Accordion.Item>
                          {/* <Accordion.Item eventKey="1">
                          <Accordion.Header>{faq?.question}</Accordion.Header>
                          <Accordion.Body>{faq?.answer}</Accordion.Body>
                        </Accordion.Item> */}
                        </Accordion>
                      </>
                    ))
                  )}
                </>
              )}
            </ReactPlaceholder>
          </Container>
        </motion.div>
      )}

      {modal && (
        <ModalLayout
          status={"ageCheck"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={() => {
            dispatch(ageCheckSuccess(false));
            navigate("/restricted");
          }}
          handleCloseAge={() => {
            dispatch(ageCheckSuccess(true));
            setModal(!modal);
          }}
        />
      )}
    </>
  );
}

export default FaqPage;

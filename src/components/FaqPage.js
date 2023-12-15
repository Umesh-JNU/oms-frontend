import { Container } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import ReactPlaceholder from "react-placeholder";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "../utils/axios";
import AlertBox from "./layout/AlertBox";
import ModalLayout from "./layout/ModalLayout";

import { locationSuccess } from "../features/locationSlice";
import { faqFailure, faqStart, faqSuccess } from "../features/faqSlice";

function FaqPage() {
  const { token } = useSelector((state) => state.auth);
  const { location } = useSelector((state) => state.location);
  const { faq, loading, error } = useSelector((state) => state.faq);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  const fetchFaq = async () => {
    dispatch(faqStart());
    try {
      const { data } = await axios.get("/api/faq/all", {
        headers: { Authorization: token },
      });

      console.log("GETTING FAQ", { data })
      dispatch(faqSuccess(data?.faqs));
    } catch (error) {
      dispatch(faqFailure(error?.response?.data?.error?.message));
    }
  };

  useEffect(() => {
    if (!token && !location) {
      setModal(true);
    }
  }, [token, location]);

  useEffect(() => {
    window.scroll(0, 0);

    fetchFaq();
  }, []);

  return (
    <>
      {(location || token) && (
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
                <Accordion flush>
                  {faq?.map(({ _id, question, answer }) => (
                    <Accordion.Item key={_id} eventKey={_id}>
                      <Accordion.Header>
                        <span style={{ textTransform: "capitalize" }}>
                          {question}
                        </span>
                      </Accordion.Header>

                      <Accordion.Body style={{ backgroundColor: 'aliceblue' }}>
                        {answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </ReactPlaceholder>
          </Container>
        </motion.div >
      )}

      {modal && !location && (
        <ModalLayout
          title={"Your Country"}
          status={"location"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={(loc) => {
            dispatch(locationSuccess(loc));
            setModal(!modal);
          }}
        />
      )}
    </>
  );
}

export default FaqPage;

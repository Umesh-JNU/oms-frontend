import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ageCheckSuccess } from "../../features/ageCheckSlice";
import ModalLayout from "./ModalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotAllowed = () => {
  const { ageCheck } = useSelector((state) => state.ageCheck);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <div className="not-allowed-container">
        <div className="not-allowed-div">
          <div className="not-allowed-heading">
            <div>
              <p>Access denied</p>
            </div>
            <div className="err-code">
              <span>Error code 403</span>
            </div>
          </div>

          <div className="not-allowed-body">
            <div>You do not have access to this website.</div>
            <div>
              The site owner may have set restrictions that prevent you from
              accessing the site.
            </div>
          </div>
          {(!ageCheck || ageCheck === null) && (
            <div className="hard-reload-btn">
              <Button
                variant="dark"
                onClick={() => {
                  // window.location.reload();
                  setModal(true);
                }}
              >
                Confirm your age!
              </Button>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ModalLayout
          status={"ageCheck"}
          backdrop={"static"}
          show={modal}
          scrollable={"false"}
          handleClose={() => {
            dispatch(ageCheckSuccess(false));
            navigate("/restricted");
            setModal(false);
          }}
          handleCloseAge={() => {
            dispatch(ageCheckSuccess(true));
            setModal(!modal);
            navigate("/");
          }}
        />
      )}
    </>
  );
};

export default NotAllowed;

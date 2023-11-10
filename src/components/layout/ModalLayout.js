import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";

const ModalLayout = ({
  status,
  show,
  handleAddAddress,
  handleClose,
  handleAddAdressChange,
  handleAddAddressCheck,
  addAddressValues,
  loading,
  handleAddressChange,
  handleCheckChange,
  handleEditModal,
  values,
  addresses,
  address,
  handleDelete,
  backdrop,
  scrollable,
  handleCloseAge,
}) => {
  // in this modal based on status you decide you can render this modal
  // you can even customize this modal based on your status that you choose like the one's I have used below

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={backdrop}
      scrollable={scrollable}
    >
      <Modal.Header closeButton>
        {status === "add" && <Modal.Title>Add your new address</Modal.Title>}
        {status === "edit" && <Modal.Title>Edit your address</Modal.Title>}
        {status === "delete" && (
          <Modal.Title>Are you sure you want to delete?</Modal.Title>
        )}
        {status === "ageCheck" && <Modal.Title>Confirm your age</Modal.Title>}
      </Modal.Header>
      <Modal.Body>
        {status === "add" && (
          <Form onSubmit={handleAddAddress}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                placeholder="street"
                required
                name="street"
                onChange={handleAddAdressChange}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                placeholder="unit"
                required
                name="unit"
                onChange={handleAddAdressChange}
              />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>City/Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="city/town"
                required
                name="town"
                onChange={handleAddAdressChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Province</Form.Label>
              <Form.Control
                type="text"
                placeholder="province"
                required
                name="province"
                onChange={handleAddAdressChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="postcode"
                required
                name="post_code"
                onChange={handleAddAdressChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Mark as default"
                defaultChecked={addAddressValues?.defaultAddress}
                name="defaultAddress"
                onChange={handleAddAddressCheck}
              />
            </Form.Group>
            {loading ? (
              <Button variant="dark" size="sm" disabled>
                <Spinner animation="border" variant="light" />
              </Button>
            ) : (
              <Button type="submit" variant="dark">
                Add Address
              </Button>
            )}
          </Form>
        )}

        {status === "edit" && (
          <Form onSubmit={handleEditModal}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                placeholder="street"
                required
                name="street"
                onChange={handleAddressChange}
                value={values?.street}
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                placeholder="unit"
                required
                name="unit"
                onChange={handleAddressChange}
                value={values?.unit}
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>City/Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="city/town"
                required
                name="town"
                onChange={handleAddressChange}
                value={values?.town}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Province</Form.Label>
              <Form.Control
                type="text"
                placeholder="province"
                required
                name="province"
                onChange={handleAddressChange}
                value={values?.province}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="postcode"
                required
                name="post_code"
                onChange={handleAddressChange}
                value={values?.post_code}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              {addresses?.length === 1 ? (
                <Form.Check
                  type="checkbox"
                  disabled
                  label="Mark as default"
                  name="defaultAddress"
                  defaultChecked={address?.defaultAddress}
                  // defaultChecked={values?.defaultAddress}
                  onChange={handleCheckChange}
                />
              ) : (
                <Form.Check
                  type="checkbox"
                  label="Mark as default"
                  name="defaultAddress"
                  defaultChecked={address?.defaultAddress}
                  // defaultChecked={values?.defaultAddress}
                  onChange={handleCheckChange}
                />
              )}
            </Form.Group>
            <Button variant="dark" type="submit">
              Save Changes
            </Button>
          </Form>
        )}

        {status === "delete" && "You can delete your address here!"}

        {status === "ageCheck" && (
          <div>
            <p>Please confirm you are 19+ years old to continue.</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {status !== "ageCheck" && (
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        )}

        {status === "ageCheck" && (
          <>
            <Button variant="danger" onClick={handleClose}>
              No
            </Button>

            <Button variant="primary" onClick={handleCloseAge}>
              Yes
            </Button>
          </>
        )}

        {status === "delete" && (
          <Button variant="danger" onClick={() => handleDelete()}>
            Delete
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLayout;

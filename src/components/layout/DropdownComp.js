import React, { useEffect, useState } from "react";
import { NavDropdown, Row, Col } from "react-bootstrap";
import ReactPlaceholder from "react-placeholder";

import {
  useGetAllCategoriesQuery,
  useGetAllSubCategoriesQuery,
} from "../../features/productsApi";
import { useNavigate } from "react-router-dom";
import useGeoLocation from "react-ipgeolocation";

const DropdownComp = ({ width }) => {
  const location = useGeoLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const { data: categoryData, isLoading: categoryLoading } = useGetAllCategoriesQuery(location);

  const { data: subCategoryData, isLoading: subCategoryLoading } =
    useGetAllSubCategoriesQuery();

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData?.categories);
    }

    if (subCategoryData) {
      setSubCategories(subCategoryData?.subCategories);
    }
  }, [categoryData, subCategoryData]);

  return (
    <Row style={{ borderRadius: "1rem" }}>
      <ReactPlaceholder
        type="text"
        color="#F0F0F0"
        showLoadingAnimation
        rows={3}
        style={{ width: "60%" }}
        ready={!categoryLoading || !subCategoryLoading}
      >
        <div className={`${width ? "small-dropdown" : "dropdown-div"} `}>
          {categories?.map((catitem) => (
            <>
              <Col key={catitem?._id}>
                <div>
                  <NavDropdown.Item
                    key={Math.random()}
                    onClick={() => navigate(`/shop/${catitem?._id}`)}
                    className="dropdown-box"
                  >
                    {catitem?.name !== "On Sale" && (
                      <span>{catitem?.name}</span>
                    )}
                  </NavDropdown.Item>
                </div>
                {/* <NavDropdown.Divider /> */}

                {subCategories
                  ?.filter((item) => item?.category?._id === catitem?._id)
                  .map((subitem) => (
                    <NavDropdown.Item
                      className="dropdown-list-item"
                      key={subitem?._id}
                      onClick={() => navigate(`/shop/${subitem?._id}?sub=true`)}
                    >
                      <ul>
                        <li>{subitem?.name}</li>
                      </ul>
                    </NavDropdown.Item>
                  ))}
              </Col>
            </>
          ))}
          <Col>
            <div
              className="speacials-container"
              style={{ borderRadius: "0.2rem" }}
            >
              <div>
                {categories?.map((catItem) => (
                  <NavDropdown.Item
                    onClick={() => navigate(`/shop/${catItem?._id}`)}
                    className="speacials-text"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {catItem?.name === "On Sale" && catItem?.name}
                  </NavDropdown.Item>
                ))}
              </div>
              {/* <div className="speacials-text">Specials</div> */}
            </div>
          </Col>
        </div>
      </ReactPlaceholder>
    </Row>
  );
};

export default DropdownComp;

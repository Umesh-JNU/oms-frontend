import React from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

// you can use this component for rendering the categories and subcategories whereever you want

const SideCate = ({
  shopDetailsLoading,
  categories,
  setSearchProduct,
  setShowList,
  showList,
}) => {
  const navigate = useNavigate();

  return (
    <Col lg={3}>
      <aside>
        <div className="divider"></div>
        <ul className="p-0 ps-md-3">
          <ReactPlaceholder
            type="text"
            color="#F0F0F0"
            showLoadingAnimation
            rows={5}
            ready={!shopDetailsLoading}
          >
            {categories?.map((category) => (
              <>
                <li
                  onClick={() => {
                    setSearchProduct("");
                    setShowList(!showList);
                    navigate(`/shop/${category?._id?.cat_id}`);
                  }}
                  key={category?._id}
                  className="side-link"
                >
                  <span>{category?._id?.name}</span>
                </li>
                <span>
                  {category?.subCategories?.map((subCate) => (
                    <li
                      key={subCate?._id}
                      className="side-link-subCategory"
                      onClick={() => {
                        setSearchProduct("");
                        navigate(`/shop/${subCate?._id}?sub=true`);
                      }}
                    >
                      {subCate?.name}
                    </li>
                  ))}
                </span>
              </>
            ))}
          </ReactPlaceholder>
        </ul>
      </aside>
    </Col>
  );
};

export default SideCate;

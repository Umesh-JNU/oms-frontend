import { Link, useNavigate } from "react-router-dom";

function ReactBreadcrumb({ path, other }) {
  // const pathList = path.split("/").slice(1);

  const navigate = useNavigate();

  const navigation = (p) => {
    // navigate("/");
    if (p === "Home") {
      navigate("/");
    } else if (p === "My-Account") {
      navigate("/home/my-account");
    }
  };

  return (
    <>
      {/* {pathList && ( */}
      <div className="breadcrum">
        {/* {pathList.map((p) => ( */}
        <div key={path} className="d-inline-block">
          {/* <span>&#47;</span> */}
          {/* <Link
            className="breadcrumb-link"
            to={`${other ? other : "/"}`}
            key={path}
          > */}
          {/* {path.split(' ')} */}
          {path.split(" ").map((p, i) => (
            <span
              style={{ cursor: "pointer" }}
              key={Math.random()}
              onClick={() => navigation(p)}
            >
              <span className="breadcrum-word">{`${p}`}</span>
              {/* <span>{`${p}`}</span> */}
            </span>
          ))}
          {/* </Link> */}
        </div>
        {/* ))} */}
      </div>
      {/* )} */}
    </>
  );
}

export default ReactBreadcrumb;

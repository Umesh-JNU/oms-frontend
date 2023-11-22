import Container from "react-bootstrap/Container";
import {
  Nav,
  Navbar,
  NavDropdown,
  Form,
  Offcanvas,
  Badge,
} from "react-bootstrap";
import {
  AiOutlineHome,
  AiOutlineShop,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import DropdownComp from "./DropdownComp";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/authSlice";
import { useEffect, useState } from "react";
import { getCart } from "../../features/apiCall";

// import app_logo_black from "./app_logo_black.png";
// import app_logo_white from "./app_logo_white.png";
import { setCart } from "../../features/cartSlice";
import { setBuyAgain } from "../../features/buyAgain";
import { setReviews } from "../../features/reviewSlice";
import { setOrders } from "../../features/ordersSlice";
import { setOrder } from "../../features/orderSlice";
import { setaddress } from "../../features/setChecAddr";

function ReactHeader() {
  const { token } = useSelector((state) => state.auth);
  const { cartItems, isFetching } = useSelector((state) => state.cart);
  const { address } = useSelector((state) => state.address);
  const [width, setWidth] = useState(window.innerWidth);
  const [scroll, setScroll] = useState(false);
  const [scrollDir, setScrollDir] = useState("scrolling down");
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const path = useLocation();
  const navigate = useNavigate();

  let cls = path.pathname === "/" ? "h-dark" : "h-light";

  const handleLogout = async () => {
    await dispatch(logOut());
    await dispatch(setCart());
    await dispatch(setBuyAgain());
    await dispatch(setReviews());
    await dispatch(setOrders());
    await dispatch(setOrder());
    await dispatch(setaddress());

    // navigate("/");
  };

  // const handleNavigation = () => {
  //   navigate("/home/sign-in");
  // };

  // const getCartDetails = async () => {
  //   await getCart(dispatch);
  // };
  // useEffect(() => {
  //   getCartDetails();
  // }, []);

  // 767
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    // console.log("bottom ", document.documentElement.scrollHeight);
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? setScroll(true) : setScroll(false));

      // if (scrollY === document.documentElement.scrollHeight) {
      //   setScroll(true);
      // }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;

      // console.log("scrolly", window.innerHeight);

      // if (
      //   document.body.scrollHeight ===
      //   document.body.scrollTop + window.innerHeight
      // ) {
      //   setScroll(false);
      // }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);

  useEffect(() => {
    if (path.pathname.startsWith("/shop") && expand) {
      setExpand(!expand);
    }
  }, [path]);

  const breakpoint = 767;

  return (
    <>
      {width > breakpoint ? (
        <Navbar
          className={`${path.pathname === "/" ? "h-dark" : "h-light header-nav"
            }`}
          expand="md"
          sticky="top"
          collapseOnSelect
        >
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link role="button" className="nav-link" tabIndex="0" to="/">
                  Home
                </Link>
                <Link role="button" className="nav-link" tabIndex="1" to="/home/products/?category=">
                  Products
                </Link>
                {/* <NavDropdown title="Shop" id="basic-nav-dropdown">
                  <DropdownComp />
                </NavDropdown> */}
                {/* <input type="text" name="search" className="" /> */}
              </Nav>
              <Form className="d-flex"></Form>
              <>
                <Navbar.Brand
                  className={`${cartItems?.length !== 0 && token && "center-app-logo"
                    } ${token && cartItems?.length === 0 && "center-logo"} ${!token && "app-logo"
                    }`}
                >
                  <Link to="/">
                    <img
                      alt="george-boston"
                      src="/logo192.png"
                      // src={
                      //   path.pathname === "/" ? app_logo_white : app_logo_black
                      // }
                      width="45"
                    // height="60"
                    // className="d-inline-block align-top app-logo"
                    />
                    {/* <h5 className="text-logo">Logo</h5> */}
                  </Link>
                </Navbar.Brand>
              </>

              <Nav className="ms-auto">
                {token && (
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    to={"/home/cart"}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column-reverse",
                      }}
                    >
                      <AiOutlineShoppingCart
                        style={{
                          marginRight: "1rem",
                          marginTop: "0.5rem",
                          zIndex: "3",
                        }}
                      /> 
                      {!isFetching && (
                        <Badge
                          className={`${cartItems?.length === 0
                              ? "no-cart-badge"
                              : "cart-badge"
                            }`}
                          pill
                          bg={`${path.pathname === "/" ? "light" : "dark"}`}
                          text={`${path.pathname === "/" && "dark"}`}
                        >
                          <p style={{ fontSize: "0.6rem" }}>
                            {isFetching ? 0 : cartItems?.length}
                          </p>
                        </Badge>
                      )}
                    </div>
                  </Link>
                )}

                {token && (
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    to={"/home/my-account"}
                  >
                    <HiOutlineUser />
                  </Link>
                )}

                {cartItems?.length !== 0 && token && (
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    to="/home/checkout-address"
                  >
                    <div className="checkout-link">Checkout</div>
                  </Link>
                )}

                {token ? (
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    onClick={() => handleLogout()}
                  // to={"/"}
                  >
                    <div
                      className="checkout-link"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      Logout
                      <MdOutlineLogout style={{ marginLeft: "0.5rem" }} />
                    </div>
                  </Link>
                ) : (
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    to={"/home/sign-in"}
                  >
                    <div className="checkout-link">Login</div>
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <>
          <Navbar
            className={`${path.pathname === "/" ? "h-dark" : "h-light header-nav"
              }`}
            collapseOnSelect
            expand="md"
            sticky="top"
            expanded={expand}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "0rem 0.7rem",
              }}
            >
              <Container fluid>
                <Navbar.Toggle
                  aria-controls="responsive-navbar-nav"
                  onClick={() => setExpand(!expand)}
                />
                <Navbar.Offcanvas
                  id={`offcanvasNavbar-expand-${expand}`}
                  aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                  placement="start"
                >
                  <Offcanvas.Header
                    closeButton
                    onClick={() => setExpand(!expand)}
                  ></Offcanvas.Header>

                  <Offcanvas.Body
                    id="responsive-navbar-nav"
                    style={{ padding: "1rem" }}
                  >
                    <Nav className="me-auto">
                      <Link
                        role="button"
                        className="nav-link"
                        tabIndex="0"
                        to="/"
                        onClick={() => setExpand(!expand)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <AiOutlineHome style={{ marginRight: "0.5rem" }} />
                          <p>Home</p>
                        </div>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <AiOutlineShop
                          style={{
                            position: "fixed",
                            top: "116px",
                          }}
                        />
                        <NavDropdown
                          style={{ marginLeft: "1.5rem" }}
                          title="Shop"
                          id="collasible-nav-dropdown"
                        >
                          <DropdownComp width={width} />
                        </NavDropdown>
                      </div>
                      {/* <input type="text" name="search" className="" /> */}
                    </Nav>
                    {/* <Form className="d-flex"></Form> */}

                    <Nav className="ms-auto">
                      {token && (
                        <Link
                          role="button"
                          className="nav-link"
                          tabIndex="0"
                          to={"/home/cart"}
                          onClick={() => setExpand(!expand)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "0.6rem",
                          }}
                        >
                          <Badge
                            className={`${
                              // cartItems?.length === 0
                              "no-cart-badge-mobile"
                              // : "cart-badge-mobile"
                              }`}
                            pill
                            bg="dark"
                          >
                            <p style={{ fontSize: "0.65rem" }} className="m-0">
                              {cartItems?.length}
                            </p>
                          </Badge>
                          <div
                            style={{
                              position: "absolute",
                              display: "flex",
                              // left: "0px",
                              alignItems: "center",
                            }}
                          >
                            <AiOutlineShoppingCart
                              style={{ marginRight: "0.5rem" }}
                            />
                            <p style={{ marginLeft: "0.2rem" }}>Cart</p>
                          </div>
                        </Link>
                      )}

                      {token && (
                        <Link
                          role="button"
                          className="nav-link"
                          tabIndex="0"
                          to={"/home/my-account"}
                          onClick={() => setExpand(!expand)}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <HiOutlineUser style={{ marginRight: "0.5rem" }} />
                            <p>Account</p>
                          </div>
                        </Link>
                      )}

                      {cartItems.length !== 0 && token && (
                        <Link
                          role="button"
                          className="nav-link"
                          tabIndex="0"
                          style={{ width: "fit-content" }}
                          to="/home/checkout-address"
                          onClick={() => setExpand(!expand)}
                        >
                          <div className="checkout-link">checkout</div>
                        </Link>
                      )}

                      {token ? (
                        <Link
                          role="button"
                          className="nav-link"
                          tabIndex="0"
                          style={{ width: "fit-content" }}
                          onClick={() => {
                            handleLogout();
                            setExpand(!expand);
                          }}
                          to={"/"}
                        >
                          <div className="checkout-link">
                            Logout{" "}
                            <MdOutlineLogout style={{ marginLeft: "0.5rem" }} />
                          </div>
                        </Link>
                      ) : (
                        <Link
                          style={{ width: "fit-content" }}
                          role="button"
                          className="nav-link"
                          tabIndex="0"
                          to={"/home/sign-in"}
                          onClick={() => setExpand(!expand)}
                        >
                          <div className="checkout-link">Login</div>
                        </Link>
                      )}
                      {/* <Link
                        role="button"
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          handleLogout();
                          setExpand(!expand);
                        }}
                        to={"/"}
                      >
                        <div className="checkout-link">
                          {token ? "Logout" : "Login"}
                        </div>
                      </Link> */}
                    </Nav>
                  </Offcanvas.Body>
                </Navbar.Offcanvas>
              </Container>
              <Link
                to="/"
                style={{
                  position: "fixed",
                  right: "0",
                  top: "0",
                  marginTop: "0.4rem",
                  marginRight: "1.4rem",
                }}
              >
                <img
                  alt="george-boston"
                  src="/logo192.png"
                  // src={path.pathname === "/" ? app_logo_white : app_logo_black}
                  width="66"
                // height="60"
                // className="d-inline-block align-top app-logo"
                />
              </Link>
            </div>
          </Navbar>

          {!scroll && (
            <div
              className={`${path.pathname === "/" ? "mobile-nav-dark" : "mobile-nav-light"
                } mobile-nav`}
            >
              <div className="mobile-nav-icons">
                <div>
                  <Link
                    role="button"
                    className="nav-link"
                    tabIndex="0"
                    to={"/"}
                  >
                    <AiOutlineHome className="mobile-icons" />
                  </Link>
                </div>
                <div>
                  {token && (
                    <Link
                      role="button"
                      className="nav-link"
                      tabIndex="0"
                      to={"/home/my-account"}
                    >
                      <HiOutlineUser className="mobile-icons" />
                    </Link>
                  )}
                </div>
                <div>
                  {token && (
                    <Link
                      role="link"
                      className="nav-link"
                      tabIndex="0"
                      to={"/home/cart"}
                    >
                      <Badge
                        className={`${
                          // cartItems?.length === 0
                          "no-cart-badge-mobile-nav"
                          // : "cart-badge-mobile-nav"
                          }`}
                        pill
                        bg={`${path.pathname === "/" ? "light" : "dark"}`}
                        text={`${path.pathname === "/" && "dark"}`}
                      >
                        <p style={{ fontSize: "0.65rem" }} className="m-0">
                          {cartItems?.length}
                        </p>
                      </Badge>
                      <AiOutlineShoppingCart className="mobile-icons" />
                    </Link>
                  )}
                </div>
                <div>
                  {token ? (
                    <MdOutlineLogout
                      className="mobile-icons"
                      onClick={() => handleLogout()}
                    />
                  ) : (
                    <Link
                      role="button"
                      className="nav-link"
                      tabIndex="0"
                      to={"/home/sign-in"}
                    >
                      <MdOutlineLogin className="mobile-icons" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ReactHeader;

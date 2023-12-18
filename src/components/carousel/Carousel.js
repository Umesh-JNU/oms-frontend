import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CustomCarousel({ banners }) {
  console.log({ banners })
  const navigate = useNavigate();
  return (
    <>
      <Carousel style={{ cursor: "pointer", backgroundColor: "#000" }}>
        {banners?.map((banner) => (
          <Carousel.Item key={banner?.img_url}>
            <img
              className="d-block w-100"
              src={banner?.img_url}
              alt="First slide"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

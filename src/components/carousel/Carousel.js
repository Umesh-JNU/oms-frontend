import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CustomCarousel({ promotions }) {
  console.log({ promotions })
  const navigate = useNavigate();
  return (
    <>
      <Carousel style={{ cursor: "pointer", backgroundColor: "#000" }}>
        {promotions?.map((promo) => (
          <Carousel.Item key={promo?.promo_image}>
            <img
              className="d-block w-100"
              src={promo?.promo_image}
              alt="First slide"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

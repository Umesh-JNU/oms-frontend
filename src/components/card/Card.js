import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardImageBox from "./CardImg";

function ReactCard({ item }) {
  console.log({ item })
  const navigate = useNavigate();

  // console.log("item ", item);

  return (
    <Card
      style={{
        cursor: "pointer",
        margin: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => navigate(`/home/products/?category=${encodeURIComponent(item?.name)}`)}
    >
      <div className="category-img">
        <CardImageBox imgPath={item?.category_img} />
      </div>

      {/* <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body> */}
      <Card.Footer className="category-footer">
        <h6>{item.name}</h6>
      </Card.Footer>
    </Card>
  );
}

export default ReactCard;

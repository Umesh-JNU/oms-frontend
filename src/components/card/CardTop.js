import CardImg from "./CardImg";

export default function CardTop({ path, sale }) {
  return (
    <div className="shop-top-img">
      {sale > 0 && (
        <div className="top-right">
          <span>{sale}%</span>
          {/* <span>New</span> */}
        </div>
      )}
      <CardImg imgPath={path} />
    </div>
  );
}

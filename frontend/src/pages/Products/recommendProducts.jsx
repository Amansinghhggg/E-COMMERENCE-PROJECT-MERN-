import { Link } from "react-router-dom";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

export default function RecommendProducts({ currentProductId }) {
  const { data: products = [], isLoading, isError } = useAllProductsQuery();

  const recommendedProducts = products
    .filter((item) => item._id !== currentProductId)
    .slice(0, 12);

  if (isLoading) {
    return (
      <div className="mt-5">
        <h4 className="mb-3">Recommended Products</h4>
        <p className="text-muted mb-0">Loading recommendations...</p>
      </div>
    );
  }

  if (isError || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-5">
      <h4 className="mb-3">Recommended Products</h4>
      <div className="row g-4">
        {recommendedProducts.map((item) => (
          <div key={item._id} className="col-12 col-sm-6 col-lg-3">
            <Link to={`/product/${item._id}`} className="text-decoration-none text-dark">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="card-title mb-2">{item.name}</h6>
                  <p className="card-text fw-semibold mb-0">₹{item.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../../redux/features/Cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

        //   const checkoutHandler = () => {
        //     navigate("/login?redirect=/shipping");
        //   };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Your cart is empty 🛒
            </h2>
            <p className="text-gray-400 mb-4">
              Looks like you haven’t added anything yet.
            </p>
            <Link
              to="/shop"
              className="bg-sky-500 px-6 py-2 rounded-full text-sm font-semibold hover:bg-sky-400 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-3xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-white textDecoration-none font-medium hover:text-sky-400 "
                    >
                      {item.name}
                    </Link>

                    <p className="text-sm text-gray-400">{item.brand}</p>

                    <p className="mt-1 font-semibold text-sky-400">
                      ₹ {item.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* QTY */}
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                    {/* MINUS */}
                    <button
                      onClick={() =>
                        item.qty > 1 && addToCartHandler(item, item.qty - 1)
                      }
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 transition text-white"
                    >
                      -
                    </button>

                    {/* QUANTITY */}
                    <span className="px-4 py-1 text-sm bg-[#0f172a]">
                      {item.qty}
                    </span>

                    {/* PLUS */}
                    <button
                      onClick={() =>
                        item.qty < item.countInStock &&
                        addToCartHandler(item, item.qty + 1)
                      }
                      className="px-3 py-1 bg-white/5 hover:bg-white/10 transition text-white"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-fit sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Items</span>
                <span>
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span className="text-sky-400">
                  ₹{" "}
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                to="/shipping"
                className="block bg-sky-500 text-decoration-none text-center py-2 text-white font-semibold border border-white/20 rounded-lg hover:bg-sky-200 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
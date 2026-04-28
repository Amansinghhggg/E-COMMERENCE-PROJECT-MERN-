import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/stepProgress";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod("Razorpay"));
    navigate("/placeorder");
  };

  // // Payment
  // useEffect(() => {
  //   // if (!shippingAddress.address) {
  //   //   navigate("/shipping");
  //   // }
  // }, [navigate, shippingAddress]);

  return (<div className="min-h-screen bg-[#0b1220] text-white px-4 py-10">

  <div className="max-w-xl mx-auto">

    <ProgressSteps step1 step2 />

    <div className="mt-6 bg-[#111827] p-6 rounded-2xl border border-white/10 shadow-lg">

      <h1 className="text-2xl font-semibold mb-1">Shipping Details</h1>
      <p className="text-sm text-gray-400 mb-5">
        Enter your delivery information
      </p>

      <form onSubmit={submitHandler} className="space-y-4">

        <div>
          <label className="label">Address</label>
          <input
            type="text"
            className="input"
            placeholder="Street, house no..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="label">City</label>
            <input
              type="text"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Postal Code</label>
            <input
              type="text"
              className="input"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>

        </div>

        <div>
          <label className="label">Country</label>
          <input
            type="text"
            className="input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <button
        style={{ borderRadius: "9999px" }}
          type="submit"
          className="w-full py-2.5 mt-2 rounded-xl bg-sky-500 hover:bg-sky-400 transition font-semibold"
        >
          Continue to Payment
        </button>

      </form>

    </div>

  </div>
</div>
  );
};

export default Shipping;
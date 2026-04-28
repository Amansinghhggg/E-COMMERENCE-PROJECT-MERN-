import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/stepProgress";
import Loader from "../../components/Loader";
import { useCreateOrderMutation, usePayOrderMutation } from "../../redux/api/orderSlice";
import { clearCart } from "../../redux/features/Cart/cartSlice";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const addDecimals = (num) => Number((Math.round(num * 100) / 100).toFixed(2));

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.08 * itemsPrice).toFixed(2)));
  const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const createdOrder = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      const hasRazorpay = !!createdOrder?.razorpay?.orderId;

      if (!hasRazorpay) {
        dispatch(clearCart());
        toast.success("Order created successfully");
        navigate(`/order/${createdOrder._id}`);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Unable to load Razorpay checkout");
        return;
      }

      const options = {
        key: createdOrder.razorpay.key,
        amount: createdOrder.razorpay.amount,
        currency: createdOrder.razorpay.currency,
        name: createdOrder.razorpay.name,
        description: createdOrder.razorpay.description,
        order_id: createdOrder.razorpay.orderId,
        prefill: createdOrder.razorpay.prefill,
        theme: createdOrder.razorpay.theme,
        handler: async (response) => {
          try {
            await payOrder({
              orderId: createdOrder._id,
              details: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: "captured",
                update_time: new Date().toISOString(),
              },
            }).unwrap();

            dispatch(clearCart());
            toast.success("Payment successful");
            navigate(`/order/${createdOrder._id}`);
          } catch (payError) {
            toast.error(
              payError?.data?.error ||
                payError?.data?.message ||
                "Payment recorded failed"
            );
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. You can retry from order details.");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (createError) {
      toast.error(
        createError?.data?.error ||
          createError?.data?.message ||
          "Unable to create order"
      );
    }
  };

  return (
    <>
  <ProgressSteps step1 step2 step3 />

  <div className="min-h-screen bg-[#0b1220] text-white px-4 py-8">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

      {/* LEFT: ITEMS */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold mb-4">Review Your Order</h1>

        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          cart.cartItems.map((item) => (
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
                  to={`/product/${item.product}`}
                  className="text-white font-medium hover:text-sky-400 no-underline"
                >
                  {item.name}
                </Link>

                <p className="text-sm text-gray-400">
                  Qty: {item.qty}
                </p>

                <p className="text-sm text-gray-400">
                  ₹ {item.price.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="text-sky-400 font-semibold">
                ₹ {(item.qty * item.price).toLocaleString("en-IN")}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT: SUMMARY */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-fit sticky top-24">

        <h2 className="text-lg font-semibold mb-4">
          Order Summary
        </h2>

        {/* PRICE DETAILS */}
        <div className="space-y-2 text-sm text-gray-300 mb-4">
          <div className="flex justify-between">
            <span>Items</span>
            <span>₹ {itemsPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹ {shippingPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹ {taxPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total</span>
          <span className="text-sky-400">
            ₹ {totalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {/* SHIPPING */}
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">Shipping</h3>
          <p className="text-gray-400">
            {cart.shippingAddress.address},{" "}
            {cart.shippingAddress.city},{" "}
            {cart.shippingAddress.postalCode},{" "}
            {cart.shippingAddress.country}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="mb-4 text-sm">
          <h3 className="font-semibold mb-1">Payment</h3>
          <p className="text-gray-400">
            {cart.paymentMethod}
          </p>
        </div>

        {/* ERROR */}
        {error && <Message variant="danger">{error.data.message}</Message>}

        {/* BUTTON */}
        <button
          onClick={placeOrderHandler}
          style={{ borderRadius: "9999px" }}
          disabled={cart.cartItems.length === 0 || isLoading || loadingPay}
          className="w-full rounded-md py-2 bg-sky-500 text-white font-semibold border border-white/20 rounded-lg hover:bg-sky-200 transition"
        >
          Proceed for Payment
        </button>

        {(isLoading || loadingPay) && <Loader />}
      </div>
    </div>
  </div>
</>
  );
};

export default PlaceOrder;
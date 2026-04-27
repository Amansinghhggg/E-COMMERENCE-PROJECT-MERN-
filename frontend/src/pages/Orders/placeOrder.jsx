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

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top">Image</td>
                  <td className="px-1 py-2 text-left">Product</td>
                  <td className="px-1 py-2 text-left">Quantity</td>
                  <td className="px-1 py-2 text-left">Price</td>
                  <td className="px-1 py-2 text-left">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}</td>
                    <td className="p-2">
                      ₹ {(item.qty * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-4">Items:</span> ₹
                {itemsPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Shipping:</span> ₹
                {shippingPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Tax:</span> ₹
                {taxPrice}
              </li>
              <li>
                <span className="font-semibold mb-4">Total:</span> ₹
                {totalPrice}
              </li>
            </ul>

            {error && <Message variant="danger">{error.data.message}</Message>}

            <div>
              <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            disabled={cart.cartItems.length === 0 || isLoading || loadingPay}
            onClick={placeOrderHandler}
          >
            Proceed For Payment
          </button>

          {(isLoading || loadingPay) && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
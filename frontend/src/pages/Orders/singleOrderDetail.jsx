import { useSelector } from "react-redux";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../../redux/api/orderSlice";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

export default function OrderDetail() {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = !!userInfo?.user?.isAdmin;

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderDetailsQuery(id);

  const [markAsPaid, { isLoading: loadingPaid }] = usePayOrderMutation();
  const [markAsDelivered, { isLoading: loadingDelivered }] =
    useDeliverOrderMutation();

  const markPaidHandler = async () => {
    if (!order || order.isPaid) return;

    try {
      await markAsPaid({
        orderId: order._id,
        details: {
          id: `admin-manual-${order._id}`,
          status: "COMPLETED",
          update_time: new Date().toISOString(),
          payer: {
            email_address: order?.user?.email || "admin@manual.local",
          },
        },
      }).unwrap();
      toast.success("Order marked as paid");
      refetch();
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || "Unable to mark paid");
    }
  };

  const markDeliveredHandler = async () => {
    if (!order || order.isDelivered) return;

    try {
      await markAsDelivered(order._id).unwrap();
      toast.success("Order marked as delivered");
      refetch();
    } catch (err) {
      toast.error(
        err?.data?.error || err?.data?.message || "Unable to mark delivered"
      );
    }
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500 text-center mt-10">
        {error?.data?.error || "Error occurred while loading order details."}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#111111] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <p className="uppercase tracking-[0.2em] text-xs text-gray-300">
                Order Detail
              </p>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">#{order._id}</h1>
              <p className="text-sm text-gray-300 mt-2">
                {order?.user?.name || "User"} ({order?.user?.email || "No email"})
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 text-sm rounded-full border ${
                  order.isPaid
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    : "bg-amber-500/20 text-amber-200 border-amber-400/40"
                }`}
              >
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full border ${
                  order.isDelivered
                    ? "bg-blue-500/20 text-blue-300 border-blue-400/40"
                    : "bg-rose-500/20 text-rose-300 border-rose-400/40"
                }`}
              >
                {order.isDelivered ? "Delivered" : "Not Delivered"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <h2 className="text-lg font-semibold mb-3">Order Items</h2>

                <div className="space-y-3">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover border border-white/10"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product}`}
                            className="font-medium text-sky-300 hover:text-sky-200 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-300 mt-1">
                            Qty: {item.qty} x INR {Number(item.price).toFixed(2).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="font-semibold whitespace-nowrap">
                        INR {(item.qty * item.price).toFixed(2).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <h2 className="text-lg font-semibold mb-3">Shipping</h2>
                <p className="text-gray-200 leading-7">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>

              <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
                <p className="text-gray-200">{order.paymentMethod}</p>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4 border border-white/10 h-fit">
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Items</span>
                  <span>INR {Number(order.itemsPrice).toFixed(2).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span>INR {Number(order.shippingPrice).toFixed(2).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span>INR {Number(order.taxPrice).toFixed(2).toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2 flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>INR {Number(order.totalPrice).toFixed(2).toLocaleString()}</span>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={markPaidHandler}
                    disabled={order.isPaid || loadingPaid}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-900/60 disabled:cursor-not-allowed text-white rounded-md py-2.5 transition-colors"
                  >
                    {loadingPaid ? "Updating..." : "Mark as Paid"}
                  </button>
                  <button
                    type="button"
                    onClick={markDeliveredHandler}
                    disabled={order.isDelivered || loadingDelivered}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900/60 disabled:cursor-not-allowed text-white rounded-md py-2.5 transition-colors"
                  >
                    {loadingDelivered ? "Updating..." : "Mark as Delivered"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

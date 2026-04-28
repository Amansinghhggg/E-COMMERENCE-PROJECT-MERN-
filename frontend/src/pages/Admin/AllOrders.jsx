import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderSlice";
import Loader from "../../components/Loader";
export default function OrderList() {
  const { data: orders, isLoading, isError } = useGetOrdersQuery();
  console.log(orders);
  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500 text-center mt-4">Error occurred while loading orders.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">All Orders</h1>
          <p className="mt-2 text-sm leading-6 text-gray-300">
            Review every order, payment state, and delivery status in one place.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-gray-300 shadow-xl">
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-white/7"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{order.user.name}</p>
                    <p className="mt-1 truncate text-xs text-gray-400">{order._id}</p>
                  </div>

                  <div className="text-base font-semibold text-sky-300 lg:text-lg">
                    ₹ {order.totalPrice.toLocaleString("en-IN")}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      className={`rounded-full px-3 py-1.5 font-medium ${
                        order.isPaid
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 font-medium ${
                        order.isDelivered
                          ? "bg-sky-500/15 text-sky-300"
                          : "bg-yellow-500/15 text-yellow-300"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Processing"}
                    </span>
                  </div>

                  <Link
                    to={`/order/${order._id}`}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-100"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useGetMyOrdersQuery } from '../../redux/api/orderSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import { CubeIcon, ArrowRightIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/solid";

export default function UserOrder() {
    const { id } = useParams();
    const { userInfo } = useSelector((state) => state.auth);
    const { data: orders, isLoading, isError } = useGetMyOrdersQuery(id);
    console.log(orders);

    if (isLoading) return <Loader />;
    if (isError) return <p className="text-red-500 text-center mt-4">Error occurred while loading orders.</p>;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">
                Order History
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                Track payment, delivery, and open any order for full details.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <div className="rounded-full bg-sky-500/15 p-3 text-sky-300">
                <CubeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Total Orders
                </p>
                <h2 className="text-2xl font-semibold">{orders?.length || 0}</h2>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 px-6 text-center shadow-xl">
              <div className="max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
                  <CubeIcon className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-semibold">No orders yet</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Start shopping to see your orders here.
                </p>
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Go to Shop
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-white/7"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200">
                          <CubeIcon className="h-4 w-4" />
                          Order
                        </span>
                        <p className="max-w-full truncate text-sm text-gray-300">
                          {order._id}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-300">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5">
                          {order.isPaid ? (
                            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <ClockIcon className="h-4 w-4 text-yellow-400" />
                          )}
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5">
                          {order.isDelivered ? (
                            <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <ClockIcon className="h-4 w-4 text-yellow-400" />
                          )}
                          {order.isDelivered ? "Delivered" : "Processing"}
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-gray-400">
                        Total amount
                        <span className="ml-2 text-base font-semibold text-sky-300">
                          ₹ {order.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/order/${order._id}`}
                      style={{ textDecoration: "none" }}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-100"
                    >
                      View Details
                      <ArrowRightIcon className="h-4 w-4" />
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
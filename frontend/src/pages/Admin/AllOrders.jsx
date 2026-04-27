import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderSlice";
import Loader from "../../components/Loader";
export default function OrderList() {
  const { data: orders, isLoading, isError } = useGetOrdersQuery();
  console.log(orders);
  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500 text-center mt-4">Error occurred while loading orders.</p>;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <h1 className="text-3xl font-bold text-center py-8">All Orders</h1>
      <div className="container mx-auto px-4">
        {orders.length === 0 ? (
          <p className="text-center text-gray-400">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1e1e1e] rounded-lg">
              <thead> 
                <tr>
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">User</th>
                  <th className="py-3 px-6 text-left">Total Price</th>
                  <th className="py-3 px-6 text-left">Paid</th>
                  <th className="py-3 px-6 text-left">Delivered</th>
                  <th className="py-3 px-6 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-700">
                    <td className="py-3 px-6">{order._id}</td>
                    <td className="py-3 px-6">{order.user.name}</td>
                    <td className="py-3 px-6">₹ {order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-6">
                      {order.isPaid ? (
                        <span className="text-green-500">Completed</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      {order.isDelivered ? (  
                        <span className="text-green-500">Completed</span>
                      ) : (
                        <span className="text-red-500">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}
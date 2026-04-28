import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { useGetAllUsersQuery } from "../../redux/api/user";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderSlice";
import OrderList from "./AllOrders";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers } = useGetAllUsersQuery();
  const { data: orders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#38bdf8"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "rgba(255,255,255,0.08)",
      },
      markers: {
        size: 2,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <section className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white xl:ml-[4rem] md:ml-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Monitor business performance, customer growth, and order flow at a glance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Sales", value: sales?.totalSales },
              { title: "Customers", value: customers?.length },
              { title: "Orders", value: orders?.totalOrders },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400/30"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.title}</p>
                <h2 className="mt-2 text-3xl font-semibold text-sky-300">
                  {isLoading ? <Loader /> : item.value}
                </h2>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Analytics</p>
              <h2 className="mt-2 text-2xl font-semibold">Sales Trend</h2>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] bg-[#0b1220]/70 p-3">
              <Chart options={state.options} series={state.series} type="bar" width="100%" />
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Operations</p>
                <h2 className="mt-2 text-2xl font-semibold">Latest Orders</h2>
              </div>
            </div>
            <OrderList />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;

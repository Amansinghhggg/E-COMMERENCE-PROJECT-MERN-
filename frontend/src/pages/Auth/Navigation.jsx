import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/user";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const navLabel =
    userInfo?.user?.username || userInfo?.user?.name || userInfo?.username;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{ zIndex: 9999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white h-screen fixed border-r border-white/10 bg-gradient-to-b from-[#0f172a]/95 via-[#111827]/95 to-[#111111]/95 backdrop-blur-sm shadow-2xl`}
      id="navigation-container"
    >
      <div className="mt-6 flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="group flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <AiOutlineHome className="mr-3 text-sky-300" size={24} />
          <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
            HOME
          </span>
        </Link>

        <Link
          to="/shop"
          className="group flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <AiOutlineShopping className="mr-3 text-sky-300" size={24} />
          <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
            SHOP
          </span>
        </Link>

        <Link to="/cart" className="flex relative rounded-lg px-2 py-2 transition-colors hover:bg-white/10">
          <div className="flex items-center">
            <AiOutlineShoppingCart className="mr-3 text-sky-300" size={24} />
            <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
              CART
            </span>
          </div>

          {/* <div className="absolute top-9">
            {cartItems.length > 0 && (
              <span>
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              </span>
            )}
          </div> */}
        </Link>

        <Link
          to="/favorite"
          className="flex relative rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <div className="flex justify-center items-center">
            <FaHeart className="mr-3 text-sky-300" size={20} />
            <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
              FAVORITES
            </span>{" "}
            {/* <FavoritesCount /> */}
          </div>
        </Link>
      </div>

      <div className="relative mb-3 rounded-xl border border-white/10 bg-black/20 p-2">
        <button
          onClick={toggleDropdown}
          className="flex w-full items-center justify-between text-gray-100 focus:outline-none"
        >
          {userInfo ? <span className="text-sm font-medium">{navLabel}</span> : <></>}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-1 min-w-[11rem] rounded-lg border border-white/15 bg-[#0f172a] py-2 text-gray-100 shadow-2xl ${
              !userInfo.user.isAdmin ? "-top-20" : "-top-80"
            } `}
          >
            {userInfo.user.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 hover:bg-white/10"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-white/10"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-white/10"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-white/10"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                to={`/orders/myorders/${userInfo.user._id}`}
                className="block px-4 py-2 hover:bg-white/10"
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/profile" className="block px-4 py-2 hover:bg-white/10">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left hover:bg-white/10"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="space-y-2">
            <li>
              <Link
                to="/login"
                className="flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
              >
                <AiOutlineLogin className="mr-3 text-sky-300" size={22} />
                <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
                  LOGIN
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
              >
                <AiOutlineUserAdd className="mr-3 text-sky-300" size={22} />
                <span className="hidden nav-item-name text-sm font-medium tracking-wide text-gray-100">
                  REGISTER
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
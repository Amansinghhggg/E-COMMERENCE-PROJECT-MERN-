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
  const { cartItems } = useSelector((state) => state.cart);
  const cartItemsCount = cartItems?.length || 0;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const navLabel =
    userInfo?.user?.username || userInfo?.user?.name || userInfo?.username;
  const isAdmin = Boolean(userInfo?.user?.isAdmin);
  const userId = userInfo?.user?._id || userInfo?._id;

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav
      style={{ zIndex: 9999 }}
      className="fixed top-0 left-0 right-0 border-b border-white/10 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#111111]/95 text-white backdrop-blur-sm shadow-2xl"
      id="navigation-container"
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <Link
          to="/"
          className="group flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <AiOutlineHome className="mr-3 text-sky-300" size={24} />
          <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
            HOME
          </span>
        </Link>

        <Link
          to="/shop"
          className="group flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <AiOutlineShopping className="mr-3 text-sky-300" size={24} />
          <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
            SHOP
          </span>
        </Link>

        <Link to="/cart" className="flex relative rounded-lg px-2 py-2 transition-colors hover:bg-white/10">
          <div className="flex items-center">
            <div className="relative mr-3">
              <AiOutlineShoppingCart className="text-sky-300" size={24} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-pink-500 px-1.5 text-[10px] font-bold leading-4 text-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
              CART
            </span>
          </div>

        </Link>

        <Link
          to="/favorite"
          className="flex relative rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
        >
          <div className="flex justify-center items-center">
            <FaHeart className="mr-3 text-sky-300" size={20} />
            <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
              FAVORITES
            </span>
            {/* <FavoritesCount /> */}
          </div>
        </Link>

        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {!userInfo && (
          <>
            <Link
              to="/login"
              className="flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
            >
              <AiOutlineLogin className="mr-3 text-sky-300" size={22} />
              <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
                LOGIN
              </span>
            </Link>
            <Link
              to="/register"
              className="flex items-center rounded-lg px-2 py-2 transition-colors hover:bg-white/10"
            >
              <AiOutlineUserAdd className="mr-3 text-sky-300" size={22} />
              <span className="nav-item-name text-sm font-medium tracking-wide text-gray-100">
                REGISTER
              </span>
            </Link>
          </>
        )}

        {userInfo && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center rounded-lg bg-black/20 px-3 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-white/10"
            >
               <b>Hi! {navLabel}</b>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="nav-dropdown-menu absolute right-0 mt-2 min-w-[13rem] rounded-lg border border-white/15 bg-[#0f172a] py-2 text-gray-100 shadow-2xl">
                {isAdmin && (
                  <>
                    <li className="nav-dropdown-section-title px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-300/90">
                      Admin
                    </li>
                    <li>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/allproductslist"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/categorylist"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        onClick={() => setDropdownOpen(false)}
                        className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Users
                      </Link>
                    </li>
                    <li>
                      <hr className="my-1 border-white/10" />
                    </li>
                  </>
                )}
                <li className="nav-dropdown-section-title px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300/90">
                  Account
                </li>
                <li>
                  <Link
                    to={`/orders/myorders/${userId}`}
                    onClick={() => setDropdownOpen(false)}
                    className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="nav-dropdown-item block px-4 py-2 text-sm hover:bg-white/10"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logoutHandler}
                    className="nav-dropdown-item nav-dropdown-item-danger block w-full px-4 py-2 text-left text-sm hover:bg-white/10"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navigation;
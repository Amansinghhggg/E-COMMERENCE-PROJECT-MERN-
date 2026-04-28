import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/user.js";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
export default function Register() {
     const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const redirectPath = redirect.startsWith("/") ? redirect : "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirectPath);
    }
  }, [navigate, redirectPath, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate all fields are filled
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword){
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await register({ name: username, email: email, password: password }).unwrap();
      console.log("response",res);
      dispatch(setCredentials(res));
      navigate(redirectPath);
      toast.success("User successfully registered");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white/5 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Join us</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Register</h1>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Create your account and start saving favorites, cart items, and orders.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-full bg-black/20 p-1">
              <Link
                to={redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login"}
                className="rounded-full px-4 py-2 text-center text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                to={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"}
                className="rounded-full bg-sky-500 px-4 py-2 text-center text-sm font-semibold text-white transition"
              >
                Register
              </Link>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                  placeholder="Enter name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
              style={{ borderRadius: "9999px" }}
                disabled={isLoading}
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Registering..." : "Register"}
              </button>

              {isLoading && <Loader />}
            </form>

  
          </div>
        </div>
      </div>
    );
}
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice.js";
import { useProfileMutation } from "../../redux/api/user.js";
import { CheckCircleIcon, UserIcon, MailIcon, LockClosedIcon, ArrowRightIcon } from "@heroicons/react/solid";
export default function Profile(){
    const [updateProfile, {isLoading: isUpdating}] = useProfileMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {userInfo} = useSelector((state) => state.auth);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    useEffect(() => {
        if (userInfo && userInfo.user) {
            setName(userInfo.user.name);
            setEmail(userInfo.user.email);
            console.log(userInfo);
        }   
    }, [userInfo]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate name and email are not empty
        if (!name || !email) {
            toast.error("Name and email are required");
            return;
        }

        // Both password and confirmPassword are REQUIRED
        if (!password || !confirmPassword) {
            toast.error("Both password and confirm password are required");
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Prepare data with all fields including password
        const data = {
            name,
            email,
            password,
            confirmPassword
        };

        try {
            const res = await updateProfile(data).unwrap();
            console.log(res);
            dispatch(setCredentials(res));
            // Clear password fields after successful update
            setPassword("");
            setConfirmPassword("");
            toast.success("Profile updated successfully");
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message || "Failed to update profile");
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Account</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">User Profile</h1>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                        Update your profile details and keep your account information current.
                    </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400" htmlFor="name">
                                    <UserIcon className="h-4 w-4 text-sky-300" />
                                    Name
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400" htmlFor="email">
                                    <MailIcon className="h-4 w-4 text-sky-300" />
                                    Email
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400" htmlFor="password">
                                    <LockClosedIcon className="h-4 w-4 text-sky-300" />
                                    Password
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="New password"
                                />
                            </div>

                            <div>
                                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400" htmlFor="confirmPassword">
                                    <CheckCircleIcon className="h-4 w-4 text-sky-300" />
                                    Confirm Password
                                </label>
                                <input
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-sky-400 focus:bg-black/30"
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                            <button
                            style={{ borderRadius: "9999px" }}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                                type="submit"
                                disabled={isUpdating}
                            >
                                {isUpdating ? "Updating..." : "Update Profile"}
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>

                            <Link
                                to={`/orders/myorders/${userInfo.user._id}`}
                                style={{ textDecoration: "none" }}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:border-sky-400/40 hover:bg-sky-500/15 hover:text-sky-100"
                            >
                                My Orders
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
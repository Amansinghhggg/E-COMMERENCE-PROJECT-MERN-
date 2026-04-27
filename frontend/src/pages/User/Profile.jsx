import {useState,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useLocation} from "react-router-dom";
import {toast} from "react-toastify";
import {setCredentials} from "../../redux/features/auth/authSlice.js";
import {useProfileMutation} from "../../redux/api/user.js";
import {Link} from "react-router-dom";
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
        <div className="top bottom-10 left-[30rem] transform translate-x-1/2 translate-y-1/2 z-50
bg-[#of0f0f] border w-[30%] px-[4rem] mb-[2rem] rounded">
            <h1 className="text-2xl font-semibold mb-4">User Profile</h1>
            <form onSubmit={handleSubmit} className="container ">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={isUpdating}
                >
                    {isUpdating ? "Updating..." : "Update Profile"}
                </button>
                <Link to="/user-orders" className="text-blue-500 hover:underline">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> My Orders</button>
            </Link>
            </form>
            
        </div>
    );
}
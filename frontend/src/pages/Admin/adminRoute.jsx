import {useSelector} from "react-redux";
import {Navigate, Outlet, useLocation} from "react-router-dom";
export default function AdminRoute() {
    const {userInfo} = useSelector((state) => state.auth);
    const location = useLocation();
    console.log("AdminRoute userInfo:", userInfo);
    if (!userInfo?.user) {
        const redirectPath = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    return userInfo.user.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
} 
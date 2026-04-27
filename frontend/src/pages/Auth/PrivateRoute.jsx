import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
export default function PrivateRoute() {
    const {userInfo} = useSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        const redirectPath = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
    }

    return <Outlet />;
}
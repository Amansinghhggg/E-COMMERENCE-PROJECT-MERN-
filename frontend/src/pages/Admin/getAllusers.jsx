import Loader from "../../components/Loader.jsx";
import {useGetAllUsersQuery , useDeleteUserMutation,useMakeAdminMutation} from "../../redux/api/user.js";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import AdminMenu from "./adminMenu.jsx";
export default function GetAllUsers() {
    const {data, error, isLoading, isFetching} = useGetAllUsersQuery();
    const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();
    const [makeAdmin, {isLoading: isMakingAdmin}] = useMakeAdminMutation();
    const {userInfo} = useSelector((state) => state.auth);
  const loggedInUserId = userInfo?.user?._id;
    const handleDelete = async (id, name) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id).unwrap();
                toast.success(` ${name} User deleted successfully`);
            } catch (err) {
                console.log(err);
                toast.error(err?.data?.message || "Failed to delete user");
            }
        }
    };
    const handleMakeAdmin = async (id, name) => {
        if (window.confirm(`Are you sure you want to make ${name} an admin?`)) {
            try {
                await makeAdmin(id).unwrap();
                toast.success(`${name} is now an admin`);
            } catch (err) {
                console.log(err);
                toast.error(err?.data?.message || "Failed to promote user to admin");
            }
        }
    };
    useEffect(() => {
        if (error) {
            toast.error("Failed to fetch users");
        }
    }, [error]);

    if (isLoading || isFetching) {
        return <Loader />;
    }
    
    if (error) return null;

    return (
      <div>
        {data && (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>
            <AdminMenu />
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      {user.isAdmin ? "Admin" : "User"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {loggedInUserId && user._id !== loggedInUserId && (
                        <div>
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(user._id, user.name)}>
                            Delete
                          </button>
                          {(!user.isAdmin) && (
                            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 ml-2" 
                            onClick={() => handleMakeAdmin(user._id, user.name)}>
                              Make Admin
                            </button>
                          )} 
                        </div>


                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
}
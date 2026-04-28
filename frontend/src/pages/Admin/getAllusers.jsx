import Loader from "../../components/Loader.jsx";
import {useGetAllUsersQuery , useDeleteUserMutation,useMakeAdminMutation} from "../../redux/api/user.js";
import {toast} from "react-toastify";
import {useEffect} from "react";
import {useSelector} from "react-redux";
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
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f172a] to-[#111111] px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/80">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Users</h1>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Manage user roles and access from a clean control panel.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {data.map((user) => (
              <article
                key={user._id}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-white/7"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-white">{user.name}</p>
                    <p className="mt-1 truncate text-sm text-gray-400">{user.email}</p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                        user.isAdmin
                          ? "bg-sky-500/15 text-sky-300"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>

                  {loggedInUserId && user._id !== loggedInUserId && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        className="rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>

                      {!user.isAdmin && (
                        <button
                          onClick={() => handleMakeAdmin(user._id, user.name)}
                          className="rounded-full bg-sky-500/10 px-4 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
}
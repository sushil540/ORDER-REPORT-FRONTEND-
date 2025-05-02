import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ userEmail }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    Swal.fire("Logout!", "Logged Out Successfully", "success");
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center rounded">
      <div className="text-gray-700 text-lg font-bold">Order Report App</div>
      <div className="text-gray-700 font-medium text-sm sm:text-base md:text-lg">{userEmail}</div>
      <button
        onClick={handleLogout}
        className="bg-red-100 text-red-600 hover:bg-red-200 transition-colors px-4 py-2 rounded-lg font-semibold text-sm sm:text-base md:text-lg flex items-center gap-2"
      >
        <FaSignOutAlt className="text-red-600 text-lg" />
        Logout
      </button>
    </nav>
  );
}

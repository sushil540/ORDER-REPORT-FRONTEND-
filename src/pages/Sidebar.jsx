// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);

//   return (
//     <div
//       className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       <div className="flex justify-between items-center p-4 border-b border-gray-700">
//         {!isCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
//         <button onClick={toggleSidebar}>
//           {isCollapsed ? (
//             <ChevronRight size={20} />
//           ) : (
//             <ChevronLeft size={20} />
//           )}
//         </button>
//       </div>

//       <nav className="flex flex-col gap-2 p-2 text-sm">
//         <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded">
//           {!isCollapsed ? "Dashboard" : "D"}
//         </Link>
//         <Link to="/salesperson" className="hover:bg-gray-700 p-2 rounded">
//           {!isCollapsed ? "SalesPerson" : "S"}
//         </Link>
//         <Link to="/customer" className="hover:bg-gray-700 p-2 rounded">
//           {!isCollapsed ? "Customer" : "C"}
//         </Link>
//         <Link to="/order" className="hover:bg-gray-700 p-2 rounded">
//           {!isCollapsed ? "Order" : "O"}
//         </Link>
//         <Link to="/reports" className="hover:bg-gray-700 p-2 rounded">
//           {!isCollapsed ? "Reports" : "R"}
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", short: "D" },
    { name: "Salesperson", path: "/salesperson", short: "S" },
    { name: "Customer", path: "/customer", short: "C" },
    { name: "Order", path: "/order", short: "O" },
    { name: "Reports", path: "/reports", short: "R" },
  ];

  return (
    <div
      className={`h-screen bg-gray-800 text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-xl font-bold">Menu</h2>}
        <button onClick={toggleSidebar}>
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-2 text-sm">
        {menuItems.map(({ name, path, short }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`p-2 rounded hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {isCollapsed ? short : name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

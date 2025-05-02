import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import SalesPerson from "./pages/SalesPerson";
import Sidebar from "./pages/Sidebar";
import { useEffect } from "react";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import ReportPage from "./pages/ReportPage";
import RootRedirect from "./pages/RootRedirect";

function LayoutWithSidebar({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100 h-full">{children}</div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  // const hideSidebarRoutes = ["/", "/login", "/signup"];

  // const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Dashboard />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/salesperson"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <SalesPerson />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Customer />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/order"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <Order />
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <LayoutWithSidebar>
              <ReportPage/>
            </LayoutWithSidebar>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;


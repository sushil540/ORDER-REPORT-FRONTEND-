// RootRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []); 

  return null;
}

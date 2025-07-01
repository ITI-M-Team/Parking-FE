
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("authTokens");
    const sessionToken = sessionStorage.getItem("authTokens");

    if (localToken) {
      try {
        const tokenData = JSON.parse(localToken);
        const role = tokenData.role;

        if (role === "driver") {
          navigate("/dashboard/driver");
        } else if (role === "garage_owner") {
          navigate("/dashboard/garage");
        } else {
          navigate("/dashboard");
        }
      } catch (e) {
        console.error("Invalid local token format");
        navigate("/login");
      }
    } else if (sessionToken) {
      navigate("/login");
    } else {
      navigate("/register");
    }
  }, [navigate]);

  return null;
};

export default ProtectedRedirect;

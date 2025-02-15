import { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const validateToken = async () => {
        const accessToken = sessionStorage.getItem("accessToken"); // Consider using localStorage if needed

        if (!accessToken) {
          setIsAuthenticated(false);
          return;
        }

        try {
          console.log(accessToken)
          const response = await axios.get("http://localhost:3001/auth/validate", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log(response)

          setIsAuthenticated(response.status === 200);
        } catch (error) {
          console.error("Token validation failed:", error);
          navigate("/login");
          setIsAuthenticated(false);
        }
      };

      validateToken();
    }, []);

    useEffect(() => {
      if (isAuthenticated === false) {
        navigate("/login"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated === null) {
      return <div style={{ textAlign: "center", marginTop: "20px" }}>🔄 Verifying...</div>;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;

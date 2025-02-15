import { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const validateToken = async () => {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) {
          return handleUnauthorized();
        }

        try {
          const { status } = await axios.get("http://localhost:3001/auth/validate", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          setIsAuthenticated(status === 200);
        } catch (error) {
          console.error("Token validation failed:", error);
          handleUnauthorized();
        }
      };

      const handleUnauthorized = () => {
        setIsAuthenticated(false);
        navigate("/login");
      };

      validateToken();
    }, [navigate]);

    if (isAuthenticated === null) {
      return <div style={{ textAlign: "center", marginTop: "20px" }}>🔄 Verifying...</div>;
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;

import { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
      null
    );

    useEffect(() => {
      const validateToken = async () => {
        const accessToken = sessionStorage.getItem("accessToken");

        if (!accessToken) return redirectToLogin();

        try {
          const response = await axios.get(
            "http://localhost:3001/auth/validate",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          setIsAuthenticated(response.status === 200);
        } catch (error) {
          console.error("Token validation failed:", error);
          redirectToLogin();
        }
      };

      const redirectToLogin = () => {
        setIsAuthenticated(false);
        navigate("/login");
      };

      validateToken();
    }, [navigate]);

    if (isAuthenticated === null) {
      return (
        <div className="text-center flex justify-center items-center h-screen ">
          <LoadingSpinner />
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return AuthenticatedComponent;
};

export default withAuth;

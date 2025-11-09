import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Optional: Log the 404 error for monitoring
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="mb-4 text-6xl font-extrabold text-gray-900 dark:text-white">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>
        <p className="mb-8 text-md text-gray-500 dark:text-gray-400">
          The page you are looking for ({location.pathname}) does not exist or has been moved.
        </p>

        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white flex items-center mx-auto"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Home
        </Button>

        <p className="mt-6 text-sm text-muted-foreground">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
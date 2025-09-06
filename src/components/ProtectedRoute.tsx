import { useAuth } from "@/contexts/AuthContext";
import { LoginPage } from "./LoginPage";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log(
    "🛡️ ProtectedRoute: Loading:",
    loading,
    "User:",
    user ? "Authenticated" : "Not authenticated"
  );

  if (loading) {
    console.log("⏳ ProtectedRoute: Showing loading screen...");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("🔑 ProtectedRoute: No user found, showing login page...");
    return <LoginPage />;
  }

  console.log(
    "✅ ProtectedRoute: User authenticated, showing protected content..."
  );
  return <>{children}</>;
};

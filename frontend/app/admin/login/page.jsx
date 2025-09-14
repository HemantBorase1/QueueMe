"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const isValid = await api.validateToken();
        if (isValid) {
          router.push("/admin/dashboard");
          return;
        }
      }
      setIsValidating(false);
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const { token } = await api.adminLogin(credentials);
      
      if (token) {
        localStorage.setItem("admin_token", token);
        // Redirect to dashboard after successful login
        router.push("/admin/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4 sm:p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg sm:text-xl">Q</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Admin Login</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                className="h-10 sm:h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="h-10 sm:h-11"
                required
              />
            </div>

            {error && (
              <div className="p-3 sm:p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 text-sm sm:text-base" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">Demo Credentials</p>
              <p className="text-xs sm:text-sm text-blue-700">
                Username: <span className="font-mono font-bold">admin</span>
              </p>
              <p className="text-xs sm:text-sm text-blue-700">
                Password: <span className="font-mono font-bold">password123</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

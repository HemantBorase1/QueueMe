"use client";
import { useState } from "react";
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
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { token } = await api.adminLogin(credentials);
      localStorage.setItem("admin_token", token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

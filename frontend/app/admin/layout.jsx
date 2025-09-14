"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { api } from "@/lib/api";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("admin_token");
      const isLoginPage = pathname === "/admin/login";
      
      if (!token) {
        if (!isLoginPage) {
          router.push("/admin/login");
        }
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      if (isLoginPage) {
        // If on login page but has token, validate it
        const isValid = await api.validateToken();
        if (isValid) {
          router.push("/admin/dashboard");
          return;
        }
      } else {
        // If not on login page, validate token
        const isValid = await api.validateToken();
        if (!isValid) {
          router.push("/admin/login");
          return;
        }
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuthentication();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If on login page, show login form without header/footer
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Show admin dashboard with header and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

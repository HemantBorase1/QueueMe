"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Waiting",
      value: stats?.waiting || 0,
      description: "Customers in queue",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      description: "Currently being served",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      description: "Served today",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled || 0,
      description: "Cancelled today",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of today's queue management
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-full ${stat.bgColor}`}>
                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${stat.color.replace('text-', 'bg-')}`}></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                <h3 className="font-medium text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                  Manage Queue
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  View and update queue status
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                <h3 className="font-medium text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                  View Records
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Check historical data
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                <h3 className="font-medium text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                  Haircut Styles
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage trending styles
                </p>
              </div>
              <div className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                <h3 className="font-medium text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                  Settings
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configure system settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Today's Summary</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Overview of today's operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm sm:text-base font-medium">Total Customers</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
                  {stats?.total || 0}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm sm:text-base font-medium">Completion Rate</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                  {stats?.total > 0 
                    ? Math.round(((stats?.completed || 0) / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm sm:text-base font-medium">Cancellation Rate</span>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">
                  {stats?.total > 0 
                    ? Math.round(((stats?.cancelled || 0) / stats.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

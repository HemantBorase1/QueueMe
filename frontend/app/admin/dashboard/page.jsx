"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3, 
  Settings, 
  Scissors, 
  FileText,
  RefreshCw,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadStats();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'queue':
        router.push('/admin/queue');
        break;
      case 'records':
        router.push('/admin/records');
        break;
      case 'styles':
        router.push('/admin/haircut-styles');
        break;
      case 'settings':
        router.push('/admin/settings');
        break;
      default:
        break;
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
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      description: "Currently being served",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      gradient: "from-amber-50 to-amber-100",
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      description: "Served today",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      gradient: "from-green-50 to-green-100",
    },
    {
      title: "Cancelled",
      value: stats?.cancelled || 0,
      description: "Cancelled today",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      gradient: "from-red-50 to-red-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Overview of today's queue management
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-300 border-l-4 ${stat.borderColor} hover:scale-105`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor} shadow-sm`}>
                  <IconComponent className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {stat.description}
                </p>
                <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`}
                    style={{ 
                      width: `${stats?.total > 0 ? (stat.value / stats.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div 
                className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/20 cursor-pointer transition-all duration-200 group"
                onClick={() => handleQuickAction('queue')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                    Manage Queue
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  View and update queue status
                </p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/20 cursor-pointer transition-all duration-200 group"
                onClick={() => handleQuickAction('records')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                    View Records
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Check historical data
                </p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/20 cursor-pointer transition-all duration-200 group"
                onClick={() => handleQuickAction('styles')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Scissors className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                    Haircut Styles
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Manage trending styles
                </p>
              </div>
              
              <div 
                className="p-4 border rounded-lg hover:bg-primary/5 hover:border-primary/20 cursor-pointer transition-all duration-200 group"
                onClick={() => handleQuickAction('settings')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">
                    Settings
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configure system settings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Today's Summary
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Overview of today's operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base font-medium">Total Customers</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {stats?.total || 0}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm sm:text-base font-medium">Completion Rate</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats?.total > 0 
                    ? Math.round(((stats?.completed || 0) / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm sm:text-base font-medium">Cancellation Rate</span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-red-600">
                  {stats?.total > 0 
                    ? Math.round(((stats?.cancelled || 0) / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              
              {/* Progress bar for completion rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Progress</span>
                  <span className="font-medium">
                    {stats?.completed || 0} of {stats?.total || 0} completed
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                    style={{ 
                      width: `${stats?.total > 0 ? ((stats?.completed || 0) / stats.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

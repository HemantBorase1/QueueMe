"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [dailyLimit, setDailyLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.updateDailyLimit(dailyLimit);
      setMessage("Daily limit updated successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Queue Limit</CardTitle>
            <CardDescription>
              Set the maximum number of customers allowed per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyLimit">Maximum Customers per Day</Label>
                <Input
                  id="dailyLimit"
                  type="number"
                  min="1"
                  max="1000"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  placeholder="Enter daily limit"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  This limit prevents overbooking and helps manage barber capacity
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Daily Limit"}
              </Button>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes("Error") 
                    ? "bg-red-50 text-red-800 border border-red-200" 
                    : "bg-green-50 text-green-800 border border-green-200"
                }`}>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Current system configuration and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Daily Limit</span>
                <span className="text-lg font-bold">{dailyLimit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Status</span>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">SMS Notifications</span>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Enabled
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">About Daily Limits</h4>
              <p className="text-sm text-muted-foreground">
                The daily limit helps ensure quality service by preventing overbooking. 
                When the limit is reached, new customers will be informed that the queue is full 
                and they should try again the next day.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>
            More configuration options (coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">SMS Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure Twilio SMS settings for notifications
              </p>
              <Button variant="outline" size="sm" className="mt-2" disabled>
                Configure
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Business Hours</h3>
              <p className="text-sm text-muted-foreground">
                Set operating hours and availability
              </p>
              <Button variant="outline" size="sm" className="mt-2" disabled>
                Configure
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Service Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Manage service prices and duration
              </p>
              <Button variant="outline" size="sm" className="mt-2" disabled>
                Configure
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Configure notification preferences
              </p>
              <Button variant="outline" size="sm" className="mt-2" disabled>
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

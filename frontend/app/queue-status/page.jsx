"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function QueueStatusPage() {
  const [mobile, setMobile] = useState("");
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkStatus = async (e) => {
    e.preventDefault();
    if (!mobile.trim()) return;

    setLoading(true);
    setError("");
    setQueueData(null);

    try {
      const data = await api.getQueueStatus(mobile);
      setQueueData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelQueue = async () => {
    if (!mobile.trim()) return;

    setLoading(true);
    try {
      await api.cancelQueue(mobile);
      setQueueData(null);
      setError("Queue cancelled successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Check Queue Status
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                Enter your mobile number to check your position in the queue
              </p>
            </div>

            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Queue Status</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Enter your mobile number to check your current position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={checkStatus} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="h-10 sm:h-11"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-10 sm:h-11 text-sm sm:text-base" 
                    disabled={loading}
                  >
                    {loading ? "Checking..." : "Check Status"}
                  </Button>
                </form>

                {error && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                    {error}
                  </div>
                )}

                {queueData && (
                  <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                    <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3 sm:mb-4 text-base sm:text-lg">
                        Queue Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-green-700 font-medium">Queue Number:</span>
                          <span className="font-bold text-green-900">{queueData.queueNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-green-700 font-medium">Position:</span>
                          <span className="font-bold text-green-900">{queueData.position}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-green-700 font-medium">Status:</span>
                          <span className="font-bold text-green-900 capitalize">{queueData.status}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-green-700 font-medium">Estimated Wait:</span>
                          <span className="font-bold text-green-900">{queueData.estimatedWait} minutes</span>
                        </div>
                        {queueData.service && (
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:col-span-2">
                            <span className="text-green-700 font-medium">Service:</span>
                            <span className="font-bold text-green-900">{queueData.service.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {queueData.status === 'waiting' && (
                      <Button 
                        variant="destructive" 
                        className="w-full h-10 sm:h-11 text-sm sm:text-base"
                        onClick={cancelQueue}
                        disabled={loading}
                      >
                        Cancel Queue
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

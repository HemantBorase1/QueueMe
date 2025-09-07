"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function AdminQueuePage() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadQueues();
  }, [statusFilter]);

  const loadQueues = async () => {
    try {
      const data = await api.getQueue(statusFilter);
      setQueues(data);
    } catch (error) {
      console.error("Failed to load queues:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (queueId, newStatus) => {
    try {
      await api.updateQueueStatus(queueId, newStatus);
      loadQueues(); // Reload the queue list
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
          Queue Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage customer queue and update status
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Queue List</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Current queue status and customer information
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 sm:h-10"
              >
                <option value="all">All Status</option>
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <Button onClick={loadQueues} variant="outline" size="sm" className="h-9 sm:h-10">
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Queue #</TableHead>
                  <TableHead className="text-xs sm:text-sm">Customer</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Mobile</TableHead>
                  <TableHead className="text-xs sm:text-sm">Service</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Check-in Time</TableHead>
                  <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queues.map((queue) => (
                  <TableRow key={queue._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-sm sm:text-base">
                      {queue.queueNumber}
                    </TableCell>
                    <TableCell className="text-sm sm:text-base">
                      <div>
                        <div className="font-medium">{queue.user?.name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {queue.user?.mobile || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm sm:text-base hidden sm:table-cell">
                      {queue.user?.mobile || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm sm:text-base">
                      <div>
                        <div className="font-medium">{queue.service?.name || 'N/A'}</div>
                        {queue.service?.duration && (
                          <div className="text-xs text-muted-foreground">
                            {queue.service.duration} min
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(queue.status)}`}>
                        {queue.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                      {new Date(queue.checkInTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        {queue.status === 'waiting' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(queue._id, 'in-progress')}
                            className="h-7 sm:h-8 text-xs"
                          >
                            Start
                          </Button>
                        )}
                        {queue.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateStatus(queue._id, 'completed')}
                            className="h-7 sm:h-8 text-xs"
                          >
                            Complete
                          </Button>
                        )}
                        {(queue.status === 'waiting' || queue.status === 'in-progress') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(queue._id, 'cancelled')}
                            className="h-7 sm:h-8 text-xs"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {queues.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-3">📋</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Queue Entries</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                No queue entries found for the selected filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    serviceId: "",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number";
    }
    
    if (!formData.serviceId) {
      newErrors.serviceId = "Please select a service";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      const result = await api.joinQueue(formData);
      setMessage(`✅ Successfully joined the queue! Your queue number is ${result.queueNumber}. Estimated wait time: ${result.estimatedWaitTime} minutes.`);
      setFormData({ name: "", mobile: "", serviceId: "" });
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                Welcome to QueueMe
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
                Professional barbershop queue management system
              </p>
            </div>

            {/* Services Grid */}
            <div className="mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">
                Our Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {services.map((service) => (
                  <Card 
                    key={service._id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      formData.serviceId === service._id 
                        ? "ring-2 ring-primary shadow-lg scale-105" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleInputChange("serviceId", service._id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg line-clamp-2">
                        {service.name}
                      </CardTitle>
                      {service.description && (
                        <CardDescription className="text-sm line-clamp-2">
                          {service.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          ${service.price}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full self-start sm:self-auto">
                          {service.duration} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Join Queue Form */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <Card className="order-2 xl:order-1">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">Join the Queue</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Fill in your details to join our barbershop queue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        className={`h-10 sm:h-11 ${errors.name ? "border-destructive" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-medium">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        placeholder="Enter your mobile number"
                        className={`h-10 sm:h-11 ${errors.mobile ? "border-destructive" : ""}`}
                      />
                      {errors.mobile && (
                        <p className="text-sm text-destructive">{errors.mobile}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceId" className="text-sm font-medium">Service *</Label>
                      <Select
                        id="serviceId"
                        value={formData.serviceId}
                        onChange={(e) => handleInputChange("serviceId", e.target.value)}
                        className={`h-10 sm:h-11 ${errors.serviceId ? "border-destructive" : ""}`}
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.name} - ${service.price} ({service.duration} min)
                          </option>
                        ))}
                      </Select>
                      {errors.serviceId && (
                        <p className="text-sm text-destructive">{errors.serviceId}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-10 sm:h-11 text-sm sm:text-base" 
                      disabled={loading}
                    >
                      {loading ? "Joining Queue..." : "Join Queue"}
                    </Button>

                    {message && (
                      <div className={`p-3 sm:p-4 rounded-md text-sm ${
                        message.startsWith("✅") 
                          ? "bg-green-50 text-green-800 border border-green-200" 
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}>
                        {message}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              <Card className="order-1 xl:order-2">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl">How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-medium">
                        1
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base">Choose Your Service</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Select from our professional barbershop services
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-medium">
                        2
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base">Join the Queue</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Get your queue number and estimated wait time
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-base font-medium">
                        3
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base">Get Notified</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Receive SMS updates about your queue status
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">📱 Real-time Updates</h4>
                    <p className="text-xs sm:text-sm text-blue-800">
                      We'll send you SMS notifications when your turn is approaching and when you're up next.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

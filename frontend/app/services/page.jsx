"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading services...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Our Services
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional barbershop services tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service) => (
                <Card 
                  key={service._id} 
                  className="hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                    {service.description && (
                      <CardDescription className="text-sm line-clamp-3">
                        {service.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-bold text-primary">
                          ${service.price}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full self-start sm:self-auto">
                          {service.duration} min
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Professional service with experienced barbers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {services.length === 0 && (
              <div className="text-center py-12 sm:py-16 lg:py-20">
                <div className="text-6xl mb-4">✂️</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No Services Available</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Check back later for our available services.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

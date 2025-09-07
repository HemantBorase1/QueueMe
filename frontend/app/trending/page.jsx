"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function TrendingPage() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingStyles();
  }, []);

  const loadTrendingStyles = async () => {
    try {
      const data = await api.getHaircutStyles(true);
      setStyles(data);
    } catch (error) {
      console.error("Failed to load trending styles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading trending styles...</p>
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Trending Haircut Styles
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the latest and most popular haircut styles
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {styles.map((style) => (
                <Card 
                  key={style._id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 group"
                >
                  <div className="aspect-square relative overflow-hidden">
                    {style.image ? (
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl sm:text-5xl mb-2">✂️</div>
                          <p className="text-xs sm:text-sm text-muted-foreground">No Image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                        Trending
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {style.name}
                    </h3>
                    {style.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
                        {style.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {styles.length === 0 && (
              <div className="text-center py-12 sm:py-16 lg:py-20">
                <div className="text-6xl sm:text-7xl mb-4">✂️</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">
                  No Trending Styles
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                  Check back later for the latest trending haircut styles.
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

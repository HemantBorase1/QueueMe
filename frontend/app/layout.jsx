import "./globals.css";

export const metadata = {
  title: "QueueMe - Barbershop Queue Management",
  description: "Professional barbershop queue management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

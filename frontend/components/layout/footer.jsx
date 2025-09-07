export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">Q</span>
              </div>
              <span className="font-bold text-sm sm:text-base">QueueMe</span>
            </div>
            <p className="text-center text-xs sm:text-sm text-muted-foreground sm:text-left">
              © {new Date().getFullYear()} QueueMe. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>Professional Barbershop Queue Management</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LoadingSpinner({ size = "default", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-sm sm:text-base text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function LoadingCard({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8 sm:p-12">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3 sm:mb-4" />
        <p className="text-xs sm:text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

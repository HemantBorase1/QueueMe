import { Button } from "./button";

export function ErrorMessage({ message, onRetry, className = "" }) {
  return (
    <div className={`p-3 sm:p-4 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20 ${className}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="text-destructive text-base sm:text-lg">⚠️</div>
        <div className="flex-1">
          <p className="font-medium mb-1">Error</p>
          <p>{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2 h-7 sm:h-8 text-xs"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorPage({ message = "Something went wrong", onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl sm:text-7xl mb-4">😞</div>
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="h-9 sm:h-10">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export function ErrorCard({ message = "Something went wrong", onRetry }) {
  return (
    <div className="text-center p-6 sm:p-8">
      <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">😞</div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">Error</h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" className="h-8 sm:h-9">
          Try Again
        </Button>
      )}
    </div>
  );
}

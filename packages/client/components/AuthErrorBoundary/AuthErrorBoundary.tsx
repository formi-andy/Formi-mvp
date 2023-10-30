"use client";

import { ConvexError } from "convex/values";
import { ErrorBoundary } from "react-error-boundary";
import NotFoundPage from "@/app/not-found";

function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  if (error instanceof ConvexError) {
    switch ((error.data as { code: number }).code) {
      case 404:
        return <NotFoundPage />;
      case 401:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>You are not authorized</pre>
          </div>
        );
      default:
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.data.message}</pre>
          </div>
        );
    }
  }

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export default function AuthErrorBoundary({ children }) {
  const logError = (error: Error, info: { componentStack: string }) => {
    // console.log(error);
  };

  return (
    <ErrorBoundary fallbackRender={fallbackRender} onError={logError}>
      {children}
    </ErrorBoundary>
  );
}

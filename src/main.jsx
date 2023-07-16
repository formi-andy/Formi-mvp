import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomePage,
  RecordPage,
  SignInPage,
  SignUpPage,
  UploadPage,
  ViewPage,
  NotFoundPage,
  // LoaderPage,
} from "./pages";
import { FirebaseAuthProvider } from "./contexts/FirebaseAuth";
import { ProtectedRoute, SignedInRoute, AuthPageShell } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    // loader: <LoaderPage />,
    element: <HomePage />,
  },
  {
    path: "/record",
    // loader: <LoaderPage />,
    element: (
      <ProtectedRoute>
        <RecordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signin",
    // loader: <LoaderPage />,
    element: (
      <SignedInRoute>
        <AuthPageShell>
          <SignInPage />
        </AuthPageShell>
      </SignedInRoute>
    ),
  },
  {
    path: "/signup",
    // loader: <LoaderPage />,
    element: (
      <SignedInRoute>
        <AuthPageShell>
          <SignUpPage />
        </AuthPageShell>
      </SignedInRoute>
    ),
  },
  {
    path: "/upload",
    // loader: <LoaderPage />,
    element: (
      <ProtectedRoute>
        <UploadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/view",
    // loader: <LoaderPage />,
    element: (
      <ProtectedRoute>
        <ViewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    // loader: <LoaderPage />,
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FirebaseAuthProvider>
      <RouterProvider router={router} />
    </FirebaseAuthProvider>
  </React.StrictMode>
);

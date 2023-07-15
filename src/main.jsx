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
} from "./pages";
import { FirebaseAuthProvider } from "./contexts/FirebaseAuth";
import { ProtectedRoute, SignedInRoute, AuthPageShell } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/record",
    element: (
      <ProtectedRoute>
        <RecordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signin",
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
    element: (
      <ProtectedRoute>
        <UploadPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/view",
    element: (
      <ProtectedRoute>
        <ViewPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
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

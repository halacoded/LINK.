import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import HomePage from "./pages/HomePage";
import DashboradPage from "./pages/DashboradPage";
import ProfilePage from "./pages/ProfilePage";
import PredictionsPage from "./pages/PredictionsPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import "./index.css";

const queryClient = new QueryClient();
//All Routers Works (Done)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/complete-profile", element: <CompleteProfilePage /> },
      { path: "/UpdateProfile", element: <UpdateProfilePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/dashboard", element: <DashboradPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/predictions", element: <PredictionsPage /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();

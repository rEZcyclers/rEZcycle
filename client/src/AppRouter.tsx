// import react router
import { createBrowserRouter, Outlet } from "react-router-dom";

// import pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import { RouterErrorBoundary } from "./components/ErrorBoundary";

function RootOutlet() {
  return <Outlet />;
}

// App router logic
export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootOutlet />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "history",
        element: <HistoryPage />,
      },
    ],
  },
]);

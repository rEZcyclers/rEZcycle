// import react router
import { createBrowserRouter } from "react-router-dom";

// import pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import FriendsPage from "./pages/FriendsPage";
import CalendarPage from "./pages/CalendarPage";

// App router logic
export const AppRouter = createBrowserRouter([
  {
    path: "/",
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
  {
    path: "friends",
    element: <FriendsPage />,
  },
  {
    path: "Calendar",
    element: <CalendarPage />,
  },
]);

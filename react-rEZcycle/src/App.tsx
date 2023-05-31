import { CssBaseline, createTheme } from "@mui/material";
import Base from "./components/Base";
import HomePage from "./pages/HomePage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { createContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import HistoryPage from "./pages/HistoryPage";
import FriendsPage from "./pages/FriendsPage";
import CalendarPage from "./pages/CalendarPage";

// const theme = createTheme({
//   palette: {
//     background: {
//       default: "#FCFFFA",
//     },
//   },
// });

const router = createBrowserRouter([
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

// For handling loginStatus
export const loginContext = createContext<Session | null>(null);

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setLoginStatus(session);
    });
    console.log("useEffect called");
    return () => subscription.data.subscription.unsubscribe();
  }, [loginStatus]);

  return (
    <loginContext.Provider value={loginStatus}>
      <RouterProvider router={router} />
    </loginContext.Provider>
  );
}

export default App;

// import elements for react routing & sharing of state
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// import pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import FriendsPage from "./pages/FriendsPage";
import CalendarPage from "./pages/CalendarPage";

// App router logic
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

// loginContext object allows for sharing of state globally as seen later on
export const loginContext = createContext<Session | null>(null);

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);

  // useEffect to keep track of loginStatus changes using supabase auth feature
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setLoginStatus(session);
    });
    console.log("loginStatus changed");
    return () => subscription.data.subscription.unsubscribe();
  }, [loginStatus]);

  return (
    // Make loginStatus glboally available to all pages via loginContext object
    <loginContext.Provider value={loginStatus}>
      <RouterProvider router={router} />
    </loginContext.Provider>
  );
}

export default App;

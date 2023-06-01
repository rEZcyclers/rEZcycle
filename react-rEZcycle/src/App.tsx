// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

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
  }, []); // Note: infinite useEffect() call occurs when loginStatus != null if
  // loginStatus is included in dependency

  return (
    // Make loginStatus glboally available to all pages via loginContext object
    <loginContext.Provider value={loginStatus}>
      <RouterProvider router={AppRouter} />
    </loginContext.Provider>
  );
}

export default App;

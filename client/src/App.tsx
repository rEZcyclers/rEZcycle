// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// loginContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);
  const [backendData, setBackendData] = useState<any>([]);

  // useEffect to keep track of loginStatus changes using supabase auth feature
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setLoginStatus(session);
    });
    console.log("loginStatus changed");
    return () => subscription.data.subscription.unsubscribe();
  }, []); // Note: infinite useEffect() call occurs when loginStatus != null if
  // loginStatus is included in dependency

  // useEffect to fetch all backend data upon initialising App
  useEffect(() => {
    fetch("http://localhost:8000/api")
      .then((res) => res.json())
      .then((data) => setBackendData(data))
      .then(() => console.log("backendData fetched"))
      .catch((e) => console.log(e));
  }, []);

  return (
    // Make loginStatus & backendData globally available to all pages via loginContext object
    <backendContext.Provider value={{ loginStatus, backendData }}>
      <RouterProvider router={AppRouter} />
    </backendContext.Provider>
  );
}

export default App;

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
  const [recyclablesData, setRecyclablesData] = useState<any>([]);
  const [donatablesData, setDonatablesData] = useState<any>([]);
  const [eWasteData, setEWasteData] = useState<any>([]);

  // useEffect to keep track of loginStatus changes using supabase auth feature
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setLoginStatus(session);
      console.log(event);
    });
    console.log("loginStatus changed");
    // return a clean up function to clear the previous effect before the new one
    return () => subscription.data.subscription.unsubscribe();
  }, []); // Note: infinite useEffect() call occurs when loginStatus != null if
  // loginStatus is included in dependency

  // useEffect to fetch all backend data upon initialising App
  useEffect(() => {
    fetch("http://localhost:8000/recyclables")
      .then((res) => res.json())
      .then((data) => setRecyclablesData(data))
      .then(() => console.log("recyclablesData fetched"))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/donatables")
      .then((res) => res.json())
      .then((data) => setDonatablesData(data))
      .then(() => console.log("donatablesData fetched"))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/eWaste")
      .then((res) => res.json())
      .then((data) => setEWasteData(data))
      .then(() => console.log("eWasteData fetched"))
      .catch((e) => console.log(e));
  }, []);

  return (
    // Make loginStatus & backend data globally available to all pages via backendContext object
    <backendContext.Provider
      value={{
        loginStatus,
        recyclablesData,
        donatablesData,
        eWasteData,
      }}
    >
      <RouterProvider router={AppRouter} />
    </backendContext.Provider>
  );
}

export default App;

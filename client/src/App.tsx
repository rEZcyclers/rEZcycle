// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// backendContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);

// Defining types
export type RecyclableItem = {
  recyclable_id: number;
  material: string;
  name: string;
  bluebin_eligibility: number;
  checklist: string;
};

export type DonatableItem = {
  donatable_id: number;
  donatable_type: string;
  description: string;
};

export type EWasteItem = {
  eWaste_id: number;
  eWaste_type: string;
  description: string;
};

export type DonateLocation = {
  donate_id: number;
  organisation_name: string;
  address: string;
  contact: string;
  reuse_channel: string;
};

export type RepairLocation = {
  repair_id: number;
  center_name: string;
  stall_number: string;
  repair_type: string;
};

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);
  const [recyclablesData, setRecyclablesData] = useState<RecyclableItem[]>([]);
  const [donatablesData, setDonatablesData] = useState<DonatableItem[]>([]);
  const [eWasteData, setEWasteData] = useState<EWasteItem[]>([]);
  const [donateLocData, setDonateLocData] = useState<DonateLocation[]>([]);
  const [repairLocData, setRepairLocData] = useState<RepairLocation[]>([]);

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

  // useEffect to fetch all backend data directly from Supabase instead of server for now
  useEffect(() => {
    const fetchRecyclablesData = async () => {
      const { data, error } = await supabase.from("Recyclables").select();
      if (data) {
        setRecyclablesData(data);
        console.log("recyclablesData fetched");
      } else {
        console.log(error);
      }
    };
    fetchRecyclablesData();
  }, []);

  useEffect(() => {
    const fetchDonatablesData = async () => {
      const { data, error } = await supabase.from("Donatables").select();
      if (data) {
        setDonatablesData(data);
        console.log("donatablesData fetched");
      } else {
        console.log(error);
      }
    };
    fetchDonatablesData();
  }, []);

  useEffect(() => {
    const fetchEWasteData = async () => {
      const { data, error } = await supabase.from("EWaste").select();
      if (data) {
        setEWasteData(data);
        console.log("eWasteData fetched");
      } else {
        console.log(error);
      }
    };
    fetchEWasteData();
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

// Old useEffect() to retrieve data from server
// useEffect(() => {
//   fetch("http://localhost:8000/recyclables")
//     .then((res) => res.json())
//     .then((data) => setRecyclablesData(data))
//     .then(() => console.log("recyclablesData fetched"))
//     .catch((e) => console.log(e));
// }, []);

// useEffect(() => {
//   fetch("http://localhost:8000/donatables")
//     .then((res) => res.json())
//     .then((data) => setDonatablesData(data))
//     .then(() => console.log("donatablesData fetched"))
//     .catch((e) => console.log(e));
// }, []);

// useEffect(() => {
//   fetch("http://localhost:8000/eWaste")
//     .then((res) => res.json())
//     .then((data) => setEWasteData(data))
//     .then(() => console.log("eWasteData fetched"))
//     .catch((e) => console.log(e));
// }, []);

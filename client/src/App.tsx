// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
// import {
//   RecyclableItem,
//   DonatableItem,
//   EWasteItem,
//   DonateLocation,
//   RepairLocation,
//   DDLoc,
//   DRLoc,
//   EDLoc,
//   ERLoc,
// } from "./DataTypes";

// backendContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);
  const [recyclablesData, setRecyclablesData] = useState<
    { [x: string]: any }[]
  >([]);
  const [donatablesData, setDonatablesData] = useState<{ [x: string]: any }[]>(
    []
  );
  const [eWasteData, setEWasteData] = useState<{ [x: string]: any }[]>([]);
  const [donateLocData, setDonateLocData] = useState<{ [x: string]: any }[]>(
    []
  );
  const [repairLocData, setRepairLocData] = useState<{ [x: string]: any }[]>(
    []
  );
  const [DDLocData, setDDLocData] = useState<{ [x: string]: any }[]>([]);
  const [DRLocData, setDRLocData] = useState<{ [x: string]: any }[]>([]);
  const [EDLocData, setEDLocData] = useState<{ [x: string]: any }[]>([]);
  const [ERLocData, setERLocData] = useState<{ [x: string]: any }[]>([]);

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

  // Below are all the async functions needed for fetching backend data.
  // 'data' is set to a default type from supabase which causes the type
  // mismatch warning, but types are actually assignable and work, need to
  // find some way to suppress the warning
  const fetchRecyclablesData = async () => {
    const { data, error } = await supabase.from("Recyclables").select();
    if (data) {
      setRecyclablesData(data);
      console.log("recyclablesData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchDonatablesData = async () => {
    const { data, error } = await supabase.from("Donatables").select();
    if (data) {
      setDonatablesData(data);
      console.log("donatablesData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchEWasteData = async () => {
    const { data, error } = await supabase.from("EWaste").select();
    if (data) {
      setEWasteData(data);
      console.log("eWasteData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchDonateLocationsData = async () => {
    const { data, error } = await supabase.from("DonateLocations").select();
    if (data) {
      setDonateLocData(data);
      console.log("donateLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchRepairLocationsData = async () => {
    const { data, error } = await supabase.from("RepairLocations").select();
    if (data) {
      setRepairLocData(data);
      console.log("repairLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchDDLocationsData = async () => {
    const { data, error } = await supabase
      .from("DonatablesDonateLocations")
      .select();
    if (data) {
      setDDLocData(data);
      console.log("donatablesDonateLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchDRLocationsData = async () => {
    const { data, error } = await supabase
      .from("DonatablesRepairLocations")
      .select();
    if (data) {
      setDRLocData(data);
      console.log("donatablesRepairLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchEDLocationsData = async () => {
    const { data, error } = await supabase
      .from("EWasteDonateLocations")
      .select();
    if (data) {
      setEDLocData(data);
      console.log("eWasteDonateLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  const fetchERLocationsData = async () => {
    const { data, error } = await supabase
      .from("EWasteRepairLocations")
      .select();
    if (data) {
      setERLocData(data);
      console.log("eWasteRepairLocationsData fetched");
    } else {
      console.log(error);
    }
  };
  function fetchBackendData() {
    fetchRecyclablesData();
    fetchDonatablesData();
    fetchEWasteData();
    fetchDonateLocationsData();
    fetchRepairLocationsData();
    fetchDDLocationsData();
    fetchDRLocationsData();
    fetchEDLocationsData();
    fetchERLocationsData();
  }

  // useEffect to fetch all backend data directly from Supabase instead of server upon initialisation
  useEffect(() => fetchBackendData(), []);

  return (
    // Make loginStatus & backend data globally available to all pages via backendContext object
    <backendContext.Provider
      value={{
        loginStatus,
        recyclablesData,
        donatablesData,
        eWasteData,
        donateLocData,
        repairLocData,
        DDLocData,
        DRLocData,
        EDLocData,
        ERLocData,
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

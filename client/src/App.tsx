// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  RecyclableItem,
  DonatableItem,
  EWasteItem,
  DonateLocation,
  RepairLocation,
  DDLoc,
  DRLoc,
  EDLoc,
  ERLoc,
} from "./DataTypes";

// backendContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);
const serverAPI = "https://rezcycle-server.onrender.com/";

function App() {
  const [loginStatus, setLoginStatus] = useState<Session | null>(null);
  const [recyclablesData, setRecyclablesData] = useState<RecyclableItem[]>([]);
  const [donatablesData, setDonatablesData] = useState<DonatableItem[]>([]);
  const [eWasteData, setEWasteData] = useState<EWasteItem[]>([]);
  const [donateLocData, setDonateLocData] = useState<DonateLocation[]>([]);
  const [repairLocData, setRepairLocData] = useState<RepairLocation[]>([]);
  const [DDLocData, setDDLocData] = useState<DDLoc[]>([]);
  const [DRLocData, setDRLocData] = useState<DRLoc[]>([]);
  const [EDLocData, setEDLocData] = useState<EDLoc[]>([]);
  const [ERLocData, setERLocData] = useState<ERLoc[]>([]);

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

  // useEffect to fetch all backend data from backend server
  function fetchBackendData() {
    fetch(`${serverAPI}/recyclables`)
      .then((res) => res.json())
      .then((data) => setRecyclablesData(data))
      .then(() => console.log("recyclablesData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donatables`)
      .then((res) => res.json())
      .then((data) => setDonatablesData(data))
      .then(() => console.log("donatablesData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/eWaste`)
      .then((res) => res.json())
      .then((data) => setEWasteData(data))
      .then(() => console.log("eWasteData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donateLocations`)
      .then((res) => res.json())
      .then((data) => setDonateLocData(data))
      .then(() => console.log("donateLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/repairLocations`)
      .then((res) => res.json())
      .then((data) => setRepairLocData(data))
      .then(() => console.log("repairLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donatablesDonateLocations`)
      .then((res) => res.json())
      .then((data) => setDDLocData(data))
      .then(() => console.log("donatablesDonateLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donatablesRepairLocations`)
      .then((res) => res.json())
      .then((data) => setDRLocData(data))
      .then(() => console.log("donatablesRepairLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/eWasteDonateLocations`)
      .then((res) => res.json())
      .then((data) => setEDLocData(data))
      .then(() => console.log("eWasteDonateLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/eWasteRepairLocations`)
      .then((res) => res.json())
      .then((data) => setERLocData(data))
      .then(() => console.log("eWasteRepairLocationsData fetched"))
      .catch((err) => console.log(err));
  }

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

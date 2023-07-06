// import elements for react routing & sharing of state
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { createContext, useEffect, useState } from "react";

// import supabase database
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import {
  UserProfile,
  RecyclableItem,
  DonatableItem,
  EwasteItem,
  DonateOrganisation,
  DonateLocation,
  RepairLocation,
  Ebin,
  EbinLocation,
  DDOrg,
  DRLoc,
  EDOrg,
  ERLoc,
  EE,
} from "./DataTypes";

// backendContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);
const serverAPI = "https://rezcycle-server.onrender.com";

function App() {
  // User Profile Data
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Item Data
  const [recyclablesData, setRecyclablesData] = useState<RecyclableItem[]>([]);
  const [donatablesData, setDonatablesData] = useState<DonatableItem[]>([]);
  const [ewasteData, setEwasteData] = useState<EwasteItem[]>([]);

  // Location Data
  const [donateOrgData, setDonateOrgData] = useState<DonateOrganisation[]>([]);
  const [donateLocData, setDonateLocData] = useState<DonateLocation[]>([]);
  const [repairLocData, setRepairLocData] = useState<RepairLocation[]>([]);
  const [ebinData, setEbinData] = useState<Ebin[]>([]);
  const [ebinLocData, setEbinLocData] = useState<EbinLocation[]>([]);

  // Junction Table Data
  const [DDOrgData, setDDOrgData] = useState<DDOrg[]>([]);
  const [DRLocData, setDRLocData] = useState<DRLoc[]>([]);
  const [EDOrgData, setEDOrgData] = useState<EDOrg[]>([]);
  const [ERLocData, setERLocData] = useState<ERLoc[]>([]);
  const [EEData, setEEData] = useState<EE[]>([]);

  // useEffect to handle userSession changes using Supabase Auth API
  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setUserSession(session);
      fetchUserProfile(session);
      console.log(event);
    });
    // return a clean up function to clear the previous effect before the new one
    return () => subscription.data.subscription.unsubscribe();
  }, []); // Note: infinite useEffect() call occurs when userSession != null if
  // userSession is included in dependency

  // useEffect to fetch all backend data related to the main feature from server
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

    fetch(`${serverAPI}/ewaste`)
      .then((res) => res.json())
      .then((data) => setEwasteData(data))
      .then(() => console.log("ewasteData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donateOrganisations`)
      .then((res) => res.json())
      .then((data) => setDonateOrgData(data))
      .then(() => console.log("donateOrganisationsData fetched"))
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

    fetch(`${serverAPI}/ebins`)
      .then((res) => res.json())
      .then((data) => setEbinData(data))
      .then(() => console.log("ebinData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/ebinLocations`)
      .then((res) => res.json())
      .then((data) => setEbinLocData(data))
      .then(() => console.log("ebinLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donatablesDonateOrganisations`)
      .then((res) => res.json())
      .then((data) => setDDOrgData(data))
      .then(() => console.log("donatablesDonateOrganisationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/donatablesRepairLocations`)
      .then((res) => res.json())
      .then((data) => setDRLocData(data))
      .then(() => console.log("donatablesRepairLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/ewasteDonateOrganisations`)
      .then((res) => res.json())
      .then((data) => setEDOrgData(data))
      .then(() => console.log("ewasteDonateOrganisationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/ewasteRepairLocations`)
      .then((res) => res.json())
      .then((data) => setERLocData(data))
      .then(() => console.log("ewasteRepairLocationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/ewasteEbins`)
      .then((res) => res.json())
      .then((data) => setEEData(data))
      .then(() => console.log("ebinEwasteData fetched"))
      .catch((err) => console.log(err));
  }

  function fetchUserProfile(session: Session | null) {
    if (session == null) return;
    fetch(`${serverAPI}/userProfile?id=${session["user"]["id"]}`)
      .then((res) => res.json())
      .then((data) => {
        setUserProfile(data[0]);
      })
      .then(() => console.log("UserProfile fetched"))
      .catch((err) => console.log(err));
  }
  useEffect(() => fetchBackendData(), []);

  return (
    // Make userSession & backend data globally available to all pages via backendContext object
    <backendContext.Provider
      value={{
        serverAPI,
        userSession,
        userProfile,
        recyclablesData,
        donatablesData,
        ewasteData,
        donateOrgData,
        donateLocData,
        repairLocData,
        ebinData,
        ebinLocData,
        DDOrgData,
        DRLocData,
        EDOrgData,
        ERLocData,
        EEData,
      }}
    >
      <RouterProvider router={AppRouter} />
    </backendContext.Provider>
  );
}

export default App;

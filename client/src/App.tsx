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
  EWasteItem,
  DonateOrganisation,
  DonateLocation,
  RepairLocation,
  DDOrg,
  DRLoc,
  EDOrg,
  ERLoc,
} from "./DataTypes";

// backendContext object allows for sharing of state globally as seen later on
export const backendContext = createContext<any>(null);
const serverAPI = "https://rezcycle-server.onrender.com";

function App() {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recyclablesData, setRecyclablesData] = useState<RecyclableItem[]>([]);
  const [donatablesData, setDonatablesData] = useState<DonatableItem[]>([]);
  const [eWasteData, setEWasteData] = useState<EWasteItem[]>([]);
  const [donateOrgData, setDonateOrgData] = useState<DonateOrganisation[]>([]);
  const [donateLocData, setDonateLocData] = useState<DonateLocation[]>([]);
  const [repairLocData, setRepairLocData] = useState<RepairLocation[]>([]);
  const [DDOrgData, setDDOrgData] = useState<DDOrg[]>([]);
  const [DRLocData, setDRLocData] = useState<DRLoc[]>([]);
  const [EDOrgData, setEDOrgData] = useState<EDOrg[]>([]);
  const [ERLocData, setERLocData] = useState<ERLoc[]>([]);

  // useEffect to keep track of userSession changes using supabase auth feature
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

    fetch(`${serverAPI}/eWasteDonateOrganisations`)
      .then((res) => res.json())
      .then((data) => setEDOrgData(data))
      .then(() => console.log("eWasteDonateOrganisationsData fetched"))
      .catch((err) => console.log(err));

    fetch(`${serverAPI}/eWasteRepairLocations`)
      .then((res) => res.json())
      .then((data) => setERLocData(data))
      .then(() => console.log("eWasteRepairLocationsData fetched"))
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
        eWasteData,
        donateOrgData,
        donateLocData,
        repairLocData,
        DDOrgData,
        DRLocData,
        EDOrgData,
        ERLocData,
      }}
    >
      <RouterProvider router={AppRouter} />
    </backendContext.Provider>
  );
}

export default App;

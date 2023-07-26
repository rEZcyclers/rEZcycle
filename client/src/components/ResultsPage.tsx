import { useContext, useEffect, useState } from "react";
import { backendContext } from "../App";
import {
  DonatableItem,
  EwasteItem,
  RecyclableItem,
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
  DonateOrganisationLocations,
  EbinLocations,
  LocationInfo,
  UserResults,
} from "../DataTypes";
import {
  Alert,
  Box,
  Button,
  Modal,
  Snackbar,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MapLocations from "./MapLocations";
import RecyclablesResults from "./ResultsPageComponents/RecyclablesResults";
import DonatablesResults from "./ResultsPageComponents/DonatablesResults";
import EwasteResults from "./ResultsPageComponents/EwasteResults";
import SpoiltResults from "./ResultsPageComponents/SpoiltResults";
import InfoIcon from "@mui/icons-material/Info";
import AddtoCalendar from "./AddToCalendar";
import ResultsSummary from "./ResultsPageComponents/ResultsSummary";

type Condition = "Good" | "Repairable" | "Spoilt" | "";

interface Props {
  // Items selected by user to process
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  recyclableConditions: boolean[];
  donatableConditions: Condition[];
  ewasteConditions: Condition[];
  // Functions to restart the form
  setStage: (num: number) => void;
  clearForm: () => void;
}

function ResultsPage({
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  recyclableConditions,
  donatableConditions,
  ewasteConditions,
  setStage,
  clearForm,
}: Props) {
  ////////// Data needed to process results for items selected by user //////////
  const {
    recyclablesData,
    donatablesData,
    ewasteData,
    bluebinsData,
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
    serverAPI,
    userProfile,
    userSession,
  } = useContext(backendContext);

  ////////// States needed for saving the results of every selected item //////////
  ///// Recyclable items & their results /////
  const [recyclablesResults, setRecyclablesResults] = useState<
    RecyclableItem[]
  >([]); // Selected recyclables which can be disposed in blue bins
  const [unrecyclablesResults, setUnrecyclablesResults] = useState<
    RecyclableItem[]
  >([]); // Selected recyclables which CANNOT be disposed in blue bins

  ///// Donatable items & their results
  const [goodDonatables, setGoodDonatables] = useState<DonatableItem[]>([]); // Selected donatables in good condition
  const [repairDonatables, setRepairDonatables] = useState<DonatableItem[]>([]); // Selected donatables in repairable condition
  const [spoiltDonatables, setSpoiltDonatables] = useState<DonatableItem[]>([]); // Selected donatables in spoilt condition
  const [goodDonatablesResults, setGoodDonatablesResults] = useState<
    DonateOrganisationLocations[][]
  >([]); // List of donateOrganisations & their locations for every selected good donatable
  const [repairDonatablesResults, setRepairDonatablesResults] = useState<
    RepairLocation[][]
  >([]); // List of repairLocations for every selected repairable donatable

  ///// Ewaste items & their results /////
  const [allEwaste, setAllEwaste] = useState<EwasteItem[]>([]); // All selected Ewaste
  const [ebinEwaste, setEbinEwaste] = useState<EwasteItem[]>([]); // Selected Ewaste eligible for ebins
  const [regulatedEwaste, setRegulatedEwaste] = useState<EwasteItem[]>([]); // Selected Ewaste eligible for collection drives
  const [goodEwaste, setGoodEwaste] = useState<EwasteItem[]>([]); // Selected Ewaste in good condition
  const [repairEwaste, setRepairEwaste] = useState<EwasteItem[]>([]); // Selected Ewaste in repairable condition
  const [ebinEwasteResults, setEbinEwasteResults] = useState<EbinLocations[][]>(
    []
  ); // List of ebinLocations for selected Ewaste
  const [goodEwasteResults, setGoodEwasteResults] = useState<
    DonateOrganisationLocations[][]
  >([]); // List of donateLocations & their locations for every selected good Ewaste
  const [repairEwasteResults, setRepairEwasteResults] = useState<
    RepairLocation[][]
  >([]); // List of repairLocations for every selected repairable Ewaste

  ////////// User states for showing and saving preferred locations (which are closest to user location by default) //////////
  /* closestGDLoc, closestEELoc & closestGELoc won't contain null, since every donatable or good ewaste has at least
  1 place to donate to, and every ebin ewaste has at least 1 ebin to drop off at. For RD & RE items, they may not have
  any repair locations, hence closestRDLoc & closestRELoc may contain null. BB is also initially set to null.
  Whether an item has at least one result location or not is also reflected in our database schema, where donatables
  have a one to (>= 1 many) relation to donate locations, while ewaste items have a one to (>= 0 many) relation to 
  all locations, and donatatables have a one to (>= many) relation to repair locations. But GE excludes batteries by
  processing, & EE is also filtered from ewaste items, hence GE & EE items have a one to (>= 1) many relation to 
  their respective locations. Hence, overall, only RD & RE may have 0 result locations, while GD, GE & EE must have
  at least 1 result location. */
  const [userLocation, setUserLocation] = useState<number[] | null>(null);

  const [closestBBLoc, setClosestBBLoc] = useState<LocationInfo | null>(null);
  const [preferredGDLoc, setPreferredGDLoc] = useState<LocationInfo[]>([]);
  const [preferredRDLoc, setPreferredRDLoc] = useState<(LocationInfo | null)[]>(
    []
  );
  const [preferredGELoc, setPreferredGELoc] = useState<LocationInfo[]>([]);
  const [preferredRELoc, setPreferredRELoc] = useState<(LocationInfo | null)[]>(
    []
  );
  const [preferredEELoc, setPreferredEELoc] = useState<LocationInfo[]>([]);
  const [showClosest, setShowClosest] = useState(false);
  const [loaded, setLoaded] = useState(false);

  ////////// States for deciding whether to show nested list for every result item or not //////////
  const [showGDResults, setShowGDResults] = useState<boolean[]>([]);
  const [showRDResults, setShowRDResults] = useState<boolean[]>([]);
  const [showEEResults, setShowEEResults] = useState<boolean[]>([]);
  const [showGEResults, setShowGEResults] = useState<boolean[]>([]);
  const [showREResults, setShowREResults] = useState<boolean[]>([]);
  const handleShowGDResults = (index: number) => {
    setShowGDResults([
      ...showGDResults.slice(0, index),
      !showGDResults[index],
      ...showGDResults.slice(index + 1),
    ]);
  };
  const handleShowRDResults = (index: number) => {
    setShowRDResults([
      ...showRDResults.slice(0, index),
      !showRDResults[index],
      ...showRDResults.slice(index + 1),
    ]);
  };
  const handleshowEEResults = (index: number) => {
    setShowEEResults([
      ...showEEResults.slice(0, index),
      !showEEResults[index],
      ...showEEResults.slice(index + 1),
    ]);
  };
  const handleShowGEResults = (index: number) => {
    setShowGEResults([
      ...showGEResults.slice(0, index),
      !showGEResults[index],
      ...showGEResults.slice(index + 1),
    ]);
  };
  const handleShowREResults = (index: number) => {
    setShowREResults([
      ...showREResults.slice(0, index),
      !showREResults[index],
      ...showREResults.slice(index + 1),
    ]);
  };

  ////////// States for deciding whether to show map location markers for every result item or not //////////
  const [showGDMarkers, setShowGDMarkers] = useState<boolean[]>([]);
  const [showRDMarkers, setShowRDMarkers] = useState<boolean[]>([]);
  const [showEEMarkers, setShowEEMarkers] = useState<boolean[]>([]);
  const [showGEMarkers, setShowGEMarkers] = useState<boolean[]>([]);
  const [showREMarkers, setShowREMarkers] = useState<boolean[]>([]);
  const handleShowGDMarkers = (index: number) => {
    setShowGDMarkers([
      ...showGDMarkers.slice(0, index),
      !showGDMarkers[index],
      ...showGDMarkers.slice(index + 1),
    ]);
  };
  const handleShowRDMarkers = (index: number) => {
    setShowRDMarkers([
      ...showRDMarkers.slice(0, index),
      !showRDMarkers[index],
      ...showRDMarkers.slice(index + 1),
    ]);
  };
  const handleShowEEMarkers = (index: number) => {
    setShowEEMarkers([
      ...showEEMarkers.slice(0, index),
      !showEEMarkers[index],
      ...showEEMarkers.slice(index + 1),
    ]);
  };
  const handleShowGEMarkers = (index: number) => {
    setShowGEMarkers([
      ...showGEMarkers.slice(0, index),
      !showGEMarkers[index],
      ...showGEMarkers.slice(index + 1),
    ]);
  };
  const handleShowREMarkers = (index: number) => {
    setShowREMarkers([
      ...showREMarkers.slice(0, index),
      !showREMarkers[index],
      ...showREMarkers.slice(index + 1),
    ]);
  };

  ////////// Start of results processing & populating aforementioned states thereafter //////////
  /**
   * Main function to get & set the results for all items. () => void.
   */
  function getResults() {
    console.log("getResults() called");

    const recyclablesResults = selectedRecyclables
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          recyclableConditions[i] &&
          recyclablesData[i]["bluebin_eligibility"] != 0
      )
      .map((i) => recyclablesData[i]);
    setRecyclablesResults(recyclablesResults);

    const unrecyclablesResults = selectedRecyclables
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          (recyclablesData[i]["bluebin_eligibility"] === 0 ||
            !recyclableConditions[i])
      )
      .map((i) => recyclablesData[i]);
    setUnrecyclablesResults(unrecyclablesResults);

    const goodDonatables = donatableConditions
      .map((cond, i) => (selectedDonatables[i] && cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    setGoodDonatables(goodDonatables);

    const repairDonatables = donatableConditions
      .map((cond, i) =>
        selectedDonatables[i] && cond === "Repairable" ? i : -1
      )
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    setRepairDonatables(repairDonatables);

    const spoiltDonatables = donatableConditions
      .map((cond, i) => (selectedDonatables[i] && cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    setSpoiltDonatables(spoiltDonatables);

    const goodDonatablesResults = goodDonatables.map((item: DonatableItem) => {
      return DDOrgData.filter(
        (entry: DDOrg) => entry["donatable_id"] === item["donatable_id"]
      )
        .map((entry: DDOrg) => {
          return donateOrgData[entry["donateOrg_id"] - 1];
        })
        .map((org: DonateOrganisation) => {
          const locations = donateLocData.filter(
            (loc: DonateLocation) => loc["donateOrg_id"] === org["donateOrg_id"]
          );
          const res: DonateOrganisationLocations = {
            donateOrg: org,
            donateLocations: locations,
          };
          return res;
        });
    });
    setGoodDonatablesResults(goodDonatablesResults);

    const repairDonatablesResults = repairDonatables.map(
      (item: DonatableItem) => {
        return DRLocData.filter(
          (entry: DRLoc) => entry["donatable_id"] === item["donatable_id"]
        ).map((entry: DRLoc) => {
          return repairLocData[entry["repair_id"] - 1];
        });
      }
    );
    setRepairDonatablesResults(repairDonatablesResults);

    const allEwaste = selectedEwaste
      .map((sel, i) => (sel ? i : -1))
      .filter((i) => i != -1)
      .map((i) => ewasteData[i]);
    setAllEwaste(allEwaste);

    const ebinEwaste = allEwaste.filter(
      (item) => item["ewaste_id"] != 4 && item["ewaste_id"] != 5
    );
    setEbinEwaste(ebinEwaste);

    const regulatedEwaste = allEwaste.filter((item) => item["is_regulated"]);
    setRegulatedEwaste(regulatedEwaste);

    const goodEwaste = allEwaste.filter(
      (item) => ewasteConditions[item["ewaste_id"] - 1] === "Good"
    );
    setGoodEwaste(goodEwaste);

    const repairEwaste = allEwaste.filter(
      (item) => ewasteConditions[item["ewaste_id"] - 1] === "Repairable"
    );
    setRepairEwaste(repairEwaste);

    const goodEwasteResults = goodEwaste.map((item: EwasteItem) => {
      return EDOrgData.filter(
        (entry: EDOrg) => entry["ewaste_id"] === item["ewaste_id"]
      )
        .map((entry: EDOrg) => {
          return donateOrgData[entry["donateOrg_id"] - 1];
        })
        .map((org: DonateOrganisation) => {
          const locations = donateLocData.filter(
            (loc: DonateLocation) => loc["donateOrg_id"] === org["donateOrg_id"]
          );
          return {
            donateOrg: org,
            donateLocations: locations,
          };
        });
    });
    setGoodEwasteResults(goodEwasteResults);

    const repairEwasteResults = repairEwaste.map((item: EwasteItem) => {
      return ERLocData.filter(
        (entry: ERLoc) => entry["ewaste_id"] === item["ewaste_id"]
      ).map((entry: ERLoc) => {
        return repairLocData[entry["repair_id"] - 1];
      });
    });
    // .filter((result: RepairLocation[]) => result.length > 0);
    setRepairEwasteResults(repairEwasteResults);

    const ebinEwasteResults = ebinEwaste.map((item: EwasteItem) => {
      return EEData.filter(
        (entry: EE) => entry["ewaste_id"] == item["ewaste_id"]
      )
        .map((entry: EE) => {
          return ebinData[entry["ebin_id"] - 1];
        })
        .map((bin: Ebin) => {
          const locations = ebinLocData.filter(
            (loc: EbinLocation) => loc["ebin_id"] === bin["ebin_id"]
          );
          return {
            ebin: bin,
            ebinLocations: locations,
          };
        });
    });
    setEbinEwasteResults(ebinEwasteResults);
    setLoaded(true);
    console.log("Results have been processed and saved in their states");
  }

  useEffect(getResults, []); // Only process results once (upon initialisation)
  ////////// End of Results Processing //////////

  ////////// Rmb to set the states for showing results once results have loaded //////////
  function setShowResultsStates() {
    setShowGDResults(Array<boolean>(goodDonatables.length).fill(false));
    setShowGDMarkers(Array<boolean>(goodDonatables.length).fill(false));

    setShowRDResults(Array<boolean>(repairDonatables.length).fill(false));
    setShowRDMarkers(Array<boolean>(repairDonatables.length).fill(false));

    setShowGEResults(Array<boolean>(goodEwaste.length).fill(false));
    setShowGEMarkers(Array<boolean>(goodEwaste.length).fill(false));

    setShowREResults(Array<boolean>(repairEwaste.length).fill(false));
    setShowREMarkers(Array<boolean>(repairEwaste.length).fill(false));

    setShowEEResults(Array<boolean>(ebinEwaste.length).fill(false));
    setShowEEMarkers(Array<boolean>(ebinEwaste.length).fill(false));

    console.log("States for showing results have been set");
  }
  useEffect(setShowResultsStates, [loaded]);

  ////////// Button handlers //////////
  const handleBackClick = () => {
    setStage(2);
  };

  const restartQuery = () => {
    setStage(1);
    clearForm();
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [error, setError] = useState(false);
  const [showConfirmUserResults, setShowConfirmUserResults] = useState(false);
  const [userResults, setUserResults] = useState<UserResults | null>(null);

  const processUserResults = () => {
    const results: UserResults = {
      userLocation: userLocation,
      recyclables: recyclablesResults,
      closestBluebin: closestBBLoc,
      goodDonatables: goodDonatables,
      preferredGDLoc: preferredGDLoc,
      repairDonatables: repairDonatables,
      preferredRDLoc: preferredRDLoc,
      regulatedEwaste: regulatedEwaste,
      ebinEwaste: ebinEwaste,
      preferredEELoc: preferredEELoc,
      goodEwaste: goodEwaste,
      preferredGELoc: preferredGELoc,
      repairEwaste: repairEwaste,
      preferredRELoc: preferredRELoc,
      unrecyclables: unrecyclablesResults,
    };
    setUserResults(results);
  };

  const saveUserResults = () => {
    if (userResults === null) {
      setShowConfirmUserResults(false);
      setAlertMsg("Error: User Results is null");
      setError(true);
      setShowAlert(true);
      return;
    }
    fetch(`${serverAPI}/userSavedResults?id=${userProfile["user_id"]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Impt for Node server to parse json so it won't be empty
      body: JSON.stringify(userResults),
    })
      .then((res) => res.json())
      .then((data) => {
        setShowConfirmUserResults(false);
        if (data.status === 201) {
          setAlertMsg("Result saved sucessfully");
          setError(false);
          setShowAlert(true);
        } else {
          setAlertMsg(`Error ${data.status}: ${data.statusText}`);
          setError(true);
          setShowAlert(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const closeAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      console.log(event);
      return;
    }
    setShowAlert(false);
  };

  ////////// Results Component begins here //////////
  return (
    <>
      {!loaded ? (
        <span>Loading...</span>
      ) : (
        <>
          <h1 style={{ margin: 0 }}>
            Here's where to recycle / donate your items
          </h1>
          <Stack direction={"row"} alignItems={"center"} sx={{ mt: -1 }}>
            <InfoIcon sx={{ mr: 1 }} color={"info"} />
            <p>
              Input your location to see recycling/donation/repair services near
              you
            </p>
          </Stack>
          <MapLocations
            goodDonatables={goodDonatables}
            repairDonatables={repairDonatables}
            goodEwaste={goodEwaste}
            repairEwaste={repairEwaste}
            showGDMarkers={showGDMarkers}
            showRDMarkers={showRDMarkers}
            showGEMarkers={showGEMarkers}
            showREMarkers={showREMarkers}
            showEEMarkers={showEEMarkers}
            bluebinsData={bluebinsData}
            goodDonatablesResults={goodDonatablesResults}
            repairDonatablesResults={repairDonatablesResults}
            goodEwasteResults={goodEwasteResults}
            repairEwasteResults={repairEwasteResults}
            ebinEwasteResults={ebinEwasteResults}
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            closestBBLoc={closestBBLoc}
            setClosestBBLoc={setClosestBBLoc}
            setPreferredGDLoc={setPreferredGDLoc}
            setPreferredRDLoc={setPreferredRDLoc}
            setPreferredGELoc={setPreferredGELoc}
            setPreferredRELoc={setPreferredRELoc}
            setPreferredEELoc={setPreferredEELoc}
            showClosest={showClosest}
            setShowClosest={setShowClosest}
            isRecyclableSelected={recyclablesResults.length > 0}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <RecyclablesResults
              recyclablesResults={recyclablesResults}
              showClosest={showClosest}
              closestBBLoc={closestBBLoc}
            />

            <DonatablesResults
              goodDonatables={goodDonatables}
              repairDonatables={repairDonatables}
              goodDonatablesResults={goodDonatablesResults}
              repairDonatablesResults={repairDonatablesResults}
              showGDResults={showGDResults}
              handleShowGDResults={handleShowGDResults}
              showRDResults={showRDResults}
              handleShowRDResults={handleShowRDResults}
              showGDMarkers={showGDMarkers}
              handleShowGDMarkers={handleShowGDMarkers}
              showRDMarkers={showRDMarkers}
              handleShowRDMarkers={handleShowRDMarkers}
              preferredGDLoc={preferredGDLoc}
              preferredRDLoc={preferredRDLoc}
              showClosest={showClosest}
            />
            <EwasteResults
              allEwaste={allEwaste}
              ebinEwaste={ebinEwaste}
              goodEwaste={goodEwaste}
              regulatedEwaste={regulatedEwaste}
              repairEwaste={repairEwaste}
              goodEwasteResults={goodEwasteResults}
              repairEwasteResults={repairEwasteResults}
              ebinEwasteResults={ebinEwasteResults}
              showEEResults={showEEResults}
              handleshowEEResults={handleshowEEResults}
              showGEResults={showGEResults}
              handleShowGEResults={handleShowGEResults}
              showREResults={showREResults}
              handleShowREResults={handleShowREResults}
              showEEMarkers={showEEMarkers}
              handleShowEEMarkers={handleShowEEMarkers}
              showGEMarkers={showGEMarkers}
              handleShowGEMarkers={handleShowGEMarkers}
              showREMarkers={showREMarkers}
              handleShowREMarkers={handleShowREMarkers}
              preferredGELoc={preferredGELoc}
              preferredRELoc={preferredRELoc}
              preferredEELoc={preferredEELoc}
              showClosest={showClosest}
            />
          </Stack>
          <SpoiltResults
            unrecyclablesResults={unrecyclablesResults}
            spoiltDonatables={spoiltDonatables}
          />
          <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
            {userLocation != null && (
              <AddtoCalendar
                closestBBLoc={closestBBLoc}
                goodDonatables={goodDonatables}
                repairDonatables={repairDonatables}
                goodEwaste={goodEwaste}
                repairEwaste={repairEwaste}
                allEwaste={allEwaste}
                preferredGDLoc={preferredGDLoc}
                preferredRDLoc={preferredRDLoc}
                preferredGELoc={preferredGELoc}
                preferredRELoc={preferredRELoc}
                preferredEELoc={preferredEELoc}
              />
            )}
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{ mr: 5, mb: 10 }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={restartQuery}
              sx={{ mr: 5, mb: 10 }}
            >
              Start new query
            </Button>
            <Tooltip
              title={
                userLocation === null || userSession === null
                  ? "To save results, one must be logged in & have an input location."
                  : ""
              }
              arrow
            >
              <div>
                <Button
                  variant="outlined"
                  disabled={userLocation === null || userSession === null}
                  color="success"
                  onClick={() => {
                    processUserResults();
                    setShowConfirmUserResults(true);
                  }}
                  sx={{ mr: 10, mb: 10 }}
                >
                  Save results
                </Button>
              </div>
            </Tooltip>
          </Box>
          <Modal open={showConfirmUserResults}>
            <Box
              flex={1}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "70%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                flexWrap: "wrap",
                borderRadius: ".8rem",
              }}
            >
              <Toolbar
                sx={{
                  backgroundColor: "greenyellow",
                  borderTopLeftRadius: ".8rem",
                  borderTopRightRadius: ".8rem",
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ flexGrow: 1 }}
                >
                  Please confirm the results to be saved:
                </Typography>
              </Toolbar>
              <Stack
                flexDirection={"column"}
                sx={{
                  flexWrap: "nowrap",
                  height: "90%",
                }}
              >
                <ResultsSummary userResults={userResults} />
                <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowConfirmUserResults(false)}
                    sx={{ mr: 5, mb: 10 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={saveUserResults}
                    sx={{ mr: 10, mb: 10 }}
                  >
                    Save
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={showAlert}
            autoHideDuration={2500}
            onClose={closeAlert}
          >
            <Alert
              onClose={closeAlert}
              severity={error ? "error" : "success"}
              sx={{ width: "100%", borderRadius: 7 }}
            >
              {alertMsg}
            </Alert>
          </Snackbar>
        </>
      )}
    </>
  );
}

export default ResultsPage;

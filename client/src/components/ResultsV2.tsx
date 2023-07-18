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
} from "../DataTypes";
import { Box, Button, Stack } from "@mui/material";
import MapLocationsV2 from "./MapLocationsV2";
import RecyclablesResults from "./ResultsPageComponents/RecyclablesResults";
import DonatablesResults from "./ResultsPageComponents/DonatablesResults";
import EwasteResults from "./ResultsPageComponents/EwasteResults";
import SpoiltResults from "./ResultsPageComponents/SpoiltResults";
import InfoIcon from "@mui/icons-material/Info";

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

function ResultsV2({
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

  ////////// User states for showing and saving preferred locations which are closest locations by default //////////
  const [closestBBLoc, setClosestBBLoc] = useState<LocationInfo | null>(null);
  const [preferredGDLoc, setPreferredGDLoc] = useState<LocationInfo[]>([]);
  const [preferredRDLoc, setPreferredRDLoc] = useState<LocationInfo[]>([]);
  const [preferredGELoc, setPreferredGELoc] = useState<LocationInfo[]>([]);
  const [preferredRELoc, setPreferredRELoc] = useState<LocationInfo[]>([]);
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
  const [showBluebin, setShowBluebin] = useState<boolean>(false);
  const [showGDMarkers, setShowGDMarkers] = useState<boolean[]>([]);
  const [showRDMarkers, setShowRDMarkers] = useState<boolean[]>([]);
  const [showEEMarkers, setShowEEMarkers] = useState<boolean[]>([]);
  const [showGEMarkers, setShowGEMarkers] = useState<boolean[]>([]);
  const [showREMarkers, setShowREMarkers] = useState<boolean[]>([]);
  const handleShowBluebin = () => {
    setShowBluebin(!showBluebin);
  };
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

  ////////// ResultsV2 Component begins here //////////
  return (
    <>
      {!loaded ? (
        <span>Loading...</span>
      ) : (
        <>
          <h1 style={{ margin: 0 }}>Here's where to recycle your items</h1>
          <Stack direction={"row"} alignItems={"center"} sx={{ mt: -1 }}>
            <InfoIcon sx={{ mr: 1 }} color={"info"} />
            <p>Search your location to see recycling facilities near you</p>
          </Stack>
          <MapLocationsV2
            showBluebin={showBluebin}
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
            closestBBLoc={closestBBLoc}
            setClosestBBLoc={setClosestBBLoc}
            setPreferredGDLoc={setPreferredGDLoc}
            setPreferredRDLoc={setPreferredRDLoc}
            setPreferredGELoc={setPreferredGELoc}
            setPreferredRELoc={setPreferredRELoc}
            setPreferredEELoc={setPreferredEELoc}
            showClosest={showClosest}
            setShowClosest={setShowClosest}
            setShowBluebin={setShowBluebin}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <RecyclablesResults
              recyclablesResults={recyclablesResults}
              showBluebin={showBluebin}
              handleShowBluebin={handleShowBluebin}
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
            <Button
              variant="outlined"
              onClick={handleBackClick}
              sx={{ mr: 10, mb: 10 }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={restartQuery}
              sx={{ mr: 10, mb: 10 }}
            >
              Start new query
            </Button>
          </Box>
        </>
      )}
    </>
  );
}

export default ResultsV2;

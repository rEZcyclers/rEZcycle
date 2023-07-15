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

type Condition = "Good" | "Repairable" | "Spoilt" | "";

interface Props {
  setStage: (num: number) => void;
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  recyclableConditions: boolean[];
  donatableConditions: Condition[];
  ewasteConditions: Condition[];
  clearForm: () => void;
}

function ResultsV2({
  setStage,
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  recyclableConditions,
  donatableConditions,
  ewasteConditions,
  clearForm,
}: Props) {
  ////////// Processing of Results //////////
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

  const [recyclablesResults, setRecyclablesResults] = useState<
    RecyclableItem[]
  >([]); // Selected recyclables which can be disposed in blue bins
  const [unrecyclablesResults, setUnrecyclablesResults] = useState<
    RecyclableItem[]
  >([]); // Selected recyclables which CANNOT be disposed in blue bins

  const [goodDonatables, setGoodDonatables] = useState<DonatableItem[]>([]); // Selected donatables in good condition
  const [repairDonatables, setRepairDonatables] = useState<DonatableItem[]>([]); // Selected donatables in repairable condition
  const [spoiltDonatables, setSpoiltDonatables] = useState<DonatableItem[]>([]); // Selected donatables in spoilt condition
  const [goodDonatablesResults, setGoodDonatablesResults] = useState<
    DonateOrganisationLocations[][]
  >([]); // List of donateOrganisations & their locations for every selected good donatable
  const [repairDonatablesResults, setRepairDonatablesResults] = useState<
    RepairLocation[][]
  >([]); // List of repairLocations for every selected repairable donatable

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

  // User's preferred result locations
  const [preferredGDLocations, setPreferredGDLocations] = useState<
    LocationInfo[]
  >([]);
  const [preferredRDLocations, setPreferredRDLocations] = useState<
    LocationInfo[]
  >([]);
  const [preferredGELocations, setPreferredGELocations] = useState<
    LocationInfo[]
  >([]);
  const [preferredRELocations, setPreferredRELocations] = useState<
    LocationInfo[]
  >([]);
  const [preferredEELocations, setPreferredEELocations] = useState<
    LocationInfo[]
  >([]);

  const [loaded, setLoaded] = useState(false);
  const [onlyShowClosest, setOnlyShowClosest] = useState(false);

  // Main function to get & set all results
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
  }

  useEffect(getResults, []);
  ////////// End of Results Processing //////////

  const handleBackClick = () => {
    setStage(2);
  };

  const restartQuery = () => {
    setStage(1);
    clearForm();
  };

  // State for deciding whether to show nested list for every result item or not
  const [showGDResults, setShowGDResults] = useState<boolean[]>(
    Array<boolean>(goodDonatables.length)
  );
  const [showRDResults, setShowRDResults] = useState<boolean[]>(
    Array<boolean>(repairDonatables.length)
  );
  const [showEEResults, setShowEEResults] = useState<boolean[]>(
    Array<boolean>(ebinEwaste.length)
  );
  const [showGEResults, setShowGEResults] = useState<boolean[]>(
    Array<boolean>(goodEwaste.length)
  );
  const [showREResults, setShowREResults] = useState<boolean[]>(
    Array<boolean>(repairDonatables.length)
  );
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

  // State for deciding whether to show map location pins for every result item or not
  const [showBluebin, setShowBluebin] = useState<boolean>(false);
  const [showGDPins, setShowGDPins] = useState<boolean[]>(
    Array<boolean>(goodDonatables.length)
  );
  const [showRDPins, setShowRDPins] = useState<boolean[]>(
    Array<boolean>(repairDonatables.length)
  );
  const [showEwastePins, setShowEwastePins] = useState<boolean[]>(
    Array<boolean>(allEwaste.length)
  );
  const [showGEPins, setShowGEPins] = useState<boolean[]>(
    Array<boolean>(goodEwaste.length)
  );
  const [showREPins, setShowREPins] = useState<boolean[]>(
    Array<boolean>(repairDonatables.length)
  );
  const handleShowBluebin = () => {
    setShowBluebin(!showBluebin);
  };
  const handleShowGDPins = (index: number) => {
    setShowGDPins([
      ...showGDPins.slice(0, index),
      !showGDPins[index],
      ...showGDPins.slice(index + 1),
    ]);
  };
  const handleShowRDPins = (index: number) => {
    setShowRDPins([
      ...showRDPins.slice(0, index),
      !showRDPins[index],
      ...showRDPins.slice(index + 1),
    ]);
  };
  const handleShowEwastePins = (index: number) => {
    setShowEwastePins([
      ...showEwastePins.slice(0, index),
      !showEwastePins[index],
      ...showEwastePins.slice(index + 1),
    ]);
  };
  const handleShowGEPins = (index: number) => {
    setShowGEPins([
      ...showGEPins.slice(0, index),
      !showGEPins[index],
      ...showGEPins.slice(index + 1),
    ]);
  };
  const handleShowREPins = (index: number) => {
    setShowREPins([
      ...showREPins.slice(0, index),
      !showREPins[index],
      ...showREPins.slice(index + 1),
    ]);
  };

  ////////// ResultsV2 Component begins here //////////
  return (
    <>
      {!loaded ? (
        <span>Loading...</span>
      ) : (
        <>
          <h1 style={{ margin: 0 }}>Here's where to recycle your items</h1>
          <MapLocationsV2
            showBluebin={showBluebin}
            showGDPins={showGDPins}
            showRDPins={showRDPins}
            showGEPins={showGEPins}
            showREPins={showREPins}
            showEwastePins={showEwastePins}
            bluebinsData={bluebinsData}
            goodDonatablesResults={goodDonatablesResults}
            repairDonatablesResults={repairDonatablesResults}
            goodEwasteResults={goodEwasteResults}
            repairEwasteResults={repairEwasteResults}
            ebinEwasteResults={ebinEwasteResults}
            setPreferredGDLocations={setPreferredGDLocations}
            setPreferredRDLocations={setPreferredRDLocations}
            setPreferredGELocations={setPreferredGELocations}
            setPreferredRELocations={setPreferredRELocations}
            setPreferredEELocations={setPreferredEELocations}
            onlyShowClosest={onlyShowClosest}
            setOnlyShowClosest={setOnlyShowClosest}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          >
            <RecyclablesResults
              recyclablesResults={recyclablesResults}
              showBluebin={showBluebin}
              handleShowBluebin={handleShowBluebin}
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
              showGDPins={showGDPins}
              handleShowGDPins={handleShowGDPins}
              showRDPins={showRDPins}
              handleShowRDPins={handleShowRDPins}
              preferredGDLocations={preferredGDLocations}
              preferredRDLocations={preferredRDLocations}
              onlyShowClosest={onlyShowClosest}
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
              showEwastePins={showEwastePins}
              handleShowEwastePins={handleShowEwastePins}
              showGEPins={showGEPins}
              handleShowGEPins={handleShowGEPins}
              showREPins={showREPins}
              handleShowREPins={handleShowREPins}
              preferredGELocations={preferredGELocations}
              preferredRELocations={preferredRELocations}
              preferredEELocations={preferredEELocations}
              onlyShowClosest={onlyShowClosest}
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

// Initial method of retrieving data by making Supabase call, but this returns a Promise object
// instead of a DonateLocations[][] object, so doesn't work. Maybe will look into this again in future.
//  goodDonatablesResults = goodDonatables.map(async (item: DonatableItem) => {
//       const { data, error } = await supabase
//         .from("DonatablesDonateLocations")
//         .select()
//         .match({ donatable_id: item["donatable_id"] });
//       const locations =
//         data === null
//           ? []
//           : data.map(async (entry) => {
//               await supabase
//                 .from("donateLocations")
//                 .select()
//                 .match({ donate_id: entry["donate_id"] });
//             });
//       return locations;
//     });

// Alternative method for getResults():
// const recyclablesResults = recyclablesData.filter(
//   (item: RecyclableItem, index: number) => {
//     selectedItems[index] &&
//       recyclableConditions[index] &&
//       item["bluebin_eligibility"] != 0;
//   }
// );

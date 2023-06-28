import { useContext } from "react";
import { backendContext } from "../App";
import {
  DonatableItem,
  EWasteItem,
  RecyclableItem,
  DonateOrganisation,
  DonateLocation,
  RepairLocation,
  DDOrg,
  DRLoc,
  EDOrg,
  ERLoc,
} from "../DataTypes";
import { Box, Button, Stack, Typography } from "@mui/material";
import Locations from "./Locations";

type Condition = "Good" | "Repairable" | "Spoilt" | "";
type DonateOrganisationLocations = {
  donateOrg: DonateOrganisation;
  donateLocations: DonateLocation[];
};
interface Props {
  stage: number;
  setStage: (num: number) => void;
  selectedItems: boolean[][];
  recyclableConditions: boolean[];
  setRecyclableConditions: (newArray: boolean[]) => void;
  donatableConditions: Condition[];
  setDonatableConditions: (newArray: Condition[]) => void;
  eWasteConditions: Condition[];
  setEWasteConditions: (newArray: Condition[]) => void;
}

function ResultsPage({
  selectedItems,
  recyclableConditions,
  donatableConditions,
  eWasteConditions,
  setStage,
}: Props) {
  // Retrieve raw data first
  const {
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
  } = useContext(backendContext);

  let recyclablesResults: RecyclableItem[] = []; // Selected recyclables which can be disposed in blue bins
  let unrecyclablesResults: RecyclableItem[] = []; // Selected recyclables which CANNOT be disposed in blue bins

  let goodDonatables: DonatableItem[] = []; // Selected donatables in good condition
  let repairDonatables: DonatableItem[] = []; // Selected donatables in repairable condition
  let spoiltDonatables: DonatableItem[] = []; // Selected donatables in spoilt condition
  let goodDonatablesResults: DonateOrganisationLocations[][] = []; // List of donateOrganisations & their locations for every selected good donatable
  let repairDonatablesResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable donatable

  let goodEWaste: EWasteItem[] = []; // Selected EWaste in good condition
  let repairEWaste: EWasteItem[] = []; // Selected EWaste in repairable condition
  let spoiltEWaste: EWasteItem[] = []; // Selected EWaste in spoilt condition
  let goodEWasteResults: DonateOrganisationLocations[][] = []; // List of donateLocations & their locations for every selected good EWaste
  let repairEWasteResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable EWaste

  function getResults() {
    recyclablesResults = selectedItems[0]
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          recyclableConditions[i] &&
          recyclablesData[i]["bluebin_eligibility"] != 0
      )
      .map((i) => recyclablesData[i]);
    // OR
    // const recyclablesResults = recyclablesData.filter(
    //   (item: RecyclableItem, index: number) => {
    //     selectedItems[index] &&
    //       recyclableConditions[index] &&
    //       item["bluebin_eligibility"] != 0;
    //   }
    // );
    unrecyclablesResults = selectedItems[0]
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          (recyclablesData[i]["bluebin_eligibility"] === 0 ||
            !recyclableConditions[i])
      )
      .map((i) => recyclablesData[i]);

    goodDonatables = donatableConditions
      .map((cond, i) => (cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    repairDonatables = donatableConditions
      .map((cond, i) => (cond === "Repairable" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    spoiltDonatables = donatableConditions
      .map((cond, i) => (cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    goodDonatablesResults = goodDonatables.map((item: DonatableItem) => {
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
    repairDonatablesResults = repairDonatables.map((item: DonatableItem) => {
      return DRLocData.filter(
        (entry: DRLoc) => entry["donatable_id"] === item["donatable_id"]
      ).map((entry: DRLoc) => {
        return repairLocData[entry["repair_id"] - 1];
      });
    });

    goodEWaste = eWasteConditions
      .map((cond, i) => (cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);
    repairEWaste = eWasteConditions
      .map((cond, i) => (cond === "Repairable" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);
    spoiltEWaste = eWasteConditions
      .map((cond, i) => (cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => eWasteData[i]);
    goodEWasteResults = goodEWaste.map((item: EWasteItem) => {
      return EDOrgData.filter(
        (entry: EDOrg) => entry["eWaste_id"] === item["eWaste_id"]
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
    repairEWasteResults = repairEWaste.map((item: EWasteItem) => {
      return ERLocData.filter(
        (entry: ERLoc) => entry["eWaste_id"] === item["eWaste_id"]
      ).map((entry: ERLoc) => {
        return repairLocData[entry["repair_id"] - 1];
      });
    });
  }

  const handleBackClick = () => {
    setStage(2);
  };

  getResults();

  return (
    <>
      <h1>Here's where to recycle your items</h1>
      <Locations
        goodDonatables={goodDonatables}
        repairDonatables={repairDonatables}
        spoiltDonatables={spoiltDonatables}
        goodDonatablesResults={goodDonatablesResults}
        repairDonatablesResults={repairDonatablesResults}
        goodEWaste={goodEWaste}
        repairEWaste={repairEWaste}
        spoiltEWaste={spoiltEWaste}
        goodEWasteResults={goodEWasteResults}
        repairEWasteResults={repairEWasteResults}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {recyclablesResults.length != 0 && (
          <Box flex={1}>
            <h2>Recyclables</h2>
            <h4>These items can be recycled at the nearest blue bins:</h4>
            <ul>
              {recyclablesResults.map((item: RecyclableItem) => {
                return (
                  <li>
                    <Typography variant="body1">{item["name"]}</Typography>
                  </li>
                );
              })}
            </ul>
          </Box>
        )}
        {(goodDonatables.length != 0 || repairDonatables.length != 0) && (
          <Box flex={1}>
            <h2>Donatables</h2>
            {goodDonatables.length != 0 && (
              <>
                <h4>These donatables can be donated:</h4>
                {goodDonatables.map((item: DonatableItem, index: number) => {
                  return (
                    <div>
                      <Typography variant="body1">
                        {item["donatable_type"] + ": "}
                      </Typography>
                      {goodDonatablesResults[index].length === 0 ? (
                        <p>
                          Oops, no locations found for {item["donatable_type"]}
                        </p>
                      ) : (
                        <ul>
                          {goodDonatablesResults[index].map(
                            (entry: DonateOrganisationLocations) => {
                              const org = entry["donateOrg"];
                              const locations = entry["donateLocations"];
                              return (
                                <li key={org["donateOrg_id"]}>
                                  <Typography>
                                    {org["organisation_name"]}
                                  </Typography>
                                  <ul>
                                    {locations.map((loc: DonateLocation) => {
                                      return <li>{loc["address"]}</li>;
                                    })}
                                  </ul>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </>
            )}
            {repairDonatables.length != 0 && (
              <>
                <h4>These donatables can be repaired:</h4>
                {repairDonatables.map((item: DonatableItem, index: number) => {
                  return (
                    <div>
                      <Typography variant="body1">
                        {item["donatable_type"] + ": "}
                      </Typography>
                      {repairDonatablesResults[index].length === 0 ? (
                        <p>
                          Oops, no locations found for {item["donatable_type"]}
                        </p>
                      ) : (
                        <ul>
                          {repairDonatablesResults[index].map(
                            (location: RepairLocation) => {
                              return (
                                <li key={location["repair_id"]}>
                                  <Typography>
                                    {location["center_name"]}, stall number{" "}
                                    {location["stall_number"]}
                                  </Typography>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </Box>
        )}
        {(goodEWaste.length != 0 || repairEWaste.length != 0) && (
          <>
            <Box flex={1}>
              <h2>EWaste</h2>
              {goodEWaste.length != 0 && (
                <>
                  <h4>These EWaste items can be donated:</h4>
                  {goodEWaste.map((item: EWasteItem, index: number) => {
                    return (
                      <div>
                        <Typography variant="body1">
                          {item["eWaste_type"] + ": "}
                        </Typography>
                        {goodEWasteResults[index].length === 0 ? (
                          <p>
                            Oops, no locations found for {item["eWaste_type"]}
                          </p>
                        ) : (
                          <ul>
                            {goodEWasteResults[index].map(
                              (entry: DonateOrganisationLocations) => {
                                const org = entry["donateOrg"];
                                const locations = entry["donateLocations"];
                                return (
                                  <li key={org["donateOrg_id"]}>
                                    <Typography>
                                      {org["organisation_name"]}
                                    </Typography>
                                    <ul>
                                      {locations.map((loc: DonateLocation) => {
                                        return <li>{loc["address"]}</li>;
                                      })}
                                    </ul>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              {repairEWaste.length != 0 && (
                <>
                  <h4>These EWaste items can be repaired:</h4>
                  {repairEWaste.map((item: EWasteItem, index: number) => {
                    return (
                      <div>
                        <Typography variant="body1">
                          {item["eWaste_type"] + ": "}
                        </Typography>
                        {repairEWasteResults[index].length === 0 ? (
                          <p>
                            Oops, no locations found for {item["eWaste_type"]}
                          </p>
                        ) : (
                          <ul>
                            {repairEWasteResults[index].map(
                              (location: RepairLocation) => {
                                return (
                                  <li key={location["repair_id"]}>
                                    <Typography>
                                      {location["center_name"]}, stall number{" "}
                                      {location["stall_number"]}
                                    </Typography>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </Box>
          </>
        )}
      </Stack>
      {(unrecyclablesResults.length != 0 ||
        spoiltDonatables.length != 0 ||
        spoiltEWaste.length != 0) && (
        <>
          <h2>These items need to be disposed as general waste:</h2>
          <Stack>
            {unrecyclablesResults.length != 0 && (
              <>
                <h3>
                  (The following items may be of recyclable material, but its
                  usage or condition renders them unrecyclable)
                </h3>
                {unrecyclablesResults.map((item: RecyclableItem) => {
                  return (
                    <Typography variant="body1">{item["name"]}</Typography>
                  );
                })}
              </>
            )}
            {spoiltDonatables.length != 0 && (
              <>
                <h3>(Spoilt Donatables)</h3>
                {spoiltDonatables.map((item: DonatableItem) => {
                  return (
                    <Typography variant="body1">
                      {item["donatable_type"]}
                    </Typography>
                  );
                })}
              </>
            )}
            {spoiltEWaste.length != 0 && (
              <>
                <h3>(Spoilt EWaste)</h3>
                {spoiltEWaste.map((item: EWasteItem) => {
                  return (
                    <Typography variant="body1">
                      {item["eWaste_type"]}
                    </Typography>
                  );
                })}
              </>
            )}
          </Stack>
        </>
      )}
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBackClick}
          sx={{ mr: 10, mb: 10 }}
        >
          Back
        </Button>
      </Box>
    </>
  );
}

export default ResultsPage;

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

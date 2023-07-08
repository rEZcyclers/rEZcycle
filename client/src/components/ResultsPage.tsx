import { useContext, useState } from "react";
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
  SelectedResultItem,
  DonateOrganisationLocations,
  EbinLocations,
} from "../DataTypes";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Locations from "./Locations";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";

type Condition = "Good" | "Repairable" | "Spoilt" | "";

interface Props {
  setStage: (num: number) => void;
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  recyclableConditions: boolean[];
  donatableConditions: Condition[];
  ewasteConditions: Condition[];
}

function ResultsPage({
  setStage,
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  recyclableConditions,
  donatableConditions,
  ewasteConditions,
}: Props) {
  // Retrieve raw data first
  const {
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
  } = useContext(backendContext);

  let recyclablesResults: RecyclableItem[] = []; // Selected recyclables which can be disposed in blue bins
  let unrecyclablesResults: RecyclableItem[] = []; // Selected recyclables which CANNOT be disposed in blue bins

  let goodDonatables: DonatableItem[] = []; // Selected donatables in good condition
  let repairDonatables: DonatableItem[] = []; // Selected donatables in repairable condition
  let spoiltDonatables: DonatableItem[] = []; // Selected donatables in spoilt condition
  let goodDonatablesResults: DonateOrganisationLocations[][] = []; // List of donateOrganisations & their locations for every selected good donatable
  let repairDonatablesResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable donatable

  let goodEwaste: EwasteItem[] = []; // Selected Ewaste in good condition
  let repairEwaste: EwasteItem[] = []; // Selected Ewaste in repairable condition
  let spoiltEwaste: EwasteItem[] = []; // Selected Ewaste in spoilt condition
  let goodEwasteResults: DonateOrganisationLocations[][] = []; // List of donateLocations & their locations for every selected good Ewaste
  let repairEwasteResults: RepairLocation[][] = []; // List of repairLocations for every selected repairable Ewaste
  let allEwaste: EwasteItem[] = []; // All selected Ewaste regardless of condition
  let ewasteEbinResults: EbinLocations[][] = []; // List of ebinLocations for every selected Ewaste

  function getResults() {
    recyclablesResults = selectedRecyclables
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
    unrecyclablesResults = selectedRecyclables
      .map((sel, i) => (sel ? i : -1))
      .filter(
        (i) =>
          i != -1 &&
          (recyclablesData[i]["bluebin_eligibility"] === 0 ||
            !recyclableConditions[i])
      )
      .map((i) => recyclablesData[i]);

    goodDonatables = donatableConditions
      .map((cond, i) => (selectedDonatables[i] && cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    repairDonatables = donatableConditions
      .map((cond, i) =>
        selectedDonatables[i] && cond === "Repairable" ? i : -1
      )
      .filter((i) => i != -1)
      .map((i) => donatablesData[i]);
    spoiltDonatables = donatableConditions
      .map((cond, i) => (selectedDonatables[i] && cond === "Spoilt" ? i : -1))
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

    goodEwaste = ewasteConditions
      .map((cond, i) => (selectedEwaste[i] && cond === "Good" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => ewasteData[i]);
    repairEwaste = ewasteConditions
      .map((cond, i) => (selectedEwaste[i] && cond === "Repairable" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => ewasteData[i]);
    spoiltEwaste = ewasteConditions
      .map((cond, i) => (selectedEwaste[i] && cond === "Spoilt" ? i : -1))
      .filter((i) => i != -1)
      .map((i) => ewasteData[i]);
    goodEwasteResults = goodEwaste.map((item: EwasteItem) => {
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
    repairEwasteResults = repairEwaste.map((item: EwasteItem) => {
      return ERLocData.filter(
        (entry: ERLoc) => entry["ewaste_id"] === item["ewaste_id"]
      ).map((entry: ERLoc) => {
        return repairLocData[entry["repair_id"] - 1];
      });
    });
    allEwaste = selectedEwaste
      .map((sel, i) => (sel ? i : -1))
      .filter((i) => i != -1)
      .map((i) => ewasteData[i]);
    ewasteEbinResults = allEwaste.map((item: EwasteItem) => {
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
  }

  // Identify the selected result item with a list of 3 numbers
  // The first number identifies the category of the item, the second number identifies the condition of the item and the third number identifies the item index
  // The first number is 0 for recyclables, 1 for donatables and 2 for ewaste
  // The second number is 0 for good, 1 for repairable and 2 for spoilt
  // The third number is the index of the item in the respective data array
  const [selectedResultItem, setSelectedResultItem] =
    useState<SelectedResultItem>({
      category: -1,
      condition: -1,
      index: -1,
    });

  const handleBackClick = () => {
    setStage(2);
  };

  getResults();

  const [showGDResults, setShowGDResults] = useState<boolean[]>(
    Array<boolean>(goodDonatables.length)
  );
  const [showRDResults, setShowRDResults] = useState<boolean[]>(
    Array<boolean>(repairDonatables.length)
  );
  const [showEwasteResults, setShowEwasteResults] = useState<boolean[]>(
    Array<boolean>(allEwaste.length)
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
  const handleShowEwasteResults = (index: number) => {
    setShowEwasteResults([
      ...showEwasteResults.slice(0, index),
      !showEwasteResults[index],
      ...showEwasteResults.slice(index + 1),
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

  /* Create a state that indicates which "Show on Map" buttons are highlighted
  It consists of 4 arrays, each array represents a category of items
  Array 1 represents goodDonatables
  Array 2 represents repairDonatables
  Array 3 represents goodEwaste
  Array 4 represents repairEwaste
  */
  const [isHighlighted, setIsHighlighted] = useState<boolean[][]>([
    Array<boolean>(goodDonatables.length),
    Array<boolean>(repairDonatables.length),
    Array<boolean>(goodEwaste.length),
    Array<boolean>(repairEwaste.length),
  ]);

  // Create a state that indicates which "Show on Map" button is currently highlighted
  // It consists of 2 numbers, the first number represents the category of the item button
  //   and the second number represents the index of the item button
  const [currentHighlightedButton, setCurrentHighlightedButton] = useState<
    number[]
  >([-1, -1]);

  const handleHighlight = (buttonCategory: number, buttonIndex: number) => {
    // create new isHighlighted array to replace old array
    let newIsHighlighted = isHighlighted;
    // unhighlight the previously highlighted button
    if (currentHighlightedButton[0] != -1) {
      newIsHighlighted[currentHighlightedButton[0]][
        currentHighlightedButton[1]
      ] = false;
    }
    // highlight the new button
    newIsHighlighted[buttonCategory][buttonIndex] = true;
    // update state
    setIsHighlighted(newIsHighlighted);
    // update currentHighlightedButton
    setCurrentHighlightedButton([buttonCategory, buttonIndex]);
  };

  return (
    <>
      <h1>Here's where to recycle your items</h1>
      <Locations
        goodDonatables={goodDonatables}
        repairDonatables={repairDonatables}
        spoiltDonatables={spoiltDonatables}
        goodDonatablesResults={goodDonatablesResults}
        repairDonatablesResults={repairDonatablesResults}
        goodEwaste={goodEwaste}
        repairEwaste={repairEwaste}
        spoiltEwaste={spoiltEwaste}
        goodEwasteResults={goodEwasteResults}
        repairEwasteResults={repairEwasteResults}
        ewasteEbinResults={ewasteEbinResults}
        selectedResultItem={selectedResultItem}
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
                <h4>
                  These donatables can be donated at the following
                  organisations:
                </h4>
                {goodDonatables.map((item: DonatableItem, index: number) => {
                  return (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <List
                        sx={{
                          width: "70%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleShowGDResults(index)}
                        >
                          <ListItemIcon>
                            {showGDResults[index] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={item["donatable_type"]} />
                        </ListItemButton>
                        <Collapse
                          in={showGDResults[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          {goodDonatablesResults[index].length === 0 ? (
                            <p>
                              Oops, no locations found for{" "}
                              {item["donatable_type"]}
                            </p>
                          ) : (
                            <>
                              <List component="div" disablePadding>
                                {goodDonatablesResults[index].map(
                                  (entry: DonateOrganisationLocations) => {
                                    const org = entry["donateOrg"];
                                    // const locations = entry["donateLocations"];
                                    return (
                                      <ListItemButton
                                        sx={{ padding: 0, pl: 4 }}
                                      >
                                        <ListItemIcon>
                                          <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={org["organisation_name"]}
                                        />
                                      </ListItemButton>
                                    );
                                  }
                                )}
                              </List>
                            </>
                          )}
                        </Collapse>
                      </List>
                      <Button
                        variant={
                          isHighlighted[0][index] ? "contained" : "outlined"
                        }
                        color="primary"
                        sx={{ mt: 1, height: 50 }}
                        onClick={() => {
                          setSelectedResultItem({
                            category: 1,
                            condition: 0,
                            index: index,
                          });
                          handleHighlight(0, index);
                        }}
                      >
                        Show On Map
                      </Button>
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
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <List
                        sx={{
                          width: "70%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItemButton
                          onClick={() => handleShowRDResults(index)}
                        >
                          <ListItemIcon>
                            {showRDResults[index] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={item["donatable_type"]} />
                        </ListItemButton>
                        <Collapse
                          in={showRDResults[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          {repairDonatablesResults[index].length === 0 ? (
                            <p>
                              Oops, no locations found for{" "}
                              {item["donatable_type"]}
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
                        </Collapse>
                      </List>
                      <Button
                        variant={
                          isHighlighted[1][index] ? "contained" : "outlined"
                        }
                        color="primary"
                        sx={{ mt: 1, height: 50 }}
                        onClick={() => {
                          setSelectedResultItem({
                            category: 1,
                            condition: 1,
                            index: index,
                          });
                          handleHighlight(1, index);
                        }}
                      >
                        Show On Map
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
          </Box>
        )}
        {allEwaste.length != 0 && (
          <>
            <Box flex={1}>
              <h2>Ewaste</h2>
              <h4>
                For any non-bulky Ewaste, they may be disposed of at the
                following Ebins:
              </h4>
              {allEwaste.map((item: EwasteItem, index: number) => {
                return (
                  <div>
                    <List
                      sx={{
                        width: "70%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleShowEwasteResults(index)}
                      >
                        <ListItemIcon>
                          {showEwasteResults[index] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={item["ewaste_type"]} />
                      </ListItemButton>
                      <Collapse
                        in={showEwasteResults[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        {ewasteEbinResults[index].length === 0 ? (
                          <p>
                            For {item["ewaste_type"]}, refer to collection drive
                            info below
                          </p>
                        ) : (
                          <List component="div" disablePadding>
                            {ewasteEbinResults[index].map(
                              (binInfo: EbinLocations) => {
                                const bin = binInfo["ebin"];
                                // const locations = entry["donateLocations"];
                                return (
                                  <ListItemButton sx={{ padding: 0, pl: 4 }}>
                                    <ListItemIcon>
                                      <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText primary={bin["ebin_name"]} />
                                  </ListItemButton>
                                );
                              }
                            )}
                          </List>
                          // <ul>
                          //   {ewasteEbinResults[index].map(
                          //     (binInfo: EbinLocations) => {
                          //       return (
                          //         <li key={binInfo["ebin"]["ebin_id"]}>
                          //           {binInfo["ebin"]["ebin_name"]}
                          //         </li>
                          //       );
                          //     }
                          //   )}
                          // </ul>
                        )}
                      </Collapse>
                    </List>
                  </div>
                );
              })}
              {goodEwaste.length != 0 && (
                <>
                  <h4>
                    Alternatively, Ewaste in good condition may be donated
                    instead:
                  </h4>
                  {goodEwaste.map((item: EwasteItem, index: number) => {
                    return (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <List
                          sx={{
                            width: "70%",
                            maxWidth: 360,
                            bgcolor: "background.paper",
                          }}
                        >
                          <ListItemButton
                            onClick={() => handleShowGEResults(index)}
                          >
                            <ListItemIcon>
                              {showGEResults[index] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemIcon>
                            <ListItemText primary={item["ewaste_type"]} />
                          </ListItemButton>
                          <Collapse
                            in={showGEResults[index]}
                            timeout="auto"
                            unmountOnExit
                          >
                            {goodEwasteResults[index].length === 0 ? (
                              <p>
                                Oops, no locations found for{" "}
                                {item["ewaste_type"]}
                              </p>
                            ) : (
                              <>
                                <List component="div" disablePadding>
                                  {goodEwasteResults[index].map(
                                    (entry: DonateOrganisationLocations) => {
                                      const org = entry["donateOrg"];
                                      // const locations = entry["donateLocations"];
                                      return (
                                        <ListItemButton
                                          sx={{ padding: 0, pl: 4 }}
                                        >
                                          <ListItemIcon>
                                            <StarBorder />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={org["organisation_name"]}
                                          />
                                        </ListItemButton>
                                      );
                                    }
                                  )}
                                </List>
                              </>
                            )}
                          </Collapse>
                        </List>
                        <Button
                          variant={
                            isHighlighted[2][index] ? "contained" : "outlined"
                          }
                          color="primary"
                          sx={{ mt: 1, height: 50 }}
                          onClick={() => {
                            setSelectedResultItem({
                              category: 2,
                              condition: 0,
                              index: index,
                            });
                            handleHighlight(2, index);
                          }}
                        >
                          Show On Map
                        </Button>
                      </div>
                    );
                  })}
                </>
              )}
              {repairEwaste.length != 0 && (
                <>
                  <h4>
                    Alternatively, damaged but not spoilt Ewaste can be
                    repaired:
                  </h4>
                  {repairEwaste.map((item: EwasteItem, index: number) => {
                    return (
                      <>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <List
                            sx={{
                              width: "70%",
                              maxWidth: 360,
                              bgcolor: "background.paper",
                            }}
                          >
                            <ListItemButton
                              onClick={() => handleShowREResults(index)}
                            >
                              <ListItemIcon>
                                {showREResults[index] ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </ListItemIcon>
                              <ListItemText primary={item["ewaste_type"]} />
                            </ListItemButton>
                            <Collapse
                              in={showREResults[index]}
                              timeout="auto"
                              unmountOnExit
                            >
                              {repairEwasteResults[index].length === 0 ? (
                                <p>
                                  Oops, no locations found for{" "}
                                  {item["ewaste_type"]}
                                </p>
                              ) : (
                                <ul>
                                  {repairEwasteResults[index].map(
                                    (location: RepairLocation) => {
                                      return (
                                        <li key={location["repair_id"]}>
                                          <Typography>
                                            {location["center_name"]}, stall
                                            number {location["stall_number"]}
                                          </Typography>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              )}
                            </Collapse>
                          </List>
                          <Button
                            variant={
                              isHighlighted[3][index] ? "contained" : "outlined"
                            }
                            color="primary"
                            sx={{ mt: 1, height: 50 }}
                            onClick={() => {
                              setSelectedResultItem({
                                category: 2,
                                condition: 1,
                                index: index,
                              });
                              handleHighlight(3, index);
                            }}
                          >
                            Show On Map
                          </Button>
                        </div>
                      </>
                    );
                  })}
                </>
              )}
            </Box>
          </>
        )}
      </Stack>
      {(unrecyclablesResults.length != 0 || spoiltDonatables.length != 0) && (
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

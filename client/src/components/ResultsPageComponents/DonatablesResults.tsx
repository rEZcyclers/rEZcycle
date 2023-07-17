import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  DonatableItem,
  DonateOrganisationLocations,
  LocationInfo,
  RepairLocation,
} from "../../DataTypes";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";

interface Props {
  goodDonatables: DonatableItem[];
  repairDonatables: DonatableItem[];
  goodDonatablesResults: DonateOrganisationLocations[][];
  repairDonatablesResults: RepairLocation[][];

  showGDResults: boolean[];
  handleShowGDResults: (i: number) => void;
  showRDResults: boolean[];
  handleShowRDResults: (i: number) => void;

  showGDMarkers: boolean[];
  handleShowGDMarkers: (i: number) => void;
  showRDMarkers: boolean[];
  handleShowRDMarkers: (i: number) => void;

  preferredGDLocations: LocationInfo[];
  preferredRDLocations: LocationInfo[];
  showClosest: boolean;
}

export default function DonatablesResults({
  goodDonatables,
  repairDonatables,
  handleShowGDResults,
  showGDResults,
  goodDonatablesResults,
  showGDMarkers,
  handleShowGDMarkers,
  showRDResults,
  repairDonatablesResults,
  handleShowRDResults,
  showRDMarkers,
  handleShowRDMarkers,
  preferredGDLocations,
  preferredRDLocations,
  showClosest,
}: Props) {
  return (
    <>
      {(goodDonatables.length != 0 || repairDonatables.length != 0) && (
        <Box flex={1}>
          <h2>Donatables</h2>
          {goodDonatables.length != 0 && (
            <>
              <h4 style={{ margin: 0 }}>
                These donatables can be donated at the following organisations:
              </h4>
              {goodDonatables.map((item: DonatableItem, index: number) => {
                return (
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <List
                      sx={{
                        margin: 0,
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
                        <ListItemText>
                          <span>{item["donatable_type"]}</span>
                          {showClosest && (
                            <p style={{ margin: 0, color: "red" }}>
                              Closest Location:{" "}
                              {preferredGDLocations[index]["name"]} at{" "}
                              {preferredGDLocations[index]["address"]}
                            </p>
                          )}
                        </ListItemText>
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
                                  return (
                                    <ListItemButton sx={{ padding: 0, pl: 4 }}>
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
                      variant={showGDMarkers[index] ? "contained" : "outlined"}
                      color="primary"
                      sx={{ mt: 1, height: 50, fontSize: "small" }}
                      onClick={() => {
                        handleShowGDMarkers(index);
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
              <h4 style={{ margin: 0 }}>These donatables can be repaired:</h4>
              {repairDonatables.map((item: DonatableItem, index: number) => {
                return (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <List
                      sx={{
                        margin: 0,
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
                        <ListItemText>
                          {item["donatable_type"]}
                          {showClosest && (
                            <p style={{ margin: 0, color: "red" }}>
                              Closest Location:{" "}
                              {preferredRDLocations[index]["name"]} at{" "}
                              {preferredRDLocations[index]["address"]}
                            </p>
                          )}
                        </ListItemText>
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
                      variant={showRDMarkers[index] ? "contained" : "outlined"}
                      color="primary"
                      sx={{ mt: 1, height: 50, fontSize: "small" }}
                      onClick={() => {
                        handleShowRDMarkers(index);
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
    </>
  );
}

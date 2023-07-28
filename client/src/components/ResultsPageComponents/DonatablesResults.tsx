import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
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
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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

  preferredGDLoc: LocationInfo[];
  preferredRDLoc: (LocationInfo | null)[];
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
  preferredGDLoc,
  preferredRDLoc,
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
                return goodDonatablesResults[index].length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <List
                      sx={{
                        margin: 0,
                        maxWidth: 500,
                        bgcolor: "background.paper",
                      }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <ErrorOutlineIcon />
                        </ListItemIcon>
                        <ListItemText>
                          Oops, donate locations found for{" "}
                          {item["donatable_type"]}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </div>
                ) : (
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
                              Closest Location: {preferredGDLoc[index]["name"]}{" "}
                              at {preferredGDLoc[index]["address"]}
                            </p>
                          )}
                        </ListItemText>
                      </ListItemButton>
                      <Collapse
                        in={showGDResults[index]}
                        timeout="auto"
                        unmountOnExit
                      >
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
                      </Collapse>
                    </List>
                    <Button
                      variant={showGDMarkers[index] ? "contained" : "outlined"}
                      color="primary"
                      sx={{
                        mt: 1,
                        height: 50,
                        fontSize: "small",
                        maxWidth: 100,
                      }}
                      onClick={() => {
                        handleShowGDMarkers(index);
                      }}
                    >
                      Show All Locations
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
                return repairDonatablesResults[index].length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <List
                      sx={{
                        margin: 0,
                        maxWidth: 500,
                        bgcolor: "background.paper",
                      }}
                    >
                      <ListItem>
                        <ListItemIcon>
                          <ErrorOutlineIcon />
                        </ListItemIcon>
                        <ListItemText>
                          Oops, no repair locations found for{" "}
                          {item["donatable_type"]}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </div>
                ) : (
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
                              Closest Location: {preferredRDLoc[index]?.name} at{" "}
                              {preferredRDLoc[index]?.address}
                            </p>
                          )}
                        </ListItemText>
                      </ListItemButton>
                      <Collapse
                        in={showRDResults[index]}
                        timeout="auto"
                        unmountOnExit
                      >
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
                      </Collapse>
                    </List>
                    <Button
                      variant={showRDMarkers[index] ? "contained" : "outlined"}
                      color="primary"
                      sx={{
                        mt: 1,
                        height: 50,
                        fontSize: "small",
                        maxWidth: 100,
                      }}
                      onClick={() => {
                        handleShowRDMarkers(index);
                      }}
                    >
                      Show All Locations
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

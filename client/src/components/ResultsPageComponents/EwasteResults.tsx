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
  DonateOrganisationLocations,
  EbinLocations,
  EwasteItem,
  LocationInfo,
  RepairLocation,
} from "../../DataTypes";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  allEwaste: EwasteItem[];
  ebinEwaste: EwasteItem[];
  goodEwaste: EwasteItem[];
  regulatedEwaste: EwasteItem[];
  repairEwaste: EwasteItem[];
  goodEwasteResults: DonateOrganisationLocations[][];
  repairEwasteResults: RepairLocation[][];
  ebinEwasteResults: EbinLocations[][];
  showEEResults: boolean[];
  handleshowEEResults: (i: number) => void;
  showGEResults: boolean[];
  handleShowGEResults: (i: number) => void;
  showREResults: boolean[];
  handleShowREResults: (i: number) => void;
  showEEMarkers: boolean[];
  handleShowEEMarkers: (i: number) => void;
  showGEMarkers: boolean[];
  handleShowGEMarkers: (i: number) => void;
  showREMarkers: boolean[];
  handleShowREMarkers: (i: number) => void;

  preferredGELoc: LocationInfo[];
  preferredRELoc: (LocationInfo | null)[];
  preferredEELoc: LocationInfo[];
  showClosest: boolean;
}

export default function ({
  allEwaste,
  ebinEwaste,
  goodEwaste,
  regulatedEwaste,
  repairEwaste,
  goodEwasteResults,
  repairEwasteResults,
  ebinEwasteResults,
  showEEResults,
  handleshowEEResults,
  showGEResults,
  handleShowGEResults,
  showREResults,
  handleShowREResults,
  showEEMarkers,
  handleShowEEMarkers,
  showGEMarkers,
  handleShowGEMarkers,
  showREMarkers,
  handleShowREMarkers,
  preferredGELoc,
  preferredRELoc,
  preferredEELoc,
  showClosest,
}: Props) {
  return (
    <>
      {allEwaste.length != 0 && (
        <>
          <Box flex={1}>
            <h2>Ewaste</h2>
            {ebinEwaste.length != 0 && (
              <>
                <h4 style={{ margin: 0 }}>
                  For any non-bulky Ewaste, they may be disposed of at the
                  following Ebins:
                </h4>
                {ebinEwaste.map((item: EwasteItem, index: number) => {
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
                          onClick={() => handleshowEEResults(index)}
                        >
                          <ListItemIcon>
                            {showEEResults[index] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemIcon>
                          <ListItemText>
                            {item["ewaste_type"]}
                            {showClosest && (
                              <p style={{ margin: 0, color: "red" }}>
                                Closest Location:{" "}
                                {preferredEELoc[index]["name"]} at{" "}
                                {preferredEELoc[index]["address"]}
                              </p>
                            )}
                          </ListItemText>
                        </ListItemButton>
                        <Collapse
                          in={showEEResults[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {ebinEwasteResults[index].map(
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
                        </Collapse>
                      </List>
                      <Button
                        variant={
                          showEEMarkers[index] ? "contained" : "outlined"
                        }
                        color="primary"
                        sx={{ mt: 1, height: 50, fontSize: "small" }}
                        onClick={() => {
                          handleShowEEMarkers(index);
                        }}
                      >
                        Show All Locations
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
            {regulatedEwaste.length != 0 && (
              <>
                <h4 style={{ marginBottom: 0 }}>
                  {`Regulated Ewaste Items may be disposed at ALBA's quarterly Ewaste Collection Drives${
                    ebinEwaste.length === 0 ? ": " : " as well: "
                  }`}
                  <a
                    href="https://alba-ewaste.sg/drop-off-at-collection-events/"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {"(More Info)"}
                  </a>
                </h4>
                <ul style={{ marginTop: 0 }}>
                  {regulatedEwaste.map((item: EwasteItem) => {
                    return <li>{item["ewaste_type"]}</li>;
                  })}
                </ul>
              </>
            )}
            {goodEwaste.length != 0 && (
              <>
                <h4 style={{ margin: 0 }}>
                  Alternatively, Ewaste in good condition may be donated
                  instead:
                </h4>
                {goodEwaste.map((item: EwasteItem, index: number) => {
                  return goodEwasteResults[index].length === 0 ? (
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
                            {item["ewaste_type"]}
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
                          onClick={() => handleShowGEResults(index)}
                        >
                          <ListItemIcon>
                            {showGEResults[index] ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemIcon>
                          <ListItemText>
                            {item["ewaste_type"]}
                            {showClosest && (
                              <p style={{ margin: 0, color: "red" }}>
                                Closest Location:{" "}
                                {preferredGELoc[index]["name"]} at{" "}
                                {preferredGELoc[index]["address"]}
                              </p>
                            )}
                          </ListItemText>
                        </ListItemButton>
                        <Collapse
                          in={showGEResults[index]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            {goodEwasteResults[index].map(
                              (entry: DonateOrganisationLocations) => {
                                const org = entry["donateOrg"];
                                // const locations = entry["donateLocations"];
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
                        variant={
                          showGEMarkers[index] ? "contained" : "outlined"
                        }
                        color="primary"
                        sx={{ mt: 1, height: 50, fontSize: "small" }}
                        onClick={() => {
                          handleShowGEMarkers(index);
                        }}
                      >
                        Show All Locations
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
            {repairEwaste.length != 0 && (
              <>
                <h4 style={{ margin: 0 }}>
                  Alternatively, damaged but not spoilt Ewaste can be repaired:
                </h4>
                {repairEwaste.map((item: EwasteItem, index: number) => {
                  return (
                    <>
                      {repairEwasteResults[index].length === 0 ? (
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
                                {item["ewaste_type"]}
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
                              onClick={() => handleShowREResults(index)}
                            >
                              <ListItemIcon>
                                {showREResults[index] ? (
                                  <ExpandLess />
                                ) : (
                                  <ExpandMore />
                                )}
                              </ListItemIcon>
                              <ListItemText>
                                {item["ewaste_type"]}
                                {showClosest && (
                                  <p style={{ margin: 0, color: "red" }}>
                                    Closest Location:{" "}
                                    {preferredRELoc[index]?.name} at{" "}
                                    {preferredRELoc[index]?.address}
                                  </p>
                                )}
                              </ListItemText>
                            </ListItemButton>
                            <Collapse
                              in={showREResults[index]}
                              timeout="auto"
                              unmountOnExit
                            >
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
                            </Collapse>
                          </List>
                          <Button
                            variant={
                              showREMarkers[index] ? "contained" : "outlined"
                            }
                            color="primary"
                            sx={{ mt: 1, height: 50, fontSize: "small" }}
                            onClick={() => {
                              handleShowREMarkers(index);
                            }}
                          >
                            Show All Locations
                          </Button>
                        </div>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
}

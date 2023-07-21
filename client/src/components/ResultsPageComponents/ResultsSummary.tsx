import { Box } from "@mui/material";
import {
  EwasteItem,
  LocationInfo,
  RecyclableItem,
  UserResults,
} from "../../DataTypes";

interface Props {
  userResults: UserResults | null;
}

export default function ResultsSummary({ userResults }: Props) {
  return (
    <>
      {userResults !== null && (
        <Box sx={{ margin: 3, marginBottom: 0, overflowY: "auto" }}>
          {userResults["recyclables"].length !== 0 && (
            <p>
              These recyclables can be disposed at the nearest bluebin, located
              at{" "}
              <span style={{ color: "green" }}>
                {userResults["closestBluebin"]?.address}
              </span>
              :
              <ul style={{ margin: 0 }}>
                {userResults["recyclables"].map((item: RecyclableItem) => (
                  <li>
                    {item["name"]}
                    <span style={{ color: "red" }}>
                      {" (" + item["checklist"] + ")"}
                    </span>
                  </li>
                ))}
              </ul>
            </p>
          )}
          {userResults["goodDonatables"].length !== 0 && (
            <p>
              These donatables in good condition may be donated at the nearest
              donation centers:
              <ul style={{ margin: 0 }}>
                {userResults["preferredGDLoc"].map(
                  (item: LocationInfo | null, i: number) => (
                    <li>
                      {userResults["goodDonatables"][i]["donatable_type"] +
                        ": "}
                      {item === null ? (
                        "No location found, consider either reusing this item or diposing as general waste instead."
                      ) : (
                        <span style={{ color: "green" }}>
                          {item["name"]} at {item["address"]}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </p>
          )}
          {userResults["repairDonatables"].length !== 0 && (
            <p>
              These unspoilt donatables may be repaired at the nearest repair
              facilities:
              <ul style={{ margin: 0 }}>
                {userResults["preferredRDLoc"].map(
                  (item: LocationInfo | null, i: number) => (
                    <li>
                      {userResults["repairDonatables"][i]["donatable_type"] +
                        ": "}
                      {item === null ? (
                        "No location found, consider either reusing this item, searching for alternative repair channels, or diposing as general waste instead."
                      ) : (
                        <span style={{ color: "green" }}>
                          {item["name"]} at {item["address"]}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </p>
          )}
          {userResults["ebinEwaste"].length !== 0 && (
            <p>
              These Ewaste items may be disposed off at the nearest suitable
              ebins:
              <ul style={{ margin: 0 }}>
                {userResults["preferredEELoc"].map(
                  (item: LocationInfo | null, i: number) => (
                    <li>
                      {userResults["ebinEwaste"][i]["ewaste_type"] + ": "}
                      {item === null ? (
                        "No location found, consider other methods of disposal (eg ALBA Collection Drives or Apple/Samsung Trade-ins) where applicable, else dispose as general waste."
                      ) : (
                        <span style={{ color: "green" }}>
                          {item["name"]} at {item["address"]}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </p>
          )}
          {userResults["regulatedEwaste"].length !== 0 && (
            <p>
              These regulated Ewaste items may be dropped off at{" "}
              <a
                href="https://alba-ewaste.sg/drop-off-at-collection-events/"
                target="_blank"
                rel="noreferrer noopener"
              >
                ALBA's E-Collection Drive
              </a>
              :
              <ul style={{ margin: 0 }}>
                {userResults["regulatedEwaste"].map((item: EwasteItem) => {
                  return <li>{item["ewaste_type"]}</li>;
                })}
              </ul>
            </p>
          )}
          {userResults["goodEwaste"].length !== 0 && (
            <p>
              These Ewaste items in good condition may be donated instead of
              being disposed:
              <ul style={{ margin: 0 }}>
                {userResults["preferredGELoc"].map(
                  (item: LocationInfo | null, i: number) => (
                    <li>
                      {userResults["goodEwaste"][i]["ewaste_type"] + ": "}
                      {item === null ? (
                        "No location found, consider other methods of disposal (eg ALBA Collection Drives or Apple/Samsung Trade-ins) where applicable, else dispose as general waste."
                      ) : (
                        <span style={{ color: "green" }}>
                          {item["name"]} at {item["address"]}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </p>
          )}
          {userResults["repairEwaste"].length !== 0 && (
            <p>
              These Ewaste items which are damaged but unspoilt may be repaired
              instead:
              <ul style={{ margin: 0 }}>
                {userResults["preferredRELoc"].map(
                  (item: LocationInfo | null, i: number) => (
                    <li>
                      {userResults["repairEwaste"][i]["ewaste_type"] + ": "}
                      {item === null ? (
                        "No location found, consider other methods of disposal (eg ALBA Collection Drives or Apple/Samsung Trade-ins) where applicable, else dispose as general waste."
                      ) : (
                        <span style={{ color: "green" }}>
                          {item["name"]} at {item["address"]}
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </p>
          )}
          {userResults["userLocation"] !== null && (
            <p>
              Your input location: Latitude {userResults["userLocation"][0]},
              Longitude {userResults["userLocation"][1]}
            </p>
          )}
        </Box>
      )}
    </>
  );
}

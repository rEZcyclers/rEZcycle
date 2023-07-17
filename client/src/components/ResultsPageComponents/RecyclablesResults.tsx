import { Box, Button, Typography } from "@mui/material";
import { LocationInfo, RecyclableItem } from "../../DataTypes";

interface Props {
  recyclablesResults: RecyclableItem[];
  showBluebin: boolean;
  handleShowBluebin: () => void;
  closestBBLoc: LocationInfo | null;
}

export default function RecyclablesResults({
  recyclablesResults,
  showBluebin,
  handleShowBluebin,
  closestBBLoc,
}: Props) {
  return (
    <>
      {recyclablesResults.length != 0 && (
        <Box flex={1}>
          <h2>Recyclables</h2>
          <h4 style={{ margin: 0 }}>
            These items can be recycled at the nearest blue bins:
          </h4>
          <p style={{ margin: 0, color: "red" }}>
            {showBluebin &&
              closestBBLoc != null &&
              `Closest bluebin: ${closestBBLoc["address"]}`}
          </p>
          <Button
            variant={showBluebin ? "contained" : "outlined"}
            sx={{
              mt: 1,
              height: 50,
              fontSize: "small",
            }}
            disabled={closestBBLoc === null}
            onClick={() => {
              handleShowBluebin();
            }}
          >
            Show nearest Blue Bin
          </Button>
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
    </>
  );
}

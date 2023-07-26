import { Box, Typography } from "@mui/material";
import { LocationInfo, RecyclableItem } from "../../DataTypes";

interface Props {
  recyclablesResults: RecyclableItem[];
  showClosest: boolean;
  closestBBLoc: LocationInfo | null;
}

export default function RecyclablesResults({
  recyclablesResults,
  showClosest,
  closestBBLoc,
}: Props) {
  return (
    <>
      {recyclablesResults.length != 0 && (
        <Box flex={1}>
          <h2>Recyclables</h2>
          <h4 style={{ margin: 0 }}>
            These items can be recycled at your nearest blue bin:
          </h4>
          <p style={{ margin: 0, color: "red" }}>
            {showClosest &&
              closestBBLoc != null &&
              `Closest bluebin: ${closestBBLoc["address"]}`}
          </p>
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

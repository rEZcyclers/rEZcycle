import { Box, Button, Typography } from "@mui/material";
import { RecyclableItem } from "../../DataTypes";

interface Props {
  recyclablesResults: RecyclableItem[];
  showBluebin: boolean;
  handleShowBluebin: () => void;
}

export default function RecyclablesResults({
  recyclablesResults,
  showBluebin,
  handleShowBluebin,
}: Props) {
  return (
    <>
      {recyclablesResults.length != 0 && (
        <Box flex={1}>
          <h2>Recyclables</h2>
          <h4>These items can be recycled at the nearest blue bins:</h4>
          <Button
            variant={showBluebin ? "contained" : "outlined"}
            sx={{
              mt: 1,
              height: 50,
              fontSize: "small",
            }}
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

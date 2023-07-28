import { Box, Stack, Typography } from "@mui/material";
import { DonatableItem, RecyclableItem } from "../../DataTypes";
import { Margin } from "@mui/icons-material";

interface Props {
  unrecyclablesResults: RecyclableItem[];
  spoiltDonatables: DonatableItem[];
}

export default function SpoiltResults({
  unrecyclablesResults,
  spoiltDonatables,
}: Props) {
  return (
    <>
      {(unrecyclablesResults.length != 0 || spoiltDonatables.length != 0) && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 5,
            padding: 2,
            marginTop: 3,
          }}
        >
          <h2 style={{ margin: 0 }}>
            These items need to be disposed as general waste:
          </h2>
          <Stack>
            {unrecyclablesResults.length != 0 && (
              <>
                <h3 style={{ margin: 0, fontStyle: "italic" }}>
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
                <h3 style={{ margin: 0, fontStyle: "italic" }}>
                  (Spoilt Donatables)
                </h3>
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
        </Box>
      )}
    </>
  );
}

import { Stack, Typography } from "@mui/material";
import { DonatableItem, RecyclableItem } from "../../DataTypes";

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
    </>
  );
}

import { RecyclableItems } from "./QueryPageComponents/Recyclables";
import { DonatableItems } from "./QueryPageComponents/Donatables";
import { EWasteItems } from "./QueryPageComponents/EWaste";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  stage: number;
  setStage: (num: number) => void;
  selectedItems: boolean[][];
  recyclableConditions: boolean[];
  setRecyclableConditions: (newArray: boolean[]) => void;
  donatableConditions: Condition[];
  setDonatableConditions: (newArray: Condition[]) => void;
  eWasteConditions: Condition[];
  setEWasteConditions: (newArray: Condition[]) => void;
}

const flatRecyclableItems = RecyclableItems.flatMap((cat) => cat);
type Condition = "Good" | "Repairable" | "Spoilt" | "";

const ResultsPage = ({
  selectedItems,
  recyclableConditions,
  donatableConditions,
  eWasteConditions,
}: Props) => {
  return (
    <>
      <h1>Here's where to recycle your items</h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box flex={1}>
          <h2>Recyclables</h2>
          <h4>Here's where to recycle these items</h4>
          {selectedItems[0]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && recyclableConditions[i])
            .map((i) => (
              <Typography variant="body1">
                {flatRecyclableItems[i]["name"]}
              </Typography>
            ))}
          <h4>Please clean these items before recycling</h4>
          {selectedItems[0]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && !recyclableConditions[i])
            .map((i) => (
              <Typography variant="body1">
                {flatRecyclableItems[i]["name"]}
              </Typography>
            ))}
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          <h4>Here's where to donate these items</h4>
          {selectedItems[1]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && donatableConditions[i] == "Good")
            .map((i) => (
              <Typography variant="body1">
                {DonatableItems[i]["name"]}
              </Typography>
            ))}
          <h4>Here's where to repair these items</h4>
          {selectedItems[1]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && donatableConditions[i] == "Repairable")
            .map((i) => (
              <Typography variant="body1">
                {DonatableItems[i]["name"]}
              </Typography>
            ))}
        </Box>
        <Box flex={1}>
          <h2>EWaste</h2>
          <h4>Here's where to donate these items</h4>
          {selectedItems[2]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && eWasteConditions[i] == "Good")
            .map((i) => (
              <Typography variant="body1">{EWasteItems[i]["name"]}</Typography>
            ))}
          <h4>Here's where to repair these items</h4>
          {selectedItems[2]
            .map((selected, i) => (selected ? i : -1))
            .filter((i) => i != -1 && eWasteConditions[i] == "Repairable")
            .map((i) => (
              <Typography variant="body1">{EWasteItems[i]["name"]}</Typography>
            ))}
        </Box>
      </Stack>
      <h2>Here's where to throw these items</h2>
      <Stack>
        {selectedItems[0]
          .map((selected, i) => (selected ? i : -1))
          .filter(
            (i) => i != -1 && flatRecyclableItems[i]["blueBin_Eligibility"] == 0
          )
          .map((i) => (
            <Typography variant="body1">
              {flatRecyclableItems[i]["name"]}
            </Typography>
          ))}
        {selectedItems[1]
          .map((selected, i) => (selected ? i : -1))
          .filter((i) => i != -1 && donatableConditions[i] == "Spoilt")
          .map((i) => (
            <Typography variant="body1">{DonatableItems[i]["name"]}</Typography>
          ))}
        {selectedItems[1]
          .map((selected, i) => (selected ? i : -1))
          .filter((i) => i != -1 && eWasteConditions[i] == "Spoilt")
          .map((i) => (
            <Typography variant="body1">{EWasteItems[i]["name"]}</Typography>
          ))}
      </Stack>
    </>
  );
};

export default ResultsPage;

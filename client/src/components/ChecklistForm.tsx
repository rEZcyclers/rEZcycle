import { RecyclableItems } from "./QueryFormComponents/Recyclables";
import { DonatableItems } from "./QueryFormComponents/Donatables";
import { EWasteItems } from "./QueryFormComponents/EWaste";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
  Stack,
} from "@mui/material";

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

const ChecklistPage = ({
  setStage,
  selectedItems,
  recyclableConditions,
  setRecyclableConditions,
  donatableConditions,
  setDonatableConditions,
  eWasteConditions,
  setEWasteConditions,
}: Props) => {
  // Keeping track of conditions of selected recyclables
  const handleRecyclableChange = (i: number) => {
    setRecyclableConditions([
      ...recyclableConditions.slice(0, i),
      !recyclableConditions[i],
      ...recyclableConditions.slice(i + 1),
    ]);
  };

  // Keeping track of conditions of selected donatables
  const handleDonatableChange = (event: SelectChangeEvent, i: number) => {
    setDonatableConditions([
      ...donatableConditions.slice(0, i),
      event.target.value as Condition,
      ...donatableConditions.slice(i + 1),
    ]);
  };

  // Keeping track of conditions of selected E-Waste
  const handleEWasteChange = (event: SelectChangeEvent, i: number) => {
    setEWasteConditions([
      ...eWasteConditions.slice(0, i),
      event.target.value as Condition,
      ...eWasteConditions.slice(i + 1),
    ]);
  };

  const handleClick = () => {
    setStage(3);
  };

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box flex={1}>
          <h2>Recyclables</h2>
          <h4>Have you checked your recyclables?</h4>
          <FormGroup>
            {selectedItems[0]
              .map((selected, index) => (selected ? index : -1))
              .filter(
                (index) =>
                  index != -1 &&
                  flatRecyclableItems[index]["blueBin_Eligibility"] != 0
              )
              .map((index) => (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          mt: -1,
                        }}
                        onChange={() => handleRecyclableChange(index)}
                      />
                    }
                    label={
                      flatRecyclableItems[index]["name"] +
                      ": " +
                      flatRecyclableItems[index]["checklist"]
                    }
                    sx={{ alignItems: "flex-start" }}
                  />
                </>
              ))}
          </FormGroup>
          <h4>
            These items are not recyclable, please dispose of them as general
            waste:
          </h4>
          <Stack>
            {selectedItems[0]
              .map((item, index) => (item ? index : -1))
              .filter(
                (index) =>
                  index != -1 &&
                  flatRecyclableItems[index]["blueBin_Eligibility"] == 0
              )
              .map((index) => (
                <Typography variant="body1">
                  {flatRecyclableItems[index]["name"]}
                </Typography>
              ))}
          </Stack>
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          <h4>What is the condition of your item?</h4>
          <Stack spacing={1}>
            {selectedItems[1]
              .map((selected, index) => (selected ? index : -1))
              .filter((index) => index != -1)
              .map((index) => (
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl fullWidth sx={{ flex: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Condition
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={donatableConditions[index]}
                      label="Condition"
                      onChange={(event) => handleDonatableChange(event, index)}
                    >
                      <MenuItem value={"Good"}>Good</MenuItem>
                      <MenuItem value={"Repairable"}>Repairable</MenuItem>
                      <MenuItem value={"Spoilt"}>Spoilt</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body1" sx={{ flex: 3 }}>
                    {DonatableItems[index]["name"]}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Box>
        <Box flex={1}>
          <h2>E-waste</h2>
          <h4>What is the condition of your item?</h4>
          <Stack spacing={1}>
            {selectedItems[2]
              .map((selected, index) => (selected ? index : -1))
              .filter((index) => index != -1)
              .map((index) => (
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl fullWidth sx={{ flex: 2 }}>
                    <InputLabel id="demo-simple-select-label">
                      Condition
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={eWasteConditions[index]}
                      label="Condition"
                      onChange={(event) => handleEWasteChange(event, index)}
                    >
                      <MenuItem value={"Good"}>Good</MenuItem>
                      <MenuItem value={"Repairable"}>Repairable</MenuItem>
                      <MenuItem value={"Spoilt"}>Spoilt</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body1" sx={{ flex: 3 }}>
                    {EWasteItems[index]["name"]}
                  </Typography>
                </Stack>
              ))}
          </Stack>
        </Box>
      </Stack>
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={handleClick} sx={{ mr: 10 }}>
          Next
        </Button>
      </Box>
    </>
  );
};

export default ChecklistPage;

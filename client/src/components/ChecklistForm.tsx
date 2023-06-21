import { useContext } from "react";
import { backendContext } from "../App";
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

type Condition = "Good" | "Repairable" | "Spoilt" | "";
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

function ChecklistForm({
  setStage,
  selectedItems,
  recyclableConditions,
  setRecyclableConditions,
  donatableConditions,
  setDonatableConditions,
  eWasteConditions,
  setEWasteConditions,
}: Props) {
  // Retrieves raw data to get checklist info
  const { recyclablesData, donatablesData, eWasteData } =
    useContext(backendContext);

  // Keeps track of conditions of selected recyclables
  const handleRecyclableChange = (i: number) => {
    setRecyclableConditions([
      ...recyclableConditions.slice(0, i),
      !recyclableConditions[i],
      ...recyclableConditions.slice(i + 1),
    ]);
  };

  // Keeps track of conditions of selected donatables
  const handleDonatableChange = (event: SelectChangeEvent, i: number) => {
    setDonatableConditions([
      ...donatableConditions.slice(0, i),
      event.target.value as Condition,
      ...donatableConditions.slice(i + 1),
    ]);
  };

  // Keeps track of conditions of selected E-Waste
  const handleEWasteChange = (event: SelectChangeEvent, i: number) => {
    setEWasteConditions([
      ...eWasteConditions.slice(0, i),
      event.target.value as Condition,
      ...eWasteConditions.slice(i + 1),
    ]);
  };

  const handleNextClick = () => {
    setStage(3);
  };

  const handleBackClick = () => {
    setStage(1);
  };

  const recyclablesChecklist = selectedItems[0]
    .map((selected, index) => (selected ? index : -1))
    .filter(
      (index) =>
        index != -1 && recyclablesData[index]["bluebin_eligibility"] != 0
    )
    .map((index) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={recyclableConditions[index]}
            sx={{
              mt: -1,
            }}
            onChange={() => handleRecyclableChange(index)}
          />
        }
        label={
          recyclablesData[index]["name"] +
          ": " +
          recyclablesData[index]["checklist"]
        }
        sx={{ alignItems: "flex-start" }}
      />
    ));

  const unrecyclables = selectedItems[0]
    .map((sel, i) => (sel ? i : -1))
    .filter((i) => i != -1 && recyclablesData[i]["bluebin_eligibility"] === 0)
    .map((index) => <li>{recyclablesData[index]["name"]}</li>);

  const donatablesChecklist = selectedItems[1]
    .map((selected, index) => (selected ? index : -1))
    .filter((index) => index != -1)
    .map((index) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl fullWidth sx={{ flex: 2 }}>
          <InputLabel id="demo-simple-select-label">Condition</InputLabel>
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
          {donatablesData[index]["donatable_type"]}
        </Typography>
      </Stack>
    ));

  const eWasteChecklist = selectedItems[2]
    .map((selected, index) => (selected ? index : -1))
    .filter((index) => index != -1)
    .map((index) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl fullWidth sx={{ flex: 2 }}>
          <InputLabel id="demo-simple-select-label">Condition</InputLabel>
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
          {eWasteData[index]["eWaste_type"]}
        </Typography>
      </Stack>
    ));

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        {(recyclablesChecklist.length !== 0 || unrecyclables.length !== 0) && (
          <Box flex={1}>
            <h2>Recyclables</h2>
            {recyclablesChecklist.length !== 0 && (
              <>
                <h4>Have you checked your recyclables?</h4>
                <FormGroup>{recyclablesChecklist}</FormGroup>
              </>
            )}
            {unrecyclables.length !== 0 && (
              <>
                <h4>
                  These items are not recyclable, please dispose of them as
                  general waste:
                </h4>
                <ul>{unrecyclables}</ul>
              </>
            )}
          </Box>
        )}
        {donatablesChecklist.length !== 0 && (
          <Box flex={1}>
            <h2>Donatables</h2>
            <h4>How is the condition of your donatable?</h4>
            <Stack spacing={1}>{donatablesChecklist}</Stack>
          </Box>
        )}
        {eWasteChecklist.length !== 0 && (
          <Box flex={1}>
            <h2>E-waste</h2>
            <h4>How is the condition of your E-Waste?</h4>
            <Stack spacing={1}>{eWasteChecklist}</Stack>
          </Box>
        )}
      </Stack>
      <Box
        justifyContent="right"
        sx={{
          mt: 4,
          display: "flex",
          flexWrap: "nowrap",
          flexDirection: "row",
        }}
      >
        <Button variant="outlined" onClick={handleBackClick} sx={{ mr: 10 }}>
          Back
        </Button>
        <Button variant="outlined" onClick={handleNextClick} sx={{ mr: 10 }}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default ChecklistForm;

import { useContext, useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";

type Condition = "Good" | "Repairable" | "Spoilt" | "";
interface Props {
  setStage: (num: number) => void;
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  recyclableConditions: boolean[];
  setRecyclableConditions: (newArray: boolean[]) => void;
  donatableConditions: Condition[];
  setDonatableConditions: (newArray: Condition[]) => void;
  ewasteConditions: Condition[];
  setEwasteConditions: (newArray: Condition[]) => void;
}

function ChecklistForm({
  setStage,
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  recyclableConditions,
  setRecyclableConditions,
  donatableConditions,
  setDonatableConditions,
  ewasteConditions,
  setEwasteConditions,
}: Props) {
  // State to show an alert for invalid user actions, i.e. pressing Next without completing the checklist
  const [showAlert, setShowAlert] = useState(false);

  // Retrieves raw data to get checklist info
  const { recyclablesData, donatablesData, ewasteData } =
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

  // Keeps track of conditions of selected E-waste
  const handleEwasteChange = (event: SelectChangeEvent, i: number) => {
    setEwasteConditions([
      ...ewasteConditions.slice(0, i),
      event.target.value as Condition,
      ...ewasteConditions.slice(i + 1),
    ]);
  };

  const handleNextClick = () => {
    if (isChecklistComplete()) setStage(3);
    else setShowAlert(true);
  };

  const isChecklistComplete = () => {
    for (let i = 0; i < selectedRecyclables.length; i++) {
      if (selectedRecyclables[i] && !recyclableConditions[i]) return false;
    }
    for (let i = 0; i < selectedDonatables.length; i++) {
      if (selectedDonatables[i] && !donatableConditions[i]) return false;
    }
    for (let i = 0; i < selectedEwaste.length; i++) {
      if (selectedEwaste[i] && !ewasteConditions[i]) return false;
    }
    return true;
  };

  const handleBackClick = () => {
    setStage(1);
  };

  const closeAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowAlert(false);
  };

  const recyclablesChecklist = selectedRecyclables
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
          <>
            <p style={{ margin: 0, padding: 0 }}>
              {recyclablesData[index]["name"]}:
            </p>
            <p style={{ margin: 0, padding: 0, color: "purple" }}>
              {recyclablesData[index]["checklist"]}
            </p>
          </>
        }
        sx={{ alignItems: "flex-start" }}
      />
    ));

  const unrecyclables = selectedRecyclables
    .map((sel, i) => (sel ? i : -1))
    .filter((i) => i != -1 && recyclablesData[i]["bluebin_eligibility"] === 0)
    .map((index) => <li>{recyclablesData[index]["name"]}</li>);

  const donatablesChecklist = selectedDonatables
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

  const ewasteChecklist = selectedEwaste
    .map((selected, index) => (selected ? index : -1))
    .filter((index) => index != -1)
    .map((index) => (
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl fullWidth sx={{ flex: 2 }}>
          <InputLabel id="demo-simple-select-label">Condition</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ewasteConditions[index]}
            label="Condition"
            onChange={(event) => handleEwasteChange(event, index)}
          >
            <MenuItem value={"Good"}>Good</MenuItem>
            <MenuItem value={"Repairable"}>Repairable</MenuItem>
            <MenuItem value={"Spoilt"}>Spoilt</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body1" sx={{ flex: 3 }}>
          {ewasteData[index]["ewaste_type"]}
        </Typography>
      </Stack>
    ));

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{ flexWrap: "wrap" }}
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
        {ewasteChecklist.length !== 0 && (
          <Box flex={1}>
            <h2>E-waste</h2>
            <h4>How is the condition of your E-waste?</h4>
            <Stack spacing={1}>{ewasteChecklist}</Stack>
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
        <Button
          variant="outlined"
          onClick={handleBackClick}
          sx={{ mr: 10, mb: 10 }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextClick}
          sx={{ mr: 10, mb: 10 }}
        >
          Next
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={2500}
        onClose={closeAlert}
      >
        <Alert
          onClose={closeAlert}
          severity="error"
          sx={{ width: "100%", borderRadius: 7 }}
        >
          Please complete the checklist before proceeding.
        </Alert>
      </Snackbar>
    </>
  );
}

export default ChecklistForm;

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
import InfoIcon from "@mui/icons-material/Info";

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
  const { recyclablesData, donatablesData, ewasteData, sideBarState } =
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
    if (isChecklistComplete()) {
      setStage(3);
      sideBarState[1](false);
    } else setShowAlert(true);
  };

  const isChecklistComplete = () => {
    for (let i = 0; i < selectedRecyclables.length; i++) {
      if (
        recyclablesData[i]["bluebin_eligibility"] != 0 &&
        selectedRecyclables[i] &&
        !recyclableConditions[i]
      )
        return false;
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
    if (reason === "clickaway") {
      console.log(event);
      return;
    }
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
    .map((selected, index) => {
      if (!selected) return -1;
      if (ewasteData[index]["ewaste_type"] === "Batteries") {
        ewasteConditions[index] = "Spoilt";
      }
      return index;
    })
    .filter((index) => index != -1)
    .map((index) => (
      <Stack direction="row" spacing={2} alignItems="center">
        {ewasteData[index]["ewaste_type"] === "Batteries" ? (
          <Typography variant="body1" sx={{ flex: 2, maxWidth: 300 }}>
            {"(Used batteries are considered spoilt by default)"}
          </Typography>
        ) : (
          <FormControl fullWidth sx={{ flex: 2, maxWidth: 300 }}>
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
        )}
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
        sx={{ flexWrap: "wrap", marginTop: 5 }}
      >
        {(recyclablesChecklist.length !== 0 || unrecyclables.length !== 0) && (
          <Box
            flex={1}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.5)",
              maxWidth: 600,
              padding: "0px 20px 20px 20px",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Recyclables</h2>
            {recyclablesChecklist.length !== 0 && (
              <>
                <h4 style={{ textAlign: "center" }}>
                  Have you checked your recyclables?
                </h4>
                <FormGroup
                  sx={{
                    padding: 2,
                    borderRadius: 5,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    maxWidth: 600,
                  }}
                >
                  {recyclablesChecklist}
                </FormGroup>
              </>
            )}
            {unrecyclables.length !== 0 && (
              <>
                <h4 style={{ color: "red" }}>
                  These items are not recyclable, please dispose of them as
                  general waste:
                </h4>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: 5,
                    padding: 1,
                  }}
                >
                  <ul style={{ marginLeft: -10 }}>{unrecyclables}</ul>
                </Box>
              </>
            )}
          </Box>
        )}
        {donatablesChecklist.length !== 0 && (
          <Box
            flex={1}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.7)",
              maxWidth: 500,
              padding: "0px 20px 20px 20px",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Donatables</h2>
            <h4 style={{ textAlign: "center" }}>
              What is the condition of your donatable?
            </h4>
            <Stack direction={"row"} alignItems={"center"} sx={{ mt: -3 }}>
              <InfoIcon sx={{ mr: 1 }} color={"info"} />
              <p>Items in different conditions will be processed differently</p>
            </Stack>
            <Stack
              spacing={1}
              sx={{
                padding: 2,
                borderRadius: 5,
                backgroundColor: "white",
                maxWidth: 500,
              }}
            >
              {donatablesChecklist}
            </Stack>
          </Box>
        )}
        {ewasteChecklist.length !== 0 && (
          <Box
            flex={1}
            sx={{
              borderRadius: 5,
              backgroundColor: "rgba(255,255,255,0.7)",
              maxWidth: 500,
              padding: "0px 20px 20px 20px",
            }}
          >
            <h2 style={{ textAlign: "center" }}>E-waste</h2>
            <h4 style={{ textAlign: "center" }}>
              What is the condition of your E-waste?
            </h4>
            <Stack direction={"row"} alignItems={"center"} sx={{ mt: -3 }}>
              <InfoIcon sx={{ mr: 1 }} color={"info"} />
              <p>Items in different conditions will be processed differently</p>
            </Stack>
            <Stack
              spacing={1}
              sx={{
                padding: 2,
                borderRadius: 5,
                backgroundColor: "white",
                maxWidth: 500,
              }}
            >
              {ewasteChecklist}
            </Stack>
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
          sx={{ mr: 10, mb: 10, backgroundColor: "white" }}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={handleNextClick}
          sx={{ mr: 10, mb: 10, backgroundColor: "white" }}
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

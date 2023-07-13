import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Recyclables from "./QueryFormComponents/Recyclables";
import Donatables from "./QueryFormComponents/Donatables";
import Ewaste from "./QueryFormComponents/Ewaste";
import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";

interface Props {
  setStage: (num: number) => void;
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  setSelectedRecyclables: (newArray: boolean[]) => void;
  setSelectedDonatables: (newArray: boolean[]) => void;
  setSelectedEwaste: (newArray: boolean[]) => void;
  numSelectedItems: number;
  setNumSelectedItems: (num: number) => void;
}

function QueryForm({
  setStage,
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  setSelectedRecyclables,
  setSelectedDonatables,
  setSelectedEwaste,
  numSelectedItems,
  setNumSelectedItems,
}: Props) {
  // Handle invalid user input, i.e. pressing Next without any selected items
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const clearForm = () => {
    setSelectedRecyclables(new Array<boolean>(selectedRecyclables.length));
    setSelectedDonatables(new Array<boolean>(selectedDonatables.length));
    setSelectedEwaste(selectedEwaste.fill(false));
    setNumSelectedItems(0);
  };

  // Initial method was to just call a atLeastOneSelected() method to loop through
  // all arrays, without having to use the extra numSelectedItems state.
  // The main reason state is used is so that everytime an item is selected/unselected,
  // we can quickly check in O(1) time if numSelectedItems === 0 to change the UI of
  // the 'clear' button. If we didn't use state, then atLeastOneSelected() of O(n) time
  // is called everytime we select/unselect an item, which is kinda wasteful, so an extra
  // state is used just for this purpose of having a nicer UI lol.
  const proceedToChecklist = () => {
    if (numSelectedItems >= 1) setStage(2);
    else setShowAlert(true);
  };

  const closeAlert = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setShowAlert(false);
  };

  return (
    <>
      <h1>What would you like to recycle today?</h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
        sx={{ flexWrap: "wrap" }}
      >
        <Box flex={1}>
          <h2>Recyclables</h2>
          <Recyclables
            selectedRecyclables={selectedRecyclables}
            setSelectedRecyclables={setSelectedRecyclables}
            numSelectedItems={numSelectedItems}
            setNumSelectedItems={setNumSelectedItems}
          />
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          <Donatables
            selectedDonatables={selectedDonatables}
            setSelectedDonatables={setSelectedDonatables}
            numSelectedItems={numSelectedItems}
            setNumSelectedItems={setNumSelectedItems}
          />
        </Box>
        <Box flex={1}>
          <h2>E-waste</h2>
          <Ewaste
            selectedEwaste={selectedEwaste}
            setSelectedEwaste={setSelectedEwaste}
            numSelectedItems={numSelectedItems}
            setNumSelectedItems={setNumSelectedItems}
          />
        </Box>
      </Stack>
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearForm}
          disabled={numSelectedItems === 0}
          sx={{ mr: 10 }}
        >
          Clear
        </Button>
        <Button variant="outlined" onClick={proceedToChecklist} sx={{ mr: 10 }}>
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
          Please select at least one item before proceeding.
        </Alert>
      </Snackbar>
    </>
  );
}

export default QueryForm;

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Recyclables from "./QueryFormComponents/Recyclables";
import Donatables from "./QueryFormComponents/Donatables";
import Ewaste from "./QueryFormComponents/Ewaste";
import { Button } from "@mui/material";

interface Props {
  setStage: (num: number) => void;
  selectedRecyclables: boolean[];
  selectedDonatables: boolean[];
  selectedEwaste: boolean[];
  setSelectedRecyclables: (newArray: boolean[]) => void;
  setSelectedDonatables: (newArray: boolean[]) => void;
  setSelectedEwaste: (newArray: boolean[]) => void;
}

function QueryForm({
  setStage,
  selectedRecyclables,
  selectedDonatables,
  selectedEwaste,
  setSelectedRecyclables,
  setSelectedDonatables,
  setSelectedEwaste,
}: Props) {
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
          />
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          <Donatables
            selectedDonatables={selectedDonatables}
            setSelectedDonatables={setSelectedDonatables}
          />
        </Box>
        <Box flex={1}>
          <h2>E-waste</h2>
          <Ewaste
            selectedEwaste={selectedEwaste}
            setSelectedEwaste={setSelectedEwaste}
          />
        </Box>
      </Stack>
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={() => setStage(2)} sx={{ mr: 10 }}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default QueryForm;

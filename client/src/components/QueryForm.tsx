import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Recyclables from "./QueryFormComponents/Recyclables";
import Donatables from "./QueryFormComponents/Donatables";
import EWaste from "./QueryFormComponents/EWaste";
import { Button } from "@mui/material";

interface Props {
  stage: number;
  setStage: (num: number) => void;
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function QueryPage(props: Props) {
  const handleClick = () => {
    props.setStage(2);
  };
  return (
    <>
      <h1>What would you like to recycle today?</h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box flex={1}>
          <h2>Recyclables</h2>
          <Recyclables
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
          />
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          <Donatables
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
          />
        </Box>
        <Box flex={1}>
          <h2>E-waste</h2>
          <EWaste
            selectedItems={props.selectedItems}
            setSelectedItems={props.setSelectedItems}
          />
        </Box>
      </Stack>
      <Box display="flex" justifyContent="right" sx={{ mt: 4 }}>
        <Button variant="outlined" onClick={handleClick} sx={{ mr: 10 }}>
          Next
        </Button>
      </Box>
    </>
  );
}

export default QueryPage;
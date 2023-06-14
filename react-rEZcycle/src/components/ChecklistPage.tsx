import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

interface Props {
  stage: number;
  setStage: (num: number) => void;
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}
const ChecklistPage = ({ stage, selectedItems, setSelectedItems }: Props) => {
  const handleClick = () => {
    console.log(selectedItems);
  };
  return (
    <>
      <div>ChecklistPage</div>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box flex={1}>
          <h2>Recyclables</h2>
          {selectedItems[0]
            .map((item, index) => (item ? index : -1))
            .filter((index) => index != -1)
            .map((index) => (
              <p>{index}</p>
            ))}
        </Box>
        <Box flex={1}>
          <h2>Donatables</h2>
          {selectedItems[1]
            .map((item, index) => (item ? index : -1))
            .filter((index) => index != -1)
            .map((index) => (
              <p>{index}</p>
            ))}
        </Box>
        <Box flex={1}>
          <h2>E-waste</h2>
          {selectedItems[2]
            .map((item, index) => (item ? index : -1))
            .filter((index) => index != -1)
            .map((index) => (
              <p>{index}</p>
            ))}
        </Box>
      </Stack>
    </>
  );
};

export default ChecklistPage;

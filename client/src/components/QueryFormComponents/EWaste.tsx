import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useContext, useState } from "react";
import { backendContext } from "../../App";
import { EwasteItem } from "../../DataTypes";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function Ewaste(props: Props) {
  const { ewasteData } = useContext(backendContext);

  // Chip selection logic
  type Fill = "outlined" | "filled";
  const [selectedChips, setSelectedChips] = useState<Fill[]>(
    props.selectedItems[2].map((sel) => (sel ? "filled" : "outlined"))
  );

  const toggleChipSelect = (id: number) => {
    setSelectedChips({
      ...selectedChips,
      [id]: selectedChips[id] == "outlined" ? "filled" : "outlined",
    });
    props.setSelectedItems([
      props.selectedItems[0],
      props.selectedItems[1],
      [
        ...props.selectedItems[2].slice(0, id),
        !props.selectedItems[2][id],
        ...props.selectedItems[2].slice(id + 1),
      ],
    ]);
  };

  // Display chips
  return (
    <>
      {ewasteData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {ewasteData.map((item: EwasteItem) => {
            return (
              <Chip
                key={item["ewaste_id"]}
                label={item["ewaste_type"]}
                color="secondary"
                variant={selectedChips[item["ewaste_id"] - 1]}
                onClick={() => toggleChipSelect(item["ewaste_id"] - 1)}
                size="medium"
                sx={{ mr: 1, mb: 1, fontSize: "0.9em" }}
              />
            );
          })}
        </Box>
      )}
    </>
  );
}

export default Ewaste;

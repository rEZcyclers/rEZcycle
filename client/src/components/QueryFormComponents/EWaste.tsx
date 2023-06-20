import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useContext, useState } from "react";
import { backendContext } from "../../App";
import { EWasteItem } from "../../DataTypes";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function EWaste(props: Props) {
  const { eWasteData } = useContext(backendContext);

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
      {eWasteData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {eWasteData.map((item: EWasteItem) => {
            return (
              <Chip
                key={item["eWaste_id"]}
                label={item["eWaste_type"]}
                variant={selectedChips[item["eWaste_id"] - 1]}
                onClick={() => toggleChipSelect(item["eWaste_id"] - 1)}
                sx={{ mr: 1, mb: 1 }}
              />
            );
          })}
        </Box>
      )}
    </>
  );
}

export default EWaste;

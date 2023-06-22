import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useContext, useState } from "react";
import { backendContext } from "../../App";
import { DonatableItem } from "../../DataTypes";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function Donatables(props: Props) {
  const { donatablesData } = useContext(backendContext);

  // Chip selection logic
  type Fill = "outlined" | "filled";
  const [selectedChips, setSelectedChips] = useState<Fill[]>(
    props.selectedItems[1].map((sel) => (sel ? "filled" : "outlined"))
  );

  const toggleChipSelect = (id: number) => {
    setSelectedChips({
      ...selectedChips,
      [id]: selectedChips[id] == "outlined" ? "filled" : "outlined",
    });
    props.setSelectedItems([
      props.selectedItems[0],
      [
        ...props.selectedItems[1].slice(0, id),
        !props.selectedItems[1][id],
        ...props.selectedItems[1].slice(id + 1),
      ],
      props.selectedItems[2],
    ]);
  };

  // Display chips
  return (
    <>
      {donatablesData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {donatablesData.map((item: DonatableItem) => {
            return (
              <Chip
                key={item["donatable_id"]}
                label={item["donatable_type"]}
                color="secondary"
                variant={selectedChips[item["donatable_id"] - 1]}
                onClick={() => toggleChipSelect(item["donatable_id"] - 1)}
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

export default Donatables;

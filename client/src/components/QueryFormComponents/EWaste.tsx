import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import React from "react";
import { useContext } from "react";
import { backendContext } from "../../App";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function EWaste(props: Props) {
  const { eWasteData } = useContext(backendContext);

  // Chip selection logic
  type Fill = "outlined" | "filled";
  const [selected, setSelected] = React.useState<Fill[]>(
    props.selectedItems[2].map((sel) => (sel ? "filled" : "outlined"))
  );

  const toggleSelected = (id: number) => {
    setSelected({
      ...selected,
      [id]: selected[id] == "outlined" ? "filled" : "outlined",
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
      {!eWasteData ? (
        <h1>Loading...</h1>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {eWasteData.map((item) => {
            return (
              <Chip
                key={item["id"]}
                label={item["name"]}
                variant={selected[item["id"] - 1]}
                onClick={() => toggleSelected(item["id"] - 1)}
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

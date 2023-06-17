import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import React from "react";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function EWaste(props: Props) {
  // Chip selection logic
  type Fill = "outlined" | "filled";
  const [selected, setSelected] = React.useState<Fill[]>(
    EWasteItems.map(() => "outlined")
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
    <Box display="flex" sx={{ flexWrap: "wrap" }}>
      {EWasteItems.map((item) => {
        return (
          <Chip
            label={item["name"]}
            variant={selected[item["id"] - 1]}
            onClick={() => toggleSelected(item["id"] - 1)}
            sx={{ mr: 1, mb: 1 }}
          />
        );
      })}
    </Box>
  );
}

export default EWaste;

export const EWasteItems = [
  {
    id: 1,
    name: "ICT Equipment",
  },
  {
    id: 2,
    name: "Batteries",
  },
  {
    id: 3,
    name: "Bulbs & Lamps",
  },
  {
    id: 4,
    name: "Large Household Appliances",
  },
  {
    id: 5,
    name: "Electric Mobility Devices",
  },
  {
    id: 6,
    name: "Non-regulated E-waste",
  },
];

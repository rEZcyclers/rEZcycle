import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import React from "react";

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function Donatables(props: Props) {
  // Chip selection logic

  type Fill = "outlined" | "filled";
  const [selected, setSelected] = React.useState<Fill[]>(
    DonatableItems.map(() => "outlined")
  );

  const toggleSelected = (id: number) => {
    setSelected({
      ...selected,
      [id]: selected[id] == "outlined" ? "filled" : "outlined",
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
    // props.setSelectedItems({
    //   ...props.selectedItems,
    //   [1]: { ...props.selectedItems[1], [id]: !props.selectedItems[1][id] },
    // });
  };

  return (
    <Box display="flex" sx={{ flexWrap: "wrap" }}>
      {DonatableItems.map((item) => {
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

export default Donatables;

export const DonatableItems = [
  {
    id: 1,
    name: "Baby and children's items",
  },
  {
    id: 2,
    name: "Bags and accessories",
  },
  {
    id: 3,
    name: "Books, Stationery",
  },
  {
    id: 4,
    name: "Clothing",
  },
  {
    id: 5,
    name: "Unexpired Dry or Canned Food",
  },
  {
    id: 6,
    name: "Furniture",
  },
  {
    id: 7,
    name: "Linen and Tableware",
  },
  {
    id: 8,
    name: "Shoes",
  },
  {
    id: 9,
    name: "Toys",
  },
];

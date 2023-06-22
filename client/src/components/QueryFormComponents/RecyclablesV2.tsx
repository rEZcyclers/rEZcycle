// NOTE: This component is merely a potential alternative to the 'Recyclables'
// component, it is not currently used in the program.

import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useContext } from "react";
import { backendContext } from "../../App";
import { RecyclableItem } from "../../DataTypes";
import { Box } from "@mui/material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

export default function RecyclablesV2(props: Props) {
  const { recyclablesData } = useContext(backendContext);

  const toggleSelect = (event: React.SyntheticEvent<Element, Event>) => {
    const item = event.target;
    const id = item["recyclable_id"] - 1;
    props.setSelectedItems([
      [
        ...props.selectedItems[0].slice(0, id),
        !props.selectedItems[0][id],
        ...props.selectedItems[0].slice(id + 1),
      ],
      props.selectedItems[1],
      props.selectedItems[2],
    ]);
  };

  const paperArr = recyclablesData.filter(
    (item: RecyclableItem) => item["material"] === "PAPER"
  );
  const plasticArr = recyclablesData.filter(
    (item: RecyclableItem) => item["material"] === "PLASTIC"
  );
  const glassArr = recyclablesData.filter(
    (item: RecyclableItem) => item["material"] === "GLASS"
  );
  const metalArr = recyclablesData.filter(
    (item: RecyclableItem) => item["material"] === "METAL"
  );
  const materials = [
    { label: "Paper", data: paperArr },
    { label: "Plastic", data: plasticArr },
    { label: "Glass", data: glassArr },
    { label: "Metal", data: metalArr },
  ];

  return (
    <>
      {recyclablesData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {materials.map((material) => {
            return (
              <Autocomplete
                multiple
                id="checkboxes-tags"
                options={material["data"]}
                disableCloseOnSelect
                onChange={(event) => toggleSelect(event)}
                getOptionLabel={(item: RecyclableItem) => item["name"]}
                renderOption={(props, item, { selected }) => (
                  <li style={{ color: "purple" }} {...props}>
                    {item["name"]}
                  </li>
                )}
                sx={{
                  width: 260,
                  marginBottom: 1,
                  borderTopColor: "#83F33A",
                  borderColor: "#83F33A",
                }}
                size="small"
                ChipProps={{ color: "secondary" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={material["label"]}
                    placeholder="Search"
                    style={{ color: "purple" }}
                  />
                )}
              />
            );
          })}
        </Box>
      )}
    </>
  );
}

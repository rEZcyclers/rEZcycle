// NOTE: This component is merely a potential alternative to the 'Recyclables'
// component, it is not currently used in the program.

import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useContext } from "react";
import { backendContext } from "../../App";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type recyclable = {
  recyclable_id: number;
  material: string;
  name: string;
};

export default function RecyclablesV2() {
  const { recyclablesData } = useContext(backendContext);
  const paperArr = recyclablesData.filter(
    (item: recyclable) => item["material"] === "PAPER"
  );
  const plasticArr = recyclablesData.filter(
    (item: recyclable) => item["material"] === "PLASTIC"
  );
  const glassArr = recyclablesData.filter(
    (item: recyclable) => item["material"] === "GLASS"
  );
  const metalArr = recyclablesData.filter(
    (item: recyclable) => item["material"] === "METAL"
  );
  const materials = [
    { label: "Paper", data: paperArr },
    { label: "Plastic", data: plasticArr },
    { label: "Glass", data: glassArr },
    { label: "Metal", data: metalArr },
  ];
  return materials.map((material) => {
    return (
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={material["data"]}
        disableCloseOnSelect
        getOptionLabel={(item: recyclable) => item["name"]}
        renderOption={(props, item, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {item["name"]}
          </li>
        )}
        style={{ width: 500 }}
        renderInput={(params) => (
          <TextField {...params} label={material["label"]} placeholder="" />
        )}
      />
    );
  });
}

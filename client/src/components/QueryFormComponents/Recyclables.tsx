import TextField from "@mui/material/TextField";
import Autocomplete, {
  AutocompleteChangeDetails,
} from "@mui/material/Autocomplete";
import { useContext} from "react";
import { backendContext } from "../../App";
import { RecyclableItem } from "../../DataTypes";
import { Button } from "@mui/material";

interface Props {
  selectedRecyclables: boolean[];
  setSelectedRecyclables: (newArray: boolean[]) => void;
  numSelectedItems: number;
  setNumSelectedItems: (num: number) => void;
}

export default function Recyclables({
  selectedRecyclables,
  setSelectedRecyclables,
  numSelectedItems,
  setNumSelectedItems,
}: Props) {
  const { recyclablesData } = useContext(backendContext);

  const materials = ["PAPER", "PLASTIC", "GLASS", "METAL"];
  const materialArrays = materials.map((material) => {
    return recyclablesData.filter(
      (item: RecyclableItem) => item["material"] === material
    );
  });

  const handleChange = (
    reason: string,
    details: AutocompleteChangeDetails<RecyclableItem> | undefined,
    materialIndex: number
  ) => {
    if ((reason === "selectOption" || reason === "removeOption") && details) {
      const target: RecyclableItem = details["option"];
      toggleRecyclableSelection(target["recyclable_id"] - 1);
    } else if (reason === "clear") {
      clearMaterialSelection(materialIndex);
    } else {
      console.log("Error with Recyclables Selection");
    }
  };

  const toggleRecyclableSelection = (index: number) => {
    setNumSelectedItems(
      selectedRecyclables[index] ? numSelectedItems - 1 : numSelectedItems + 1
    );
    setSelectedRecyclables([
      ...selectedRecyclables.slice(0, index),
      !selectedRecyclables[index],
      ...selectedRecyclables.slice(index + 1),
    ]);
  };

  const clearMaterialSelection = (materialIndex: number) => {
    let count = 0;
    const updatedSelectedRecyclables = selectedRecyclables.map((sel, i) => {
      if (recyclablesData[i]["material"] === materials[materialIndex]) {
        count += sel ? 1 : 0;
        return false;
      } else {
        return sel;
      }
    });
    setNumSelectedItems(numSelectedItems - count);
    setSelectedRecyclables(updatedSelectedRecyclables);
  };

  return (
    <>
      {materialArrays.map(
        (materialArray: RecyclableItem[], materialIndex: number) => {
          return (
            <Autocomplete
              data-testid={`materialAutocomplete-${materialIndex}`}
              key={materialIndex}
              multiple
              value={materialArray.filter(
                (item) => selectedRecyclables[item["recyclable_id"] - 1]
              )}
              id={`tags-standard${materialIndex}`}
              options={materialArray}
              onChange={(event, value, reason, details) => {
                event; // prevent unused declaration
                value; // prevent unused declaration
                handleChange(reason, details, materialIndex);
              }}
              getOptionLabel={(item: RecyclableItem) => item["name"]}
              renderOption={(props, item, { selected }) => (
                <li style={{ color: "purple" }} {...props}>
                  {"- " + item["name"]}
                  {/* prevent unused declaration */}
                  {selected}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={materials[materialIndex].toLowerCase()}
                  placeholder="Search"
                >
                  <Button>Close</Button>
                </TextField>
              )}
              sx={{
                minWidth: 240,
                maxWidth: 350,
                marginBottom: 1,
              }}
              ChipProps={{
                color: "secondary",
                sx: {
                  height: "auto",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                  },
                },
              }}
            />
          );
        }
      )}
    </>
  );
}

// // NOTE: This component is merely a potential alternative to the 'Recyclables'
// // component, it is not currently used in the program.

// import Checkbox from "@mui/material/Checkbox";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
// import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { useContext } from "react";
// import { backendContext } from "../../App";
// import { RecyclableItem } from "../../DataTypes";
// import { Box } from "@mui/material";

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// const checkedIcon = <CheckBoxIcon fontSize="small" />;

// interface Props {
//   selectedItems: boolean[][];
//   setSelectedItems: (newArray: boolean[][]) => void;
// }

// export default function RecyclablesV2(props: Props) {
//   const { recyclablesData } = useContext(backendContext);

//   const toggleSelect = (event: React.SyntheticEvent<Element, Event>) => {
//     const item = event.target;
//     const id = item["recyclable_id"] - 1;
//     props.setSelectedItems([
//       [
//         ...props.selectedItems[0].slice(0, id),
//         !props.selectedItems[0][id],
//         ...props.selectedItems[0].slice(id + 1),
//       ],
//       props.selectedItems[1],
//       props.selectedItems[2],
//     ]);
//   };

//   const paperArr = recyclablesData.filter(
//     (item: RecyclableItem) => item["material"] === "PAPER"
//   );
//   const plasticArr = recyclablesData.filter(
//     (item: RecyclableItem) => item["material"] === "PLASTIC"
//   );
//   const glassArr = recyclablesData.filter(
//     (item: RecyclableItem) => item["material"] === "GLASS"
//   );
//   const metalArr = recyclablesData.filter(
//     (item: RecyclableItem) => item["material"] === "METAL"
//   );
//   const materials = [
//     { label: "Paper", data: paperArr },
//     { label: "Plastic", data: plasticArr },
//     { label: "Glass", data: glassArr },
//     { label: "Metal", data: metalArr },
//   ];

//   return (
//     <>
//       {recyclablesData.length === 0 ? (
//         <h3>Loading...</h3>
//       ) : (
//         <Box display="flex" sx={{ flexWrap: "wrap" }}>
//           {materials.map((material) => {
//             return (
//               <Autocomplete
//                 multiple
//                 id="checkboxes-tags"
//                 options={material["data"]}
//                 disableCloseOnSelect
//                 onChange={(event) => toggleSelect(event)}
//                 getOptionLabel={(item: RecyclableItem) => item["name"]}
//                 renderOption={(props, item, { selected }) => (
//                   <li style={{ color: "purple" }} {...props}>
//                     {item["name"]}
//                   </li>
//                 )}
//                 sx={{
//                   width: 260,
//                   marginBottom: 1,
//                   borderTopColor: "#83F33A",
//                   borderColor: "#83F33A",
//                 }}
//                 size="small"
//                 ChipProps={{ color: "secondary" }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label={material["label"]}
//                     placeholder="Search"
//                     style={{ color: "purple" }}
//                   />
//                 )}
//               />
//             );
//           })}
//         </Box>
//       )}
//     </>
//   );
// }

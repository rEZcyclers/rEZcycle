import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface Props {
  selectedItems: boolean[][];
  setSelectedItems: (newArray: boolean[][]) => void;
}

function Recyclables(props: Props) {
  const [open, setOpen] = React.useState(RecyclableItems.map(() => false));

  const handleOpen = (modalIndex: number) => {
    setOpen({
      ...open,
      [modalIndex]: true,
    });
  };
  const handleClose = (modalIndex: number) => {
    setOpen({
      ...open,
      [modalIndex]: false,
    });
  };

  // Chip selection logic

  type Fill = "outlined" | "filled";
  const [selected, setSelected] = React.useState<Fill[]>(
    RecyclableItems.flatMap((material) => material.map(() => "outlined"))
  );

  const toggleSelected = (id: number) => {
    setSelected({
      ...selected,
      [id]: selected[id] == "outlined" ? "filled" : "outlined",
    });
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

  const recyclables = ["Paper", "Plastic", "Glass", "Metal", "Others"];
  return (
    <Box display="flex" sx={{ flexWrap: "wrap" }}>
      {RecyclableItems.map((material, modalIndex) => {
        return (
          <>
            <Chip
              label={recyclables[modalIndex]}
              onClick={() => handleOpen(modalIndex)}
              sx={{ mr: 1, mb: 1 }}
              variant="outlined"
            />
            <Modal
              open={open[modalIndex]}
              onClose={() => handleClose(modalIndex)}
            >
              <Box sx={style}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ mb: 1 }}
                >
                  Choose Items
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap" }}>
                  {material.map((item) => {
                    return (
                      <Chip
                        label={item["name"]}
                        variant={selected[item["id"] - 1]}
                        onClick={() => toggleSelected(item["id"] - 1)}
                        sx={{ mr: 1, mb: 1 }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            </Modal>
          </>
        );
      })}
    </Box>
  );
}

export default Recyclables;

// WARNING: this javascript object is for testing only: the id numbers are not accurate

export const RecyclableItems = [
  // Paper
  [
    {
      id: 1,
      name: "PRINTED PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 2,
      name: "BOOKS TEXTBOOKS",
      blueBin_Eligibility: 3,
      checklist: "Please donate if reusable",
    },
    {
      id: 3,
      name: "CARTON BOX CARDBOARD BOX",
      blueBin_Eligibility: 2,
      checklist: "Make sure it is flattened before recycling",
    },
    {
      id: 4,
      name: "PAPER DISPOSABLES",
      blueBin_Eligibility: 0,
      checklist: "Not recyclable, please dispose as general waste",
    },
    {
      id: 5,
      name: "WRITING PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 6,
      name: "NEWSPAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
  ],
  // Plastic
  [
    {
      id: 7,
      name: "CD/DVD CD/DVD CASING",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 8,
      name: "PLASTIC BAG",
      blueBin_Eligibility: 3,
      checklist: "Please donate if reusable",
    },
    {
      id: 9,
      name: "CARTON BOX CARDBOARD BOX",
      blueBin_Eligibility: 2,
      checklist: "Make sure it is flattened before recycling",
    },
    {
      id: 10,
      name: "PAPER DISPOSABLES",
      blueBin_Eligibility: 0,
      checklist: "Not recyclable, please dispose as general waste",
    },
    {
      id: 11,
      name: "WRITING PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 12,
      name: "NEWSPAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
  ],
  // Glass
  [
    {
      id: 13,
      name: "PRINTED PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 14,
      name: "BOOKS TEXTBOOKS",
      blueBin_Eligibility: 3,
      checklist: "Please donate if reusable",
    },
    {
      id: 15,
      name: "CARTON BOX CARDBOARD BOX",
      blueBin_Eligibility: 2,
      checklist: "Make sure it is flattened before recycling",
    },
    {
      id: 16,
      name: "PAPER DISPOSABLES",
      blueBin_Eligibility: 0,
      checklist: "Not recyclable, please dispose as general waste",
    },
    {
      id: 17,
      name: "WRITING PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 18,
      name: "NEWSPAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
  ],
  // Metals
  [
    {
      id: 19,
      name: "PRINTED PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 20,
      name: "BOOKS TEXTBOOKS",
      blueBin_Eligibility: 3,
      checklist: "Please donate if reusable",
    },
    {
      id: 21,
      name: "CARTON BOX CARDBOARD BOX",
      blueBin_Eligibility: 2,
      checklist: "Make sure it is flattened before recycling",
    },
    {
      id: 22,
      name: "PAPER DISPOSABLES",
      blueBin_Eligibility: 0,
      checklist: "Not recyclable, please dispose as general waste",
    },
    {
      id: 23,
      name: "WRITING PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 24,
      name: "NEWSPAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
  ],
  //Others
  [
    {
      id: 25,
      name: "WRITING PAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
    {
      id: 26,
      name: "NEWSPAPER",
      blueBin_Eligibility: 1,
      checklist: "Make sure it is clean before recycling",
    },
  ],
];

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useContext } from "react";
import { backendContext, RecyclableItem } from "../../App";

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
  const { recyclablesData } = useContext(backendContext);

  // Modal popup logic
  const [open, setOpen] = React.useState(
    props.selectedItems[0].map(() => false)
  );

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
    props.selectedItems[0].map((sel) => (sel ? "filled" : "outlined"))
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

  // Display chips
  const categories = ["Paper", "Plastic", "Glass", "Metal", "Others"];
  return (
    <>
      {!recyclablesData ? (
        <h1>Loading...</h1>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {recyclablesData.map(
            (material: RecyclableItem[], modalIndex: number) => {
              return (
                <>
                  <Chip
                    key={modalIndex}
                    label={categories[modalIndex]}
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
                              key={item["id"]}
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
            }
          )}
        </Box>
      )}
    </>
  );
}

export default Recyclables;

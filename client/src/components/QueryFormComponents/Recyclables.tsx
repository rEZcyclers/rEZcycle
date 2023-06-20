import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { backendContext } from "../../App";
import { RecyclableItem } from "../../DataTypes";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
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
  const [open, setOpen] = useState(props.selectedItems[0].map(() => false));

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
  const [selectedChips, setSelectedChips] = useState<Fill[]>(
    props.selectedItems[0].map((sel) => (sel ? "filled" : "outlined"))
  );

  const toggleChipSelect = (id: number) => {
    setSelectedChips({
      ...selectedChips,
      [id]: selectedChips[id] == "outlined" ? "filled" : "outlined",
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
  const categories = ["Paper", "Plastic", "Glass", "Metal"];
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
  const recyclablesByMaterial = [paperArr, plasticArr, glassArr, metalArr];

  return (
    <>
      {recyclablesData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {recyclablesByMaterial.map(
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
                              key={item["recyclable_id"]}
                              label={item["name"]}
                              variant={selectedChips[item["recyclable_id"] - 1]}
                              onClick={() =>
                                toggleChipSelect(item["recyclable_id"] - 1)
                              }
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

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useContext, useState } from "react";
import { backendContext } from "../../App";
import { EwasteItem } from "../../DataTypes";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { IconButton, Modal, Stack, Toolbar, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

interface Props {
  selectedEwaste: boolean[];
  setSelectedEwaste: (newArray: boolean[]) => void;
  numSelectedItems: number;
  setNumSelectedItems: (num: number) => void;
}

function Ewaste({
  selectedEwaste,
  setSelectedEwaste,
  numSelectedItems,
  setNumSelectedItems,
}: Props) {
  const { ewasteData } = useContext(backendContext);

  const toggleEwasteSelection = (index: number) => {
    setNumSelectedItems(
      selectedEwaste[index] ? numSelectedItems - 1 : numSelectedItems + 1
    );
    setSelectedEwaste([
      ...selectedEwaste.slice(0, index),
      !selectedEwaste[index],
      ...selectedEwaste.slice(index + 1),
    ]);
  };

  // Modal popup logic
  const [activeModal, setActiveModal] = useState<number>(-1);

  const openModal = (modalIndex: number) => {
    setActiveModal(modalIndex);
  };
  const closeModal = () => {
    setActiveModal(-1);
  };
  const navigateLeft = (curModal: number) => {
    const nextModal = curModal == 0 ? ewasteData.length - 1 : curModal - 1;
    setActiveModal(nextModal);
  };
  const navigateRight = (curModal: number) => {
    const nextModal = curModal == ewasteData.length - 1 ? 0 : curModal + 1;
    setActiveModal(nextModal);
  };

  // Display Chips for Ewaste Selection
  return (
    <>
      {ewasteData.length === 0 ? (
        <h3>Loading...</h3>
      ) : (
        <Box display="flex" sx={{ flexWrap: "wrap" }}>
          {ewasteData.map((item: EwasteItem) => {
            return (
              <div
                style={{
                  marginBottom: 9,
                  marginRight: 10,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Chip
                  key={item["ewaste_id"]}
                  label={item["ewaste_type"]}
                  color="secondary"
                  variant={
                    selectedEwaste[item["ewaste_id"] - 1]
                      ? "filled"
                      : "outlined"
                  }
                  onClick={() => toggleEwasteSelection(item["ewaste_id"] - 1)}
                  size="medium"
                  sx={{
                    mr: 0.2,
                    fontSize: "0.9em",
                    height: "auto",
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                    },
                  }}
                  data-testid={`EwasteChip-${item["ewaste_id"]}`}
                />
                <IconButton
                  onClick={() => openModal(item["ewaste_id"] - 1)}
                  style={{
                    margin: 0,
                    padding: 0,
                    color: "purple",
                    fillOpacity: 0.5,
                    maxHeight: 30,
                  }}
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </div>
            );
          })}
          <Modal open={activeModal != -1}>
            <Box
              flex={1}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "70%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                flexWrap: "wrap",
                borderRadius: ".8rem",
                overflow: "auto",
              }}
            >
              <Toolbar
                sx={{
                  backgroundColor: "greenyellow",
                  borderTopLeftRadius: ".8rem",
                  borderTopRightRadius: ".8rem",
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ flexGrow: 1 }}
                >
                  {activeModal != -1 &&
                    "More info for " + ewasteData[activeModal]["ewaste_type"]}
                </Typography>
                <IconButton
                  onClick={() => closeModal()}
                  sx={{ marginTop: -2, marginRight: -2 }}
                >
                  <CloseIcon></CloseIcon>
                </IconButton>
              </Toolbar>
              <Stack
                flexDirection={"row"}
                sx={{
                  flexWrap: "nowrap",
                  height: "85%",
                }}
              >
                <Box
                  flex={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton onClick={() => navigateLeft(activeModal)}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Box>
                <Box flex={10} sx={{ marginTop: 1, overflow: "auto" }}>
                  {activeModal != -1 && (
                    <p>{ewasteData[activeModal]["description"]}</p>
                  )}
                  {activeModal != -1 &&
                    ewasteData[activeModal]["images"].map((imageInfo: any) => {
                      return (
                        <>
                          <img
                            src={imageInfo["link"]}
                            alt={imageInfo["credits"]}
                            style={{
                              width: "60%",
                              height: "auto",
                              objectFit: "contain",
                            }}
                          />
                          <figcaption style={{ fontStyle: "italic" }}>
                            {"Credits: " + imageInfo["credits"]}
                          </figcaption>
                        </>
                      );
                    })}
                </Box>
                <Box
                  flex={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton onClick={() => navigateRight(activeModal)}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Box>
              </Stack>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  );
}

export default Ewaste;

// import Box from "@mui/material/Box";
// import Chip from "@mui/material/Chip";
// import Modal from "@mui/material/Modal";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import { useContext, useState } from "react";
// import { backendContext } from "../../App";
// import { RecyclableItem } from "../../DataTypes";
// import { IconButton, Toolbar, styled } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface Props {
//   selectedRecyclables: boolean[];
//   setSelectedRecyclables: (newArray: boolean[]) => void;
//   numSelectedItems: number;
//   setNumSelectedItems: (num: number) => void;
// }

// // CustomChip from https://github.com/mui/material-ui/issues/15185
// const CustomChip = styled(Chip)(({ theme }) => ({
//   padding: theme.spacing(1),
//   height: "100%",
//   display: "flex",
//   flexDirection: "row",
//   "& .MuiChip-label": {
//     overflowWrap: "break-word",
//     whiteSpace: "normal",
//     textOverflow: "clip",
//   },
// }));

// function Recyclables({
//   selectedRecyclables,
//   setSelectedRecyclables,
//   numSelectedItems,
//   setNumSelectedItems,
// }: Props) {
//   const { recyclablesData } = useContext(backendContext);

//   const toggleRecyclableSelection = (index: number) => {
//     setNumSelectedItems(
//       selectedRecyclables[index] ? numSelectedItems - 1 : numSelectedItems + 1
//     );
//     setSelectedRecyclables([
//       ...selectedRecyclables.slice(0, index),
//       !selectedRecyclables[index],
//       ...selectedRecyclables.slice(index + 1),
//     ]);
//   };

//   // Modal popup logic
//   const [activeModal, setActiveModal] = useState<number>(-1);

//   const openModal = (modalIndex: number) => {
//     setActiveModal(modalIndex);
//   };
//   const closeModal = () => {
//     setActiveModal(-1);
//   };

//   const categories = ["Paper", "Plastic", "Glass", "Metal"];
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
//   const recyclableArraysByMaterial = [paperArr, plasticArr, glassArr, metalArr];

//   // Check number of selected recyclables within each material array
//   const numberOfSelections = (materialArray: RecyclableItem[]) => {
//     return materialArray.filter(
//       (item: RecyclableItem) => selectedRecyclables[item["recyclable_id"] - 1]
//     ).length;
//   };

//   // Display chips
//   return (
//     <>
//       {recyclablesData.length === 0 ? (
//         <h3>Loading...</h3>
//       ) : (
//         <Box display="flex" sx={{ flexWrap: "wrap" }}>
//           {recyclableArraysByMaterial.map(
//             (material: RecyclableItem[], modalIndex: number) => {
//               return (
//                 <>
//                   <Chip
//                     key={modalIndex}
//                     label={
//                       numberOfSelections(material) === 0
//                         ? categories[modalIndex]
//                         : `${categories[modalIndex]} (${numberOfSelections(
//                             material
//                           )})`
//                     }
//                     color="secondary"
//                     onClick={() => openModal(modalIndex)}
//                     sx={{ mr: 1, mb: 1 }}
//                     variant={
//                       numberOfSelections(material) === 0 ? "outlined" : "filled"
//                     }
//                   />
//                   <Modal open={modalIndex === activeModal}>
//                     <Box
//                       flex={1}
//                       sx={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         width: "70%",
//                         height: "70%",
//                         bgcolor: "background.paper",
//                         border: "2px solid #000",
//                         boxShadow: 24,
//                         p: 4,
//                         flexWrap: "wrap",
//                         overflow: "scroll",
//                       }}
//                     >
//                       <Toolbar sx={{ marginTop: -2 }}>
//                         <Typography
//                           id="modal-modal-title"
//                           variant="h6"
//                           component="h2"
//                           sx={{ mb: 1, flexGrow: 1 }}
//                         >
//                           Choose Items
//                         </Typography>
//                         <IconButton
//                           onClick={() => closeModal()}
//                           sx={{ marginTop: -2 }}
//                         >
//                           <CloseIcon></CloseIcon>
//                         </IconButton>
//                       </Toolbar>
//                       <Stack direction="row" sx={{ flexWrap: "wrap" }}>
//                         {material.map((item) => {
//                           return (
//                             <CustomChip
//                               key={item["recyclable_id"]}
//                               label={item["name"]}
//                               color="secondary"
//                               size="medium"
//                               variant={
//                                 selectedRecyclables[item["recyclable_id"] - 1]
//                                   ? "filled"
//                                   : "outlined"
//                               }
//                               onClick={() =>
//                                 toggleRecyclableSelection(
//                                   item["recyclable_id"] - 1
//                                 )
//                               }
//                               sx={{
//                                 mr: 1,
//                                 mb: 1,
//                               }}
//                             />
//                           );
//                         })}
//                       </Stack>
//                     </Box>
//                   </Modal>
//                 </>
//               );
//             }
//           )}
//         </Box>
//       )}
//     </>
//   );
// }

// export default Recyclables;

export default function Recyclables() {
  return <></>;
}

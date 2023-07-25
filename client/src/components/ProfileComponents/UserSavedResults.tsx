import { Box, Card, IconButton, Stack } from "@mui/material";
import { UserSavedResult } from "../../DataTypes";
import ResultsSummary from "../ResultsPageComponents/ResultsSummary";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface Props {
  server: string;
  userId: string;
  userSavedResults: UserSavedResult[];
}

export default function UserSavedResults({
  server,
  userId,
  userSavedResults,
}: Props) {
  const [localSavedRes, setLocalSavedRes] = useState(userSavedResults);
  const deleteCard = (resId: number) => {
    fetch(`${server}/userSavedResults?id=${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resId }),
    })
      .then(() => {
        setLocalSavedRes(
          userSavedResults.filter(
            (savedRes: UserSavedResult) => savedRes["res_id"] != resId
          )
        );
        console.log("Result card deleted");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1 style={{ marginBottom: 0 }}>Here are your saved results:</h1>
      {localSavedRes.map((savedRes: UserSavedResult) => {
        return (
          <Card
            sx={{
              backgroundColor: "",
              border: "1px solid black",
              marginBottom: 3,
              maxWidth: 800,
              boxShadow: "10px 5px 20px #83F33A",
              borderRadius: "1.5rem",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "right" }}>
                <IconButton onClick={() => deleteCard(savedRes["res_id"])}>
                  <DeleteIcon></DeleteIcon>
                </IconButton>
              </Box>
              <Box sx={{ mt: -5 }}>
                <ResultsSummary userResults={savedRes["saved"]} />
              </Box>
            </Stack>
          </Card>
        );
      })}
    </>
  );
}

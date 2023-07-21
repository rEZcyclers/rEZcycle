import { Card, IconButton } from "@mui/material";
import { UserSavedResult } from "../../DataTypes";
import ResultsSummary from "./ResultsSummary";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  userSavedResults: UserSavedResult[];
}

export default function UserSavedResults({ userSavedResults }: Props) {
  return (
    <>
      <h1 style={{ marginBottom: 0 }}>Here are your saved results:</h1>
      {userSavedResults.map((savedRes: UserSavedResult) => {
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
            <IconButton>
              <DeleteIcon></DeleteIcon>
            </IconButton>
            <ResultsSummary userResults={savedRes["saved"]} />
          </Card>
        );
      })}
    </>
  );
}

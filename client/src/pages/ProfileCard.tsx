import "./ProfileCard.css";
import { Box, Stack, Typography } from "@mui/material";

interface Props {
  userProfile: any;
}

export default function ProfileCard({ userProfile }: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      maxWidth={800}
      sx={{
        flexWrap: "wrap",
        border: "1px solid",
        boxShadow: "10px 5px 20px #83F33A",
        borderRadius: ".5rem",
      }}
    >
      <Box
        flex={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(to right bottom, rgba(250, 30, 50, 0.6), rgba(30, 200, 50, 0.6))",
          // backgroundColor: "#f6d365",
          borderTopLeftRadius: ".5rem",
          borderBottomLeftRadius: ".5rem",
        }}
      >
        <img
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
          alt="ProfilePicture"
          width="35%"
          style={{ marginTop: "10%" }}
        />
        <Typography sx={{ color: "white", margin: "5%" }}>Username</Typography>
      </Box>
      <Box flex={2}>
        <ul className="InfoList">
          <li className="InfoEntry">
            <div id="key">email</div>
            <div id="val">{userProfile ? userProfile["email"] : "sheesh"}</div>
          </li>
          <li className="InfoEntry">
            <div id="key">contact</div>
            <div id="val">91234567</div>
          </li>
          <li className="InfoEntry">
            <div id="key">region</div>
            <div id="val">central</div>
          </li>
        </ul>
      </Box>
    </Stack>
  );
}

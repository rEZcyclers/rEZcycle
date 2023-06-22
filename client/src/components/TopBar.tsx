// import elements for react routing & accessing userSession
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { backendContext } from "../App";

// import supabase to handle logout
import { supabase } from "../supabase";

// import UI elements
import { Box, Button, Toolbar, Typography } from "@mui/material";
import logo from "../images/logov2.png";

function TopBar() {
  const { userSession } = useContext(backendContext);

  const navigateTo = useNavigate();

  const handleLogInClick = () => {
    navigateTo("/login");
  };

  const handleLogOutClick = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="TopBar">
      <Toolbar variant="dense">
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            paddingLeft: 3,
            display: "flex",
            alignItems: "center",
            margin: 0,
          }}
        >
          <img src={logo} height={35} />
        </Typography>
        <Box sx={{ color: "white", marginRight: "2%" }}>
          Data Source:{" "}
          <a
            href="https://www.nea.gov.sg/our-services/towards-zero-waste"
            target="_blank"
            rel="noreferrer noopener"
          >
            NEA
          </a>
        </Box>
        <Button
          variant="text"
          sx={{ color: "white" }}
          onClick={userSession == null ? handleLogInClick : handleLogOutClick}
        >
          {userSession == null ? "Log In" : "Log Out"}
        </Button>
      </Toolbar>
    </div>
  );
}

export default TopBar;

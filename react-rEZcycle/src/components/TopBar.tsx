// import elements for react routing & accessing loginStatus
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { loginContext } from "../App";

// import supabase to handle logout
import { supabase } from "../supabase";

// import UI elements
import { Button, Toolbar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

function TopBar() {
  const loginStatus = useContext(loginContext);

  const navigateTo = useNavigate();

  const handleLogInClick = () => {
    navigateTo("/login");
  };

  const handleLogOutClick = () => {
    supabase.auth.signOut();
  };

  return (
    <div className="TopBar">
      <Toolbar>
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{ flexGrow: 1, paddingLeft: 5, color: green }}
        >
          rEZcycle
          {/* <img src="./icons/..." height={30} /> */}
        </Typography>
        <Button
          variant="text"
          sx={{ color: "white" }}
          onClick={loginStatus == null ? handleLogInClick : handleLogOutClick}
        >
          {loginStatus == null ? "Log In" : "Log Out"}
        </Button>
      </Toolbar>
    </div>
  );
}

export default TopBar;

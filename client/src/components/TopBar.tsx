// import elements for react routing & accessing userSession
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { backendContext } from "../App";

// import supabase to handle logout
import { supabase } from "../supabase";

// import UI elements
import { Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../images/logov2.png";

interface Props {
  sideBarState: any;
}

function TopBar({ sideBarState }: Props) {
  const { userSession } = useContext(backendContext);
  const [sideBarOpen, setSidebarOpen] = sideBarState;

  const navigateTo = useNavigate();

  const handleLogInClick = () => {
    navigateTo("/login");
  };

  const handleLogOutClick = () => {
    supabase.auth.signOut();
  };

  const toggleSideBar = () => {
    setSidebarOpen(!sideBarOpen);
  };

  return (
    <div className="TopBar">
      <Toolbar variant="dense">
        <Button onClick={toggleSideBar}>
          <IconButton onClick={toggleSideBar}>
            <MenuIcon></MenuIcon>
          </IconButton>
        </Button>
        <img src={logo} height={35} />
        <Typography
          variant="h5"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            paddingLeft: 3,
            display: "flex",
            alignItems: "center",
            marginRight: 5,
          }}
        ></Typography>
        <Typography sx={{ color: "white", marginRight: "3%" }}>
          Source:{" "}
          <a
            href="https://www.nea.gov.sg/our-services/towards-zero-waste"
            target="_blank"
            rel="noreferrer noopener"
          >
            NEA
          </a>
        </Typography>
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

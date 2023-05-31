import { useContext, useState } from "react";
import { supabase } from "../supabase";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/changeCircle";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../App";

// Credits to NUSHackers ReactJS Workshop (by Ravern & Taufiq) for the initial Supabase
// Authentication Template.
// Will modify accordingly after the 'Add supabase auth feature' commit.

// interface Props {
//   loginStatus: Session | null;
// }

function TopBar() {
  const [name, setName] = useState<any>("");
  const hasName = name.length > 0;
  const handleNameChangeClick = () => {
    const newName = prompt("What's your name?");
    setName(newName);
    ``;
  };

  const loginStatus = useContext(loginContext);

  const navigateTo = useNavigate();

  const handleLogInClick = () => {
    console.log("redirect to login page");
    navigateTo("/login");
    console.log("done");
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
          sx={{ flexGrow: 1, paddingLeft: 5 }}
        >
          rEZcycle
          {/* <img src="./icons/..." height={30} /> */}
        </Typography>
        {hasName && <Typography>Welcome back, {name}!</Typography>}
        <IconButton sx={{ color: "white" }} onClick={handleNameChangeClick}>
          <ChangeCircleIcon />
        </IconButton>
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

// Previous Code
{
  /* // <header>
//   <AppBar position="relative">
//     <Toolbar>
//       <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
//         rEZcycle
//       </Typography>
//       {hasName && <Typography>Welcome back, {name}!</Typography>}
//       <IconButton sx={{ color: "white" }} onClick={handleNameChangeClick}>
//         <ChangeCircleIcon />
//       </IconButton>
//       <Button
//         variant="text"
//         sx={{ color: "white" }}
//         onClick={handleLogOutClick}
//       >
//         Log out
//       </Button>
//     </Toolbar>
//   </AppBar>
// </header> */
}

import { useState } from "react";
import { supabase } from "../supabase";
import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/changeCircle";

function TopBar() {
  const [name, setName] = useState<any>("");
  const hasName = name.length > 0;
  const handleNameChangeClick = () => {
    const newName = prompt("What's your name?");
    setName(newName);
  };

  const handleLogOutClick = () => {
    supabase.auth.signOut();
  };

  return (
    <header>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            rEZcycle
          </Typography>
          {hasName && <Typography>Welcome back, {name}!</Typography>}
          <IconButton sx={{ color: "white" }} onClick={handleNameChangeClick}>
            <ChangeCircleIcon />
          </IconButton>
          <Button
            variant="text"
            sx={{ color: "white" }}
            onClick={handleLogOutClick}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
}

export default TopBar;

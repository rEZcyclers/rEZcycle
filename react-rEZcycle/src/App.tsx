import { useEffect, useState } from "react";
// import "./App.css";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import SideBar from "./components/SideBar";
import Base from "./components/Base";

const theme = createTheme({
  palette: {
    background: {
      default: "#FCFFFA",
    },
  },
});

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => subscription.data.subscription.unsubscribe();
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {session ? <Base /> : <LoginScreen />}
    </ThemeProvider>
  );
}

export default App;

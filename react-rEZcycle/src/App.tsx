import { useEffect, useState } from "react";
// import "./App.css";
import { supabase } from "./supabase";
import { Session } from "@supabase/supabase-js";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";

const theme = createTheme({
  palette: {
    background: {
      default: "#eee",
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
      {session ? <HomeScreen /> : <LoginScreen />}
    </ThemeProvider>
  );
}

export default App;

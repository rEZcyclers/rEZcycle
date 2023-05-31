// import elements to handle supabase authentication
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../supabase";

// import elements for react reacting & accessing loginStatus
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../App";

// import UI elements
import { Container } from "@mui/material";

export default function LoginPage() {
  const navigateTo = useNavigate();
  const loginStatus = useContext(loginContext);

  return (
    <>
      <Container
        maxWidth="xs"
        sx={{ height: "100vh", justifyContent: "center" }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "green",
          }}
        >
          Login to rEZcycle
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </Container>
      {loginStatus != null && navigateTo("/")}
    </>
  );
}

// To create a custom theme for the login page
// const customTheme = {
//   default: {
//     colors: {
//       brand: "hsl(153 60.0% 53.0%)",
//       brandAccent: "hsl(154 54.8% 45.1%)",
//       brandButtonText: "white",
//       defaultButtonBackground: "#2e2e2e",
//       defaultButtonBackgroundHover: "#3e3e3e",
//     },
//   },
// };

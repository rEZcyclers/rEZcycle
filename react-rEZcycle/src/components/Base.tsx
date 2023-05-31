import TopBar from "./TopBar";
import SideBar from "./SideBar";
import "./Base.css";
import { CssBaseline } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode; // Page specific content
}

// Base layout component for every web page
function Base({ children }: Props) {
  return (
    <div>
      <CssBaseline />
      <TopBar />
      <div className="FlexContainer">
        <SideBar />
        <div className="WebPage">{children}</div>
      </div>
    </div>
  );
}

export default Base;

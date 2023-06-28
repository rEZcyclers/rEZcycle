import TopBar from "./TopBar";
import SideBar from "./SideBar";
import "./Base.css";
import { CssBaseline } from "@mui/material";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode; // Page specific content
}

// Base layout component for every web page
function Base({ children }: Props) {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  return (
    <div>
      <CssBaseline />
      <TopBar sideBarState={[sideBarOpen, setSideBarOpen]} />
      <div className="FlexContainer">
        {sideBarOpen && <SideBar />}
        <div className="WebPage">{children}</div>
      </div>
    </div>
  );
}

export default Base;

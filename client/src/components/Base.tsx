import TopBar from "./TopBar";
import SideBar from "./SideBar";
import "./Base.css";
import { CssBaseline } from "@mui/material";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode; // Page specific content
  bgiAbsolutePath?: string; // Page specific background image
}

// Base layout component for every web page
function Base({ children, bgiAbsolutePath }: Props) {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  return (
    <div>
      <CssBaseline />
      <TopBar sideBarState={[sideBarOpen, setSideBarOpen]} />
      <div className="FlexContainer">
        {sideBarOpen && <SideBar />}
        <div className="WebPage">{children}</div>
        {bgiAbsolutePath && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${bgiAbsolutePath})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 1,
              zIndex: 0,
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

export default Base;

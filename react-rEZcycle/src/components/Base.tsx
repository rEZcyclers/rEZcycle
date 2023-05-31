import { ReactNode } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import "./Base.css";
import { CssBaseline } from "@mui/material";

interface Props {
  children: ReactNode;
}

function Base({ children }: Props) {
  // const handlePageChange = (newPage: string) => {
  //   setCurPage(newPage);
  //   console.log(`setCurPage to ${newPage}`);
  // };

  return (
    <div>
      <CssBaseline />
      <TopBar />
      <SideBar />
      <div className="page">{children}</div>
    </div>
  );
}

export default Base;

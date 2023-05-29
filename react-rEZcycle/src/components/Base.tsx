// import { ReactNode } from "react";
import { useState } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

// interface Props {
//   curPage: string;
//   onPageChange: (item: string) => void;
//   // children: ReactNode;
// }

function Base() {
  const [curPage, setCurPage] = useState<string>("home");

  const handlePageChange = (newPage: string) => {
    setCurPage(newPage);
    console.log(`setCurPage to ${newPage}`);
  };

  return (
    <>
      <SideBar curPage={curPage} onPageChange={handlePageChange} />
    </>
  );
}

export default Base;

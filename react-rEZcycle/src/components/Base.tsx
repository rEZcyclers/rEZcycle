import { ReactNode } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
}

function Base({ children }: Props) {
  return (
    <>
      <TopBar />
      <SideBar />
      {children}
    </>
  );
}

export default Base;

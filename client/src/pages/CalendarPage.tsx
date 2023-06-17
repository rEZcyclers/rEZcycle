import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";

function CalendarPage() {
  const { loginStatus } = useContext(backendContext);
  return (
    <Base>
      {loginStatus == null ? (
        <h1> Please log in to view calendar page </h1>
      ) : (
        <h1>Calendar Page</h1>
      )}
    </Base>
  );
}

export default CalendarPage;

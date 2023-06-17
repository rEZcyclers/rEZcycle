import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";

function HistoryPage() {
  const { loginStatus } = useContext(backendContext);
  return (
    <Base>
      {loginStatus == null ? (
        <h1> Please log in to view history page </h1>
      ) : (
        <h1>History Page</h1>
      )}
    </Base>
  );
}

export default HistoryPage;

import Base from "../components/Base";
import { useContext } from "react";
import { loginContext } from "../App";

function HistoryPage() {
  const loginStatus = useContext(loginContext);
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

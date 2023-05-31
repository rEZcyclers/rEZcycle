import Base from "../components/Base";
import { useContext } from "react";
import { loginContext } from "../App";

function FriendsPage() {
  const loginStatus = useContext(loginContext);
  return (
    <Base>
      {loginStatus == null ? (
        <h1> Please log in to view friends page </h1>
      ) : (
        <h1>Friends Page</h1>
      )}
    </Base>
  );
}

export default FriendsPage;

import Base from "../components/Base";
import { useContext } from "react";
import { loginContext } from "../App";

function ProfilePage() {
  const loginStatus = useContext(loginContext);
  return (
    <Base>
      {loginStatus == null ? (
        <h1> Please log in to view profile page </h1>
      ) : (
        <h1>Profile Page</h1>
      )}
    </Base>
  );
}

export default ProfilePage;

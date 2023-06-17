import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";

function ProfilePage() {
  const { loginStatus } = useContext(backendContext);
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

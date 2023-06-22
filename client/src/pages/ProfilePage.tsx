import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";

function ProfilePage() {
  const { userSession } = useContext(backendContext);
  return (
    <Base>
      {userSession == null ? (
        <h1> Please log in to view profile page </h1>
      ) : (
        <>
          <h1>Welcome back, {userSession["user"]["email"]!}</h1>
        </>
      )}
    </Base>
  );
}

export default ProfilePage;

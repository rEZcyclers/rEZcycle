import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";
import ProfileCard from "../components/ProfileCard";

function ProfilePage() {
  const { serverAPI, userSession, userProfile } = useContext(backendContext);

  return (
    <Base>
      {userSession == null ? (
        <h1> Please log in to view profile page </h1>
      ) : (
        <>
          {userProfile == null ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <ProfileCard server={serverAPI} userProfile={userProfile} />
            </>
          )}
        </>
      )}
    </Base>
  );
}

export default ProfilePage;

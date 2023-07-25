import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";
import ProfileCard from "../components/ProfileComponents/ProfileCard";
import UserSavedResults from "../components/ProfileComponents/UserSavedResults";

function ProfilePage() {
  const { serverAPI, userSession, userProfile, userSavedResults } =
    useContext(backendContext);

  return (
    <Base>
      {userSession == null ? (
        <h1> Please log in to view profile page </h1>
      ) : (
        <div data-testid="profile-page">
          {userProfile == null ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <ProfileCard server={serverAPI} userProfile={userProfile} />
              {userSavedResults.length != 0 && (
                <UserSavedResults
                  server={serverAPI}
                  userId={userProfile["user_id"]}
                  userSavedResults={userSavedResults}
                />
              )}
            </>
          )}
        </div>
      )}
    </Base>
  );
}

export default ProfilePage;

import Base from "../components/Base";
import { useContext } from "react";
import { backendContext } from "../App";
import ProfileCard from "../components/ProfileCard";

function ProfilePage() {
  const { serverAPI, userSession, userProfile } = useContext(backendContext);
  // const [editMode, setEditMode] = useState<boolean>(false);
  // TODO: Set edit modes for every info entry, which will be
  // set to edit mode by an 'edit button'. Once that entry is
  // in edit mode, it will render a separate component, which
  // is an input field, a save button (which updates the database),
  // and a cancel button which sets the edit mode for that entry
  // back to false, rendering the original display as usual.

  // TODO: Allow for user to customise their profile pic by
  // uploading an image, which is then hosted as some link or sth?
  // Dk how Supabase stores images if that's even possible.

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

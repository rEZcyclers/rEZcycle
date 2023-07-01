import { useState } from "react";
import "./ProfileCard.css";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { UserProfile } from "../DataTypes";

interface Props {
  server: string;
  userProfile: UserProfile;
}

export default function ProfileCard({ server, userProfile }: Props) {
  const [editName, setEditName] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [editRegion, setEditRegion] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile["name"]);
  const [email, setEmail] = useState<string>(userProfile["email"]);
  const [phone, setPhone] = useState<string>(userProfile["phone"]);
  const [region, setRegion] = useState<string>(userProfile["region"]);

  const updateName = () => {
    fetch(`${server}/userProfile?id=${userProfile["user_id"]}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        userProfile["name"] = name;
        setEditName(false);
        console.log("User name updated");
      })
      .catch((err) => console.log(err));
  };

  const updateEmail = () => {
    fetch(`${server}/userProfile?id=${userProfile["user_id"]}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(() => {
        userProfile["email"] = email;
        setEditEmail(false);
        console.log("User email updated");
      })
      .catch((err) => console.log(err));
  };

  const updatePhone = () => {
    fetch(`${server}/userProfile?id=${userProfile["user_id"]}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    })
      .then(() => {
        userProfile["phone"] = phone;
        setEditPhone(false);
        console.log("User phone updated");
      })
      .catch((err) => console.log(err));
  };

  const updateRegion = () => {
    fetch(`${server}/userProfile?id=${userProfile["user_id"]}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region }),
    })
      .then(() => {
        userProfile["region"] = region;
        setEditRegion(false);
        console.log("User region updated");
      })
      .catch((err) => console.log(err));
  };

  // const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("Uploading Image...");
  //   let file = e.target.files ? e.target.files[0] : null;
  //   //
  //   fetch(`${server}/userProfile/img?id=${userProfile["user_id"]}`, {
  //     method: "PUT",
  //     body: file,
  //   })
  //     .then((res) => res.json())
  //     .then(() => console.log("Uploaded Image"));
  // };

  return (
    <>
      <h1>
        Welcome Back{userProfile["name"] ? `, ${userProfile["name"]}` : ""}!
      </h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        maxWidth={800}
        sx={{
          flexWrap: "wrap",
          border: "1px solid",
          boxShadow: "10px 5px 20px #83F33A",
          borderRadius: ".5rem",
        }}
      >
        <Box
          flex={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(to right bottom, rgba(250, 30, 50, 0.6), rgba(30, 200, 50, 0.6))",
            // backgroundColor: "#f6d365",
            borderTopLeftRadius: ".5rem",
            borderBottomLeftRadius: ".5rem",
          }}
        >
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
            alt="ProfilePicture"
            width="35%"
            style={{ marginTop: "10%" }}
          />
          {/* <p>Upload a new image</p>
        <FormControl>
          <FormGroup style={{ maxWidth: "150px" }}>
            <Button variant="contained">
              <Input
                type="file"
                inputProps={{ accept: "image/png, image/jpeg" }}
                sx={{}}
                //onChange={(e) => uploadImage(e)}
              />
            </Button>
          </FormGroup>
        </FormControl> */}
          <div style={{ margin: "5%" }}>
            {editName ? (
              <form
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    fontFamily: "Lucida Grande",
                    fontSize: "medium",
                    width: "50%",
                  }}
                />
                <IconButton onClick={updateName}>
                  <CheckIcon></CheckIcon>
                </IconButton>
                <IconButton
                  onClick={() => {
                    setEditName(false);
                    setName(userProfile["name"]);
                  }}
                >
                  <CloseIcon></CloseIcon>
                </IconButton>
              </form>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: "white", margin: "5%" }}>
                  {name}
                </Typography>
                <IconButton
                  sx={{
                    marginLeft: 2,
                    opacity: "30%",
                    ":hover": { opacity: "100%" },
                  }}
                  onClick={() => setEditName(true)}
                >
                  <EditIcon
                    sx={{
                      width: "80%",
                    }}
                  ></EditIcon>
                </IconButton>
              </div>
            )}
          </div>
        </Box>
        <Box flex={2}>
          <ul className="InfoList">
            <li className="InfoEntry">
              <div id="key">email</div>
              <div id="val">
                {editEmail ? (
                  <>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          fontFamily: "Lucida Grande",
                          fontSize: "medium",
                        }}
                      />
                      <IconButton onClick={updateEmail}>
                        <CheckIcon></CheckIcon>
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          setEditEmail(false);
                          setEmail(userProfile["email"]);
                        }}
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </form>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {userProfile["email"]}
                    <IconButton
                      sx={{
                        marginLeft: 2,
                        opacity: "30%",
                        ":hover": { opacity: "100%" },
                      }}
                      onClick={() => setEditEmail(true)}
                    >
                      <EditIcon
                        sx={{
                          width: "80%",
                        }}
                      ></EditIcon>
                    </IconButton>
                  </div>
                )}
              </div>
            </li>
            <li className="InfoEntry">
              <div id="key">phone</div>
              <div id="val">
                {editPhone ? (
                  <>
                    <form style={{ display: "flex", flexDirection: "row" }}>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        style={{
                          fontFamily: "Lucida Grande",
                          fontSize: "medium",
                        }}
                      />
                      <IconButton onClick={updatePhone}>
                        <CheckIcon></CheckIcon>
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          setEditPhone(false);
                          setPhone(userProfile["phone"]);
                        }}
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </form>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {userProfile["phone"]}
                    <IconButton
                      sx={{
                        marginLeft: 2,
                        opacity: "30%",
                        ":hover": { opacity: "100%" },
                      }}
                      onClick={() => setEditPhone(true)}
                    >
                      <EditIcon
                        sx={{
                          width: "80%",
                        }}
                      ></EditIcon>
                    </IconButton>
                  </div>
                )}
              </div>
            </li>
            <li className="InfoEntry">
              <div id="key">Region</div>
              <div id="val">
                {editRegion ? (
                  <>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <FormControl sx={{ flex: 2 }}>
                        <InputLabel id="demo-simple-select-label">
                          Select Region
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={region}
                          label="Select one"
                          onChange={(e) => setRegion(e.target.value)}
                          sx={{
                            fontFamily: "Lucida Grande",
                            fontSize: "medium",
                          }}
                        >
                          <MenuItem value={"North"}>North</MenuItem>
                          <MenuItem value={"East"}>East</MenuItem>
                          <MenuItem value={"South"}>South</MenuItem>
                          <MenuItem value={"West"}>West</MenuItem>
                          <MenuItem value={"Central"}>Central</MenuItem>
                        </Select>
                      </FormControl>
                      <IconButton onClick={updateRegion}>
                        <CheckIcon></CheckIcon>
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          setEditRegion(false);
                          setRegion(userProfile["region"]);
                        }}
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </Stack>
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {userProfile["region"]}
                    <IconButton
                      sx={{
                        marginLeft: 2,
                        opacity: "30%",
                        ":hover": { opacity: "100%" },
                      }}
                      onClick={() => setEditRegion(true)}
                    >
                      <EditIcon
                        sx={{
                          width: "80%",
                        }}
                      ></EditIcon>
                    </IconButton>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </Box>
      </Stack>
    </>
  );
}

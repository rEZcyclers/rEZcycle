import { createRef, useRef, useState } from "react";
import "./ProfileCard.css";
import validator from "validator";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  colors,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { UserProfile } from "../DataTypes";

// import axios from "axios";

interface Props {
  server: string;
  userProfile: UserProfile;
}

export default function ProfileCard({ server, userProfile }: Props) {
  const initialDp = userProfile["dp_url"]
    ? userProfile["dp_url"]
    : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp";
  const [imgURL, setImgURL] = useState<string>(initialDp);
  const [editName, setEditName] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [editRegion, setEditRegion] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile["name"]);
  const [email, setEmail] = useState<string>(userProfile["email"]);
  const [phone, setPhone] = useState<string>(userProfile["phone"]);
  const [region, setRegion] = useState<string>(userProfile["region"]);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [nameError, setNameError] = useState<boolean>(false);

  const [fileText, setFileText] = useState<string>("Upload profile pic");
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const clickInput = () => {
  //   fileInputRef.current?.click();
  // };

  console.log(imgURL);
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    updatePhoto(e.target.files[0]);
  };

  const updatePhoto = (photo: File) => {
    console.log("updatePhoto called");
    console.log(photo);
    setFileText("Uploading...");
    const data = new FormData();
    data.append("image", photo);
    fetch(`${server}/userProfile/photo?id=${userProfile["user_id"]}`, {
      method: "PUT",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setImgURL(data["url"]);
        userProfile["dp_url"] = data["url"];
        setFileText("Upload profile pic");
      })
      .then(() => console.log("Uploaded Photo"))
      .catch((err) => console.log(err));
  };

  const updateName = () => {
    if (name.length == 0) {
      setNameError(true);
      return;
    }
    setNameError(false);
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
    if (!validator.isEmail(email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
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
    if (
      !validator.isMobilePhone(phone) ||
      phone.length != 8 ||
      parseInt(phone[0]) < 6
    ) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
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

  return (
    <>
      <h1>
        Welcome Back{userProfile["name"] ? `, ${userProfile["name"]}` : ""}!
      </h1>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        maxWidth={800}
        sx={{
          display: "flex",
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
          <Box
            sx={{
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              marginTop: "20px",
            }}
          >
            <img src={imgURL} className="ProfilePic" alt="ProfilePicture" />
          </Box>

          <button className="UploadPic">
            <label htmlFor="fileInput">{fileText}</label>
          </button>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={handlePhotoUpload}
          />
          <div style={{ margin: "2%" }}>
            {editName ? (
              <>
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
                      setNameError(false);
                      setName(userProfile["name"]);
                    }}
                  >
                    <CloseIcon></CloseIcon>
                  </IconButton>
                </form>
                {nameError && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "small",
                      fontFamily: "Lucida Grande",
                    }}
                  >
                    Please enter a non-empty username
                  </span>
                )}
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontFamily: "Lucida Grande" }}>
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
                          setEmailError(false);
                          setEmail(userProfile["email"]);
                        }}
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </form>
                    {emailError && (
                      <span
                        style={{ color: "red", fontFamily: "Lucida Grande" }}
                      >
                        Please enter a valid email
                      </span>
                    )}
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
                          setPhoneError(false);
                          setPhone(userProfile["phone"]);
                        }}
                      >
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </form>
                    {phoneError && (
                      <span
                        style={{ color: "red", fontFamily: "Lucida Grande" }}
                      >
                        Please enter a valid phone number
                      </span>
                    )}
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

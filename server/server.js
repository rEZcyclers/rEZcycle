import express from "express";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(express.json()); // Impt for req.body JSON files to be read properly so it won't be undefined
dotenv.config();
app.use(
  cors({
    origin: "*",
  })
);

// Multer configuration with memory storage
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

// Impt for req.body image files to be read properly so it won't be {}
const upload = multer({ storage });

const PORT = process.env.PORT || 8000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Root
app.get("/", (req, res) => {
  res.json([{ testKey: "server is running!" }]);
});

// Get user profile
app.get("/userProfile", async (req, res) => {
  const id = req.query.id;
  const { data, error } = await supabase
    .from("UserProfiles")
    .select()
    .eq("user_id", id);
  if (data) {
    res.json(data);
  } else {
    console.log(error);
  }
});

// Handle updates to user profile info
app.put("/userProfile", async (req, res) => {
  const id = req.query.id;
  const { data, error } = await supabase
    .from("UserProfiles")
    .update(req.body)
    .eq("user_id", id)
    .select();
  if (data) {
    res.json(data);
  } else {
    console.log(error);
  }
});

// Handle updates to user profile photo
app.put("/userProfile/photo", upload.single("image"), async (req, res) => {
  const id = req.query.id;
  console.log(id);
  console.log(req.file);
  if (!req.file) {
    res.send("Invalid file");
    return;
  }
  const photoBuffer = req.file.buffer;
  const photoName = req.file.originalname;
  let contentType;
  const photoExtension = photoName
    .substr(photoName.lastIndexOf(".") + 1)
    .toLowerCase();

  if (photoExtension === "jpg" || photoExtension === "jpeg") {
    contentType = "image/jpeg";
  } else if (photoExtension === "png") {
    contentType = "image/png";
  } else if (photoExtension === "gif") {
    contentType = "image/gif";
  } else {
    // Set a default content type if the file extension is not recognized
    contentType = "application/octet-stream";
  }
  const pathName = id + "/profilePic." + photoExtension;

  const { data, error } = await supabase.storage
    .from("profiles")
    .upload(pathName, photoBuffer, {
      contentType,
      cacheControl: "3600",
      upsert: true, // Update if already present, else upload
    });
  if (data) {
    const { data } = await supabase.storage
      .from("profiles")
      .getPublicUrl(pathName);
    if (data) {
      // NOTE: Since every user's profile picture is always hosted
      // on the same URL, React will assume that the same image URL
      // will always have the same image content in order to optimise
      // rendering, which is a bug because users will always see the
      // first profile picture even after they uploaded a new one.
      // Hence, to force React to fetch a new image from the same URL,
      // randomString is added as a redundant query parameter for
      // imgURL, tricking React into thinking the URL has changed,
      // hence fetching a new image.
      const randomString = Math.random().toString(10).substring(5);
      const imgURL = data["publicUrl"] + "?" + randomString;
      const { error } = await supabase
        .from("UserProfiles")
        .update({ dp_url: imgURL })
        .eq("user_id", id);
      res.send({ url: imgURL });
    }
  } else {
    console.log(error);
    res.error;
  }
});

// Get all of user's saved results
app.get("/userSavedResults", async (req, res) => {
  const id = req.query.id;
  const { data, error } = await supabase
    .from("UserSavedResults")
    .select()
    .eq("user_id", id);
  if (data) {
    res.json(data);
  } else {
    console.log(error);
  }
});

// Allow user to save a new result
app.post("/userSavedResults", async (req, res) => {
  const id = req.query.id;
  const { error } = await supabase
    .from("UserSavedResults")
    .insert({ user_id: id, saved: req.body });
  if (error) {
    console.log(error);
    res.send({
      status: error.status,
      statusText: error.message,
    });
  } else {
    res.send({
      status: 201,
      statusText: "Created",
    });
  }
});

// Allow user to delete a saved result
app.delete("/userSavedResults", async (req, res) => {
  if (req.query.id == null) {
    res.error({ status: 400, statusText: "Not authorised" });
    return;
  }
  const resId = req.body.resId;
  const { error } = await supabase
    .from("UserSavedResults")
    .delete()
    .eq("res_id", resId);
  if (error) {
    console.log(error);
    res.error(error);
  } else {
    res.send({
      status: 201,
      statusText: "Deleted",
    });
  }
});

// Get items (recyclables, donatables, ewaste)
app.get("/recyclables", async (req, res) => {
  const { data, error } = await supabase.from("Recyclables").select();
  res.json(data);
});

app.get("/donatables", async (req, res) => {
  const { data, error } = await supabase
    .from("Donatables")
    .select()
    .order("donatable_id", { ascending: true });
  res.json(data);
});

app.get("/ewaste", async (req, res) => {
  const { data, error } = await supabase
    .from("Ewaste")
    .select()
    .order("ewaste_id", { ascending: true });
  res.json(data);
});

// Get locations for items (bluebins, donateOrgs + donateLocs, repairLocs, ebins + ebinLocs)
app.get("/bluebins", async (req, res) => {
  const { data, error } = await supabase.from("Bluebins").select();
  res.json(data);
});

app.get("/donateOrganisations", async (req, res) => {
  const { data, error } = await supabase.from("DonateOrganisations").select();
  res.json(data);
});

app.get("/donateLocations", async (req, res) => {
  const { data, error } = await supabase.from("DonateLocations").select();
  res.json(data);
});

app.get("/repairLocations", async (req, res) => {
  const { data, error } = await supabase.from("RepairLocations").select();
  res.json(data);
});

app.get("/ebins", async (req, res) => {
  const { data, error } = await supabase.from("Ebins").select();
  res.json(data);
});

app.get("/ebinLocations", async (req, res) => {
  const { data, error } = await supabase.from("EbinLocations").select();
  res.json(data);
});

// Get junction tables (DD, DR, ED, ER, EE)
app.get("/donatablesDonateOrganisations", async (req, res) => {
  const { data, error } = await supabase
    .from("DonatablesDonateOrganisations")
    .select();
  res.json(data);
});

app.get("/donatablesRepairLocations", async (req, res) => {
  const { data, error } = await supabase
    .from("DonatablesRepairLocations")
    .select();
  res.json(data);
});

app.get("/ewasteDonateOrganisations", async (req, res) => {
  const { data, error } = await supabase
    .from("EwasteDonateOrganisations")
    .select();
  res.json(data);
});

app.get("/ewasteRepairLocations", async (req, res) => {
  const { data, error } = await supabase.from("EwasteRepairLocations").select();
  res.json(data);
});

app.get("/ewasteEbins", async (req, res) => {
  const { data, error } = await supabase.from("EwasteEbins").select();
  res.json(data);
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

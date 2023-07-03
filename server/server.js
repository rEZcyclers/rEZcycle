import express from "express";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

const app = express();
app.use(express.json()); // Impt for req.body to be read properly so it won't be undefined
app.use(cors());

const PORT = process.env.PORT || 8000;

const SUPABASE_URL = "https://rtgficcuqderxusnmkkh.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z2ZpY2N1cWRlcnh1c25ta2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUwNzI0NjcsImV4cCI6MjAwMDY0ODQ2N30.2L7pCi3tu8PRoDRFeCFvS6KPEIqxLi9OqVcVVv-ZtFk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/", (req, res) => {
  res.json([{ testKey: "server is running!" }]);
});

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

// app.put("/userProfile/img", async (req, res) => {
//   const id = req.query.id;
//   console.log(req.body);
//   const { data, error } = await supabase.storage
//     .from("Images")
//     .upload(id + "/" + uuidv4(), req.body);

//   if (data) {
//     res.send(data);
//   } else {
//     console.log(error);
//   }
// });

app.get("/recyclables", async (req, res) => {
  const { data, error } = await supabase.from("Recyclables").select();
  res.json(data);
});

app.get("/donatables", async (req, res) => {
  const { data, error } = await supabase.from("Donatables").select();
  res.json(data);
});

app.get("/eWaste", async (req, res) => {
  const { data, error } = await supabase.from("EWaste").select();
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

app.get("/eWasteDonateOrganisations", async (req, res) => {
  const { data, error } = await supabase
    .from("EWasteDonateOrganisations")
    .select();
  res.json(data);
});

app.get("/eWasteRepairLocations", async (req, res) => {
  const { data, error } = await supabase.from("EWasteRepairLocations").select();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

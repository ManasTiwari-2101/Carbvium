const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./supabase_client");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Carbvium Backend Running 🚀");
});



app.get("/api/top15-carbon", async (req, res) => {
  const topModels = [
    "Swift","Baleno","WagonR CNG","Nexon EV","Punch EV",
    "Creta","Scorpio N","Venue","Innova Hycross Hybrid",
    "Seltos","Bolero Neo","Tiago EV","Celerio","Amaze","Elevate"
  ];

  const { data, error } = await supabase
    .from("vehicles_lifecycle_data")
    .select("model_name, total_lifecycle_co2_kg, vehicle_type")
    .in("model_name", topModels);

  if (error) return res.status(500).json(error);

  res.json(data);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
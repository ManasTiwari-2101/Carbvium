const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./supabase_client");
const { signup, login, logout } = require("./auth");
const path = require('path');

const app = express();

// CORS Configuration
// Allow configuring allowed origins via env var (comma-separated), fall back to sensible defaults
const defaultOrigins = [
  "http://localhost",
  "http://127.0.0.1",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "https://carbvium.vercel.app",
  "https://carbvium.onrender.com"
];
const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [];
const corsOptions = {
  origin: envOrigins.length ? envOrigins : defaultOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Shuffle function for random order
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

app.get("/", (req, res) => {
  res.send("Carbvium Backend Running 🚀");
});

// Authentication Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);

// Filtered top 15 vehicles with query parameters (MUST BE BEFORE /api/top15-carbon)
app.get("/api/top15-carbon/filtered", async (req, res) => {
  const { vehicleType, priceRange, category, mileage, mileageFuelType } = req.query;
  console.log("Filtered endpoint hit with:", { vehicleType, priceRange, category, mileage, mileageFuelType });

  let query = supabase
    .from("vehicles_lifecycle_data")
    .select("company_name, model_name, total_lifecycle_co2_kg, vehicle_type, price_inr_lakhs, category, mileage");

  // Apply vehicle type filter
  if (vehicleType && vehicleType !== "all") {
    query = query.eq("vehicle_type", vehicleType);
  }

  // Apply category filter
  if (category && category !== "all") {
    query = query.ilike("category", `%${category}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered data:", error);
    return res.status(500).json(error);
  }

  // Filter by price range on client side
  let filtered = data;
  if (priceRange && priceRange !== "all") {
    filtered = filtered.filter((car) => {
      const price = car.price_inr_lakhs;
      if (priceRange === "low") return price < 10;
      if (priceRange === "mid") return price >= 10 && price <= 20;
      if (priceRange === "high") return price > 20;
      return true;
    });
  }

  // Filter by mileage based on fuel type
  if (mileage && parseFloat(mileage) > 0 && mileageFuelType) {
    filtered = filtered.filter((car) => {
      if (mileageFuelType === "ev") {
        // Only keep EVs that meet the mileage requirement
        if (car.vehicle_type === "EV") {
          return car.mileage && car.mileage >= parseFloat(mileage);
        }
        return false; // Hide non-EV cars
      } else if (mileageFuelType === "fuel_hybrid") {
        // Only keep Fuel/Hybrid cars that meet the mileage requirement
        if (car.vehicle_type === "FUEL" || car.vehicle_type === "HYBRID") {
          return car.mileage && car.mileage >= parseFloat(mileage);
        }
        return false; // Hide EV cars
      }
      return true;
    });
  }

  // Return top 15 shuffled
  const result = filtered.slice(0, 15);
  const shuffled = shuffleArray(result);
  console.log("Returning", shuffled.length, "filtered vehicles in random order");
  res.json(shuffled);
});

app.get("/api/top15-carbon", async (req, res) => {
  const topModels = [
    "Swift", "Baleno", "WagonR CNG", "Nexon EV", "Punch EV",
    "Creta", "Scorpio N", "Venue", "Innova Hycross Hybrid",
    "Seltos", "Bolero Neo", "Tiago EV", "Celerio", "Amaze", "Elevate"
  ];

  const { data, error } = await supabase
    .from("vehicles_lifecycle_data")
    .select("company_name, model_name, total_lifecycle_co2_kg, vehicle_type, price_inr_lakhs")
    .in("model_name", topModels);

  if (error) return res.status(500).json(error);

  // Shuffle the data for random display
  const shuffled = shuffleArray(data);
  res.json(shuffled);
});

app.get("/api/vehicles", async (req, res) => {
  const { data, error } = await supabase
    .from("vehicles_lifecycle_data")
    .select(
      "unique_id,company_name, model_name, vehicle_type, manufacturing_co2_kg, battery_co2_kg, running_co2_kg, total_lifecycle_co2_kg, lifecycle_intensity_kg_per_km, price_inr_lakhs, image_link, horsepower, mileage, category"
    )
    .order("model_name");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }

  res.json(data);
});

app.get("/api/vehicle/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;

  const { data, error } = await supabase
    .from("vehicles_lifecycle_data")
    .select(`
      model_name,
      vehicle_type,
      manufacturing_co2_kg,
      battery_co2_kg,
      running_co2_kg,
      total_lifecycle_co2_kg,
      lifecycle_intensity_kg_per_km,
      price_inr_lakhs
    `)
    .eq("unique_id", uniqueId)
    .single(); // returns single object

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Vehicle not found" });
  }

  res.json(data);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optionally serve the built frontend from the backend image when explicitly enabled
// Set SERVE_FRONTEND=true in the backend container and ensure the frontend `dist` is available
if (process.env.SERVE_FRONTEND === 'true') {
  const frontendDist = path.join(__dirname, '..', 'Carbvium_Frontend', 'dist');
  app.use(express.static(frontendDist));

  // Middleware fallback: for any non-API GET request, return index.html so client-side routing works
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}
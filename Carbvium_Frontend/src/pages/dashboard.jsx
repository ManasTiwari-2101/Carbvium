import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import CarCard from "./card";

export default function Dashboard() {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [cars, setCars] = useState([]);
  const [vehicleType, setVehicleType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // ==============================
  // FETCH CHART DATA WITH FILTERS
  // ==============================
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let url;

        // If no filters applied, use the default top15-carbon endpoint
        if (vehicleType === "all" && priceRange === "all") {
          url = "http://localhost:5000/api/top15-carbon";
        } else {
          // If filters are applied, use the filtered endpoint
          const params = new URLSearchParams();
          if (vehicleType !== "all") {
            params.append("vehicleType", vehicleType);
          }
          if (priceRange !== "all") {
            params.append("priceRange", priceRange);
          }
          url = `http://localhost:5000/api/top15-carbon/filtered?${params.toString()}`;
        }

        console.log("Fetching chart data from:", url);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Chart data received:", data);

        // Transform to include full name and show first 15 vehicles
        const transformed = data.slice(0, 15).map((car) => ({
          ...car,
          name: `${car.company_name || ''} ${car.model_name}`.trim(),
        }));
        setChartData(transformed);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartData([]);
      }
    };

    fetchChartData();
  }, [vehicleType, priceRange]);

  // ==============================
  // FETCH CAR DATA FROM BACKEND
  // ==============================
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vehicles");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched vehicles:", data);

        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          setCars([]);
          return;
        }

        // Transform data to match card component format
        const transformedCars = data.map((car) => ({
          id: car.unique_id,
          name: `${car.company_name} ${car.model_name}`,
          company_name: car.company_name,
          model_name: car.model_name,
          type: car.vehicle_type,
          vehicle_type: car.vehicle_type,
          price: car.price_inr_lakhs,
          price_inr_lakhs: car.price_inr_lakhs,
          co2: car.total_lifecycle_co2_kg,
          total_lifecycle_co2_kg: car.total_lifecycle_co2_kg,
          manufacturing_co2_kg: car.manufacturing_co2_kg,
          battery_co2_kg: car.battery_co2_kg,
          running_co2_kg: car.running_co2_kg,
          lifecycle_intensity_kg_per_km: car.lifecycle_intensity_kg_per_km,
          image_link: car.image_link,
        }));

        console.log("Transformed cars:", transformedCars);
        setCars(transformedCars);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setCars([]);
      }
    };

    fetchVehicles();
  }, []);

  // ==============================
  // FILTER LOGIC
  // ==============================
  const filteredCars = cars.filter((car) => {
    const typeMatch = vehicleType === "all" || car.vehicle_type === vehicleType;

    let priceMatch = true;
    if (car.price !== null && car.price !== undefined) {
      priceMatch =
        priceRange === "all" ||
        (priceRange === "low" && car.price < 10) ||
        (priceRange === "mid" && car.price >= 10 && car.price <= 20) ||
        (priceRange === "high" && car.price > 20);
    }

    return typeMatch && priceMatch;
  });

  console.log("All cars:", cars);
  console.log("Filtered cars:", filteredCars);
  console.log("Current filters - Type:", vehicleType, "Price:", priceRange);

  // ==============================
  // COLOR BASED ON VEHICLE TYPE
  // ==============================
  const getBarColor = (vehicleType) => {
    // Green for EV, Gray for Hybrid, Yellow for Fuel
    if (vehicleType === "EV") return "#22c55e";
    if (vehicleType === "HYBRID") return "#9ca3af";
    return "#facc15"; // Fuel (Petrol/Diesel)
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ================= HEADER ================= */}
      <header className="h-16 bg-white shadow flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-500"></div>
          <h1 className="text-xl font-bold tracking-wide">CARBVIUM</h1>
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
        >
          Logout
        </button>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ================= SIDEBAR ================= */}
        <aside className="w-[280px] bg-gray-100 border-r p-6 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-gray-300"></div>
            <h3 className="font-semibold">User Name</h3>
            <p className="text-sm text-gray-500">user@email.com</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-3">Filters</h3>

            <label className="text-sm">Vehicle Type</label>
            <select
              className="w-full mt-1 mb-3 border rounded p-2"
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="EV">Electric (EV)</option>
              <option value="FUEL">Fuel (Petrol/Diesel)</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <label className="text-sm">Price Range</label>
            <select
              className="w-full mt-1 border rounded p-2"
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Below ₹10L</option>
              <option value="mid">₹10L - ₹20L</option>
              <option value="high">Above ₹20L</option>
            </select>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* ================= CHART ================= */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl shadow-xl p-10"
          >
            <h2 className="text-lg font-semibold mb-6">
              Top Vehicles Lifecycle Carbon Emissions
            </h2>

            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  {/* HIDDEN LABELS (clean UI) */}
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="total_lifecycle_co2_kg"
                    radius={[8, 8, 0, 0]}
                    barSize={28}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={getBarColor(entry.vehicle_type)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ================= INFO TEXT ================= */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-2">Understanding Carbon Emissions</h2>
            <p className="text-gray-600 leading-relaxed">
              A vehicle's carbon footprint includes emissions generated during
              manufacturing, battery production, and its entire operational
              lifespan.
            </p>
          </div>

          {/* ================= CAR GRID ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500">
                  No vehicles found matching your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>

          {/* ================= FOOTER ================= */}
          <footer className="text-center text-gray-500 py-10">
            © 2026 CARBVIUM • Sustainable Mobility Intelligence
          </footer>
        </main>
      </div>
    </div>
  );
}
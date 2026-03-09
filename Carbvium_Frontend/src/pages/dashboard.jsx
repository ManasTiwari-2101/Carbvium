import { useEffect, useState, useMemo } from "react";
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
import userIcon from "../assets/user_icon.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const navigate = useNavigate();

  const [chartData, setChartData] = useState([]);
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pending filter values (what user selects in the form)
  const [pendingVehicleType, setPendingVehicleType] = useState("all");
  const [pendingPriceRange, setPendingPriceRange] = useState("all");
  const [pendingDailyMileage, setPendingDailyMileage] = useState("");
  const [pendingCategory, setPendingCategory] = useState("all");

  // Suggested car state
  const [suggestedCar, setSuggestedCar] = useState(null);
  const [savings, setSavings] = useState({ co2Saved: 0, percentSaved: 0 });

  // Applied filter values (used for actual filtering)
  const [vehicleType, setVehicleType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [dailyMileage, setDailyMileage] = useState("");
  const [category, setCategory] = useState("all");

  // Track if filters have been applied at least once
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [user, setUser] = useState({ username: "User", email: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply filters function
  const applyFilters = () => {
    setVehicleType(pendingVehicleType);
    setPriceRange(pendingPriceRange);
    setDailyMileage(pendingDailyMileage);
    setCategory(pendingCategory);
    setFiltersApplied(true);
  };

  // ==============================
  // LOAD USER DATA FROM LOCALSTORAGE
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Handle browser back button - redirect to landing page
    const handlePopState = () => {
      navigate("/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  // ==============================
  // FETCH CHART DATA WITH FILTERS
  // ==============================
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let url;

        // If no filters applied, use the default top15-carbon endpoint
        if (vehicleType === "all" && priceRange === "all" && category === "all" && !dailyMileage) {
          url = `${API_URL}/api/top15-carbon`;
        } else {
          // If filters are applied, use the filtered endpoint
          const params = new URLSearchParams();
          if (vehicleType !== "all") {
            params.append("vehicleType", vehicleType);
          }
          if (priceRange !== "all") {
            params.append("priceRange", priceRange);
          }
          if (category !== "all") {
            params.append("category", category);
          }
          if (dailyMileage && vehicleType !== "all") {
            params.append("mileage", dailyMileage);
            params.append("mileageFuelType", vehicleType === "EV" ? "ev" : "fuel_hybrid");
          }
          url = `${API_URL}/api/top15-carbon/filtered?${params.toString()}`;
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
  }, [vehicleType, priceRange, category, dailyMileage]);

  // ==============================
  // FETCH CAR DATA FROM BACKEND
  // ==============================
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vehicles`);

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
          horsepower: car.horsepower,
          mileage: car.mileage,
          category: car.category,
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
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const typeMatch = vehicleType === "all" || car.vehicle_type === vehicleType;

      let priceMatch = true;
      if (car.price !== null && car.price !== undefined) {
        priceMatch =
          priceRange === "all" ||
          (priceRange === "low" && car.price < 10) ||
          (priceRange === "mid" && car.price >= 10 && car.price <= 20) ||
          (priceRange === "high" && car.price > 20);
      }

      const categoryMatch = category === "all" || (car.category && car.category.toLowerCase().includes(category.toLowerCase()));

      // Mileage filter: only applies when a specific fuel type is selected
      let mileageMatch = true;
      if (vehicleType !== "all" && dailyMileage && parseFloat(dailyMileage) > 0) {
        if (vehicleType === "EV") {
          mileageMatch = car.mileage && car.mileage >= parseFloat(dailyMileage);
        } else if (vehicleType === "FUEL" || vehicleType === "HYBRID") {
          mileageMatch = car.mileage && car.mileage >= parseFloat(dailyMileage);
        }
      }

      return typeMatch && priceMatch && categoryMatch && mileageMatch;
    });
  }, [cars, vehicleType, priceRange, category, dailyMileage]);

  // ==============================
  // FILTER BY SEARCH QUERY
  // ==============================
  const searchFilteredCars = useMemo(() => {
    if (!searchQuery.trim()) {
      return cars;
    }
    return cars.filter((car) => {
      const fullName = `${car.company_name || ''} ${car.model_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  }, [cars, searchQuery]);

  console.log("All cars:", cars);
  console.log("Filtered cars:", filteredCars);
  console.log("Current filters - Type:", vehicleType, "Price:", priceRange, "Category:", category, "Daily Mileage:", dailyMileage);

  // ==============================
  // CALCULATE BEST CAR SUGGESTION
  // ==============================
  useEffect(() => {
    if (filteredCars.length > 0) {
      // Find the car with the lowest CO2 emissions
      const bestCar = filteredCars.reduce((best, car) => {
        if (!best || (car.total_lifecycle_co2_kg && car.total_lifecycle_co2_kg < best.total_lifecycle_co2_kg)) {
          return car;
        }
        return best;
      }, null);

      // Calculate average CO2 of filtered cars
      const validCars = filteredCars.filter(car => car.total_lifecycle_co2_kg);
      const avgCO2 = validCars.length > 0
        ? validCars.reduce((sum, car) => sum + car.total_lifecycle_co2_kg, 0) / validCars.length
        : 0;

      // Calculate highest CO2 in filtered set
      const highestCO2Car = filteredCars.reduce((highest, car) => {
        if (!highest || (car.total_lifecycle_co2_kg && car.total_lifecycle_co2_kg > highest.total_lifecycle_co2_kg)) {
          return car;
        }
        return highest;
      }, null);

      if (bestCar && highestCO2Car && bestCar.total_lifecycle_co2_kg) {
        const co2Saved = Math.round(avgCO2 - bestCar.total_lifecycle_co2_kg);
        const percentSaved = Math.round(((avgCO2 - bestCar.total_lifecycle_co2_kg) / avgCO2) * 100);
        const comparedToWorst = Math.round(highestCO2Car.total_lifecycle_co2_kg - bestCar.total_lifecycle_co2_kg);

        setSuggestedCar(bestCar);
        setSavings({
          co2Saved: Math.max(0, co2Saved),
          percentSaved: Math.max(0, percentSaved),
          comparedToWorst: Math.max(0, comparedToWorst)
        });
      } else {
        setSuggestedCar(null);
        setSavings({ co2Saved: 0, percentSaved: 0, comparedToWorst: 0 });
      }
    } else {
      setSuggestedCar(null);
      setSavings({ co2Saved: 0, percentSaved: 0, comparedToWorst: 0 });
    }
  }, [filteredCars]);

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
      <nav className="flex text-white bg-[#0a2c2a] justify-between items-center px-4 py-3 sm:px-10 sm:py-5">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="text-xl sm:text-2xl font-bold">🌿 Carbvium</div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="bg-green-500 hover:bg-green-600 text-black font-medium px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base rounded-full cursor-pointer"
        >
          Logout
        </button>
      </nav>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= SIDEBAR ================= */}
        <aside className={`
          fixed lg:relative z-50 lg:z-auto
          w-[280px] bg-gray-100 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6
          h-[calc(100vh-60px)] lg:h-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}>
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              <img src={userIcon} alt="User" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base">{user.username || "User"}</h3>
            <p className="text-xs sm:text-sm text-gray-500 break-all text-center">{user.email || ""}</p>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Filters</h3>

            <label className="text-xs sm:text-sm">Fuel Type</label>
            <select
              className="w-full mt-1 mb-2 sm:mb-3 border rounded p-2 text-sm"
              value={pendingVehicleType}
              onChange={(e) => {
                setPendingVehicleType(e.target.value);
                setPendingDailyMileage("");
              }}
            >
              <option value="all">All</option>
              <option value="EV">Electric (EV)</option>
              <option value="FUEL">Fuel (Petrol/Diesel)</option>
              <option value="HYBRID">Hybrid</option>
            </select>

            <label className="text-xs sm:text-sm">Price Range</label>
            <select
              className="w-full mt-1 mb-2 sm:mb-3 border rounded p-2 text-sm"
              value={pendingPriceRange}
              onChange={(e) => setPendingPriceRange(e.target.value)}
            >
              <option value="all">All</option>
              <option value="low">Below ₹10L</option>
              <option value="mid">₹10L - ₹20L</option>
              <option value="high">Above ₹20L</option>
            </select>

            <label className="text-xs sm:text-sm">Daily Mileage {pendingVehicleType === "EV" ? "(km/charge)" : pendingVehicleType !== "all" ? "(km/l)" : ""}</label>
            <input
              type="number"
              min="0"
              placeholder={pendingVehicleType === "all" ? "Select a fuel type first" : pendingVehicleType === "EV" ? "Enter range in km/charge" : "Enter efficiency in km/l"}
              className="w-full mt-1 mb-2 sm:mb-3 border rounded p-2 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={pendingDailyMileage}
              disabled={pendingVehicleType === "all"}
              onChange={(e) => setPendingDailyMileage(e.target.value)}
            />

            <label className="text-xs sm:text-sm">Category</label>
            <select
              className="w-full mt-1 mb-2 sm:mb-3 border rounded p-2 text-sm"
              value={pendingCategory}
              onChange={(e) => setPendingCategory(e.target.value)}
            >
              <option value="all">All</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="mpv">MPV</option>
              <option value="crossover">Crossover</option>
            </select>

            <button
              onClick={() => {
                applyFilters();
                setSidebarOpen(false);
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 text-sm rounded-lg transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-8">

          {/* ================= CHART ================= */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-lg font-semibold">
                Top Vehicles Lifecycle Carbon Emissions
              </h2>
              {/* Vehicle Type Legend */}
              <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-gray-600">Fuel</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600">Hybrid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">EV</span>
                </div>
              </div>
            </div>

            <div className="h-[240px] sm:h-[360px] w-full [&_*]:outline-white">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />

                  {/* HIDDEN LABELS (clean UI) */}
                  <XAxis dataKey="name" tick={false} />
                  <YAxis />

                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const co2 = data.total_lifecycle_co2_kg;
                        const co2Color = co2 < 10000 ? "text-green-600" : co2 < 20000 ? "text-yellow-500" : "text-red-500";
                        return (
                          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                            <p className="text-base font-bold text-gray-800 mb-2">{data.name}</p>
                            <p className="text-sm text-gray-500">Total Lifecycle CO₂</p>
                            <p className={`text-xl font-semibold ${co2Color}`}>{co2.toLocaleString()} kg</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar
                    dataKey="total_lifecycle_co2_kg"
                    radius={[8, 8, 0, 0]}
                    barSize={28}
                    activeBar={{ stroke: "none", fillOpacity: 1, style: { filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.4))", transform: "translateY(-8px)" } }}
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

          {/* ================= SUGGESTED CAR SECTION ================= */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border border-green-100">
            {!filtersApplied ? (
              /* Welcome message before filters are applied */
              <div className="text-center py-4 sm:py-8">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🌍</div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-3">Welcome to Carbvium</h2>
                <p className="text-base sm:text-lg text-gray-900 mb-2">Get the Best Carbon Emission Data for Your Next Vehicle</p>
                <p className="text-sm sm:text-base text-gray-800 max-w-lg mx-auto">
                  Use the filters {window.innerWidth < 1024 ? 'in the menu' : 'on the left'} to discover eco-friendly vehicles. We'll analyze lifecycle CO₂ emissions
                  and recommend the most sustainable choice that matches your preferences.
                </p>
                {/* Mobile filter hint */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mt-4 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-full cursor-pointer text-sm"
                >
                  Open Filters
                </button>
              </div>
            ) : (
              /* Show car suggestions after filters are applied */
              <>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-green-800 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🌱</span> Best Car For You
                </h2>

                {suggestedCar ? (
                  <div
                    className={`flex flex-col lg:flex-row gap-6 mt-4 ${suggestedCar ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                    onClick={() => {
                      if (suggestedCar) {
                        setTimeout(() => {
                          const carCard = document.querySelector(`[data-car-id="${suggestedCar.id}"]`);
                          if (carCard) {
                            carCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            const cardElement = carCard.querySelector('.hover\\:shadow-lg');
                            if (cardElement) {
                              cardElement.click();
                            }
                          }
                        }, 100);
                      }
                    }}
                  >
                    {/* Car Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 mb-6">
                        {suggestedCar.image_link && (
                          <img
                            src={suggestedCar.image_link}
                            alt={suggestedCar.name}
                            className="w-32 h-20 sm:w-44 sm:h-28 object-cover rounded-lg shadow-md"
                          />
                        )}
                        <div className="text-center sm:text-left">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800">{suggestedCar.name}</h3>
                          <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${suggestedCar.vehicle_type === "EV" ? "bg-green-100 text-green-700" :
                            suggestedCar.vehicle_type === "HYBRID" ? "bg-gray-100 text-gray-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                            {suggestedCar.vehicle_type}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-4">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">Price</p>
                          <p className="font-semibold text-gray-800">₹{suggestedCar.price_inr_lakhs?.toFixed(1)}L</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">CO₂ Emissions</p>
                          <p className="font-semibold text-green-600">{suggestedCar.total_lifecycle_co2_kg?.toLocaleString()} kg</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">Category</p>
                          <p className="font-semibold text-gray-800">{suggestedCar.category || "N/A"}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="text-gray-500">Mileage</p>
                          <p className="font-semibold text-gray-800">
                            {suggestedCar.mileage || "N/A"} {suggestedCar.vehicle_type === "EV" ? "km/ch" : "km/l"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Savings Card */}
                    <div className="lg:w-64 self-start bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-xl text-white shadow-lg">
                      <h4 className="text-sm font-medium opacity-90 mb-2">Your Potential Savings</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-3xl font-bold">{savings.co2Saved.toLocaleString()} kg</p>
                          <p className="text-sm opacity-80">CO₂ saved vs average</p>
                        </div>
                        <div className="border-t border-white/20 pt-3">
                          <p className="text-2xl font-bold">{savings.percentSaved}%</p>
                          <p className="text-sm opacity-80">Lower than average emissions</p>
                        </div>
                        {savings.comparedToWorst > 0 && (
                          <div className="border-t border-white/20 pt-3">
                            <p className="text-lg font-semibold">{savings.comparedToWorst.toLocaleString()} kg</p>
                            <p className="text-sm opacity-80">Better than highest option</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <p className="text-base sm:text-lg">No vehicles found matching your filters</p>
                    <p className="text-xs sm:text-sm mt-2">Try adjusting your search criteria to get car suggestions</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= SEARCH BAR ================= */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 w-full lg:w-1/2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs sm:text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search car name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:shadow-md transition-shadow"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-2 text-xs sm:text-sm bg-red-100 hover:bg-red-200 rounded-lg text-red-600 font-medium transition-colors cursor-pointer shadow-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ================= CAR GRID ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(searchQuery && searchFilteredCars.length > 0) ? (
              searchFilteredCars.map((car) => (
                <div key={car.id} data-car-id={car.id}>
                  <CarCard car={car} />
                </div>
              ))
            ) : searchQuery && searchFilteredCars.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-500">
                  No cars found matching "{searchQuery}". Try searching for a different car name.
                </p>
              </div>
            ) : filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <div key={car.id} data-car-id={car.id}>
                  <CarCard car={car} />
                </div>
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
          <footer className="bg-gradient-to-r from-yellow-300/80 via-yellow-200/70 to-yellow-300/80 py-3 -mx-4 sm:-mx-8 -mb-4 sm:-mb-8 mt-6 sm:mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#062f2b] font-semibold text-sm sm:text-base">
                <span>🌿</span>
                <span>Carbvium</span>
              </div>
              <p className="text-[#062f2b]/80 text-xs sm:text-sm text-center">
                © 2026 Carbvium • Sustainable Mobility Intelligence
              </p>
              <div className="flex items-center gap-3 sm:gap-4 text-[#062f2b]/70 text-xs sm:text-sm">
                <span className="hover:text-[#062f2b] cursor-pointer transition">Privacy</span>
                <span className="hover:text-[#062f2b] cursor-pointer transition">Terms</span>
                <span className="hover:text-[#062f2b] cursor-pointer transition">Contact</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
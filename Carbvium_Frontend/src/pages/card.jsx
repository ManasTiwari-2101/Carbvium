import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CarCard({ car }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Get vehicle type color
    const getTypeColor = (type) => {
        switch (type.toLowerCase()) {
            case "ev":
                return "bg-green-100 text-green-800";
            case "hybrid":
                return "bg-gray-100 text-gray-800";
            case "fuel":
            case "petrol":
            case "diesel":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    // Get CO2 badge color based on emissions level
    const getCO2BadgeColor = (co2) => {
        if (co2 < 10000) return "bg-green-50 text-green-700";
        if (co2 < 20000) return "bg-yellow-50 text-yellow-700";
        return "bg-red-50 text-red-700";
    };

    // Prepare pie chart data from CO2 emissions (percentage-based for lifecycle)
    const getPieChartData = () => {
        const data = [];
        let total = 0;

        if (car.manufacturing_co2_kg) total += car.manufacturing_co2_kg;
        if (car.running_co2_kg) total += car.running_co2_kg;
        if (car.battery_co2_kg) total += car.battery_co2_kg;

        if (total === 0) return [];

        if (car.manufacturing_co2_kg) {
            data.push({
                name: "Manufacturing",
                value: Math.round((car.manufacturing_co2_kg / total) * 100),
            });
        }
        if (car.running_co2_kg) {
            data.push({
                name: "Running",
                value: Math.round((car.running_co2_kg / total) * 100),
            });
        }
        if (car.battery_co2_kg) {
            data.push({
                name: "Battery",
                value: Math.round((car.battery_co2_kg / total) * 100),
            });
        }
        return data;
    };

    const COLORS = ["#3b82f6", "#f97316", "#a855f7"];

    // Custom label renderer for 3D effect - percentage only inside pie
    const renderCustomLabel = ({ value }) => {
        return `${value}%`;
    };

    // Fallback image if car image is not available
    const carImage =
        car.image_link ||
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600";

    return (
        <>
            {/* Expanded Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Blur Background Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            onClick={() => setIsExpanded(false)}
                        />

                        {/* Expanded Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={() => setIsExpanded(false)}
                        >
                            <motion.div
                                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Left Side - Image & Price (40%) */}
                                <div className="md:w-2/5 flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                                    {/* Car Image - Reduced to 60% height */}
                                    <div className="flex-1 flex items-center justify-center relative mb-4 min-h-0">
                                        <img
                                            src={carImage}
                                            alt={car.name || car.model_name}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600";
                                            }}
                                        />
                                        {/* Vehicle Type Badge */}
                                        <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1 rounded-full ${getTypeColor(car.type || car.vehicle_type)}`}>
                                            {car.type || car.vehicle_type}
                                        </span>
                                    </div>

                                    {/* Specifications Section */}
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                        {car.horsepower && (
                                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                                <p className="text-sm text-gray-900">Horsepower</p>
                                                <p className="text-lg font-bold text-gray-800">{car.horsepower} HP</p>
                                            </div>
                                        )}
                                        {car.mileage && (
                                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                                <p className="text-sm text-gray-900">Mileage</p>
                                                <p className="text-lg font-bold text-gray-800">{car.mileage} {(car.type || car.vehicle_type)?.toLowerCase() === "ev" ? "km/ch" : "km/l"}</p>
                                            </div>
                                        )}
                                        {car.category && (
                                            <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                                                <p className="text-sm text-gray-900">Category</p>
                                                <p className="text-lg font-bold text-gray-800">{car.category}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Price Section Below Image */}
                                    {(car.price || car.price_inr_lakhs) && (
                                        <div className="bg-white p-4 rounded-xl shadow-sm">
                                            <p className="text-l text-gray-900">Price</p>
                                            <p className="text-2xl font-bold text-gray-800">₹{car.price || car.price_inr_lakhs} Lakhs</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side - Details (60%) */}
                                <div className="md:w-3/5 p-5 md:p-6 flex flex-col space-y-4 overflow-hidden">
                                    {/* Header with Title and Close Button */}
                                    <div className="flex justify-between items-start gap-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {car.name || `${car.company_name || ''} ${car.model_name}`.trim()}
                                        </h2>
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Professional 3D Pie Chart */}
                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-2xl shadow-md border border-blue-100 [&_*]:outline-none [&_svg]:focus:outline-none">
                                        <h3 className="text-md font-bold text-gray-700 mb-2 text-center">
                                            🌍 CO₂ Lifecycle
                                        </h3>
                                        {getPieChartData().length > 0 ? (
                                            <div className="w-full" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>
                                                <ResponsiveContainer width="100%" height={190}>
                                                    <PieChart>
                                                        <Pie
                                                            data={getPieChartData()}
                                                            cx="50%"
                                                            cy="55%"
                                                            labelLine={false}
                                                            label={renderCustomLabel}
                                                            outerRadius={65}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                            animationBegin={0}
                                                            animationDuration={800}
                                                        >
                                                            {getPieChartData().map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={COLORS[index % COLORS.length]}
                                                                    style={{ filter: `drop-shadow(2px 2px 4px rgba(0,0,0,0.1))` }}
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(value) => `${value}%`}
                                                            contentStyle={{
                                                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                                                border: "1.5px solid #3b82f6",
                                                                borderRadius: "6px",
                                                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                                                padding: "4px 8px",
                                                                fontSize: "12px"
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-3 text-xs">No emission data available</p>
                                        )}
                                        {/* Legend */}
                                        {getPieChartData().length > 0 && (
                                            <div className="mt-1 grid grid-cols-3 gap-1 text-xs">
                                                {getPieChartData().map((item, index) => (
                                                    <div key={`legend-${index}`} className="flex items-center gap-1">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                        ></div>
                                                        <span className="font-semibold text-gray-700">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Lifecycle CO2 Highlight */}
                                    <div className={`p-3 rounded-xl text-center font-bold ${getCO2BadgeColor(car.co2 || car.total_lifecycle_co2_kg)}`}>
                                        <p className="text-sm font-semibold mb-1">Total Lifecycle CO₂</p>
                                        <p className="text-lg">
                                            {(car.co2 || car.total_lifecycle_co2_kg)?.toLocaleString()} kg
                                        </p>
                                    </div>

                                    {/* Compact CO2 Details Section */}
                                    <div className="space-y-2 text-xs">
                                        <h3 className="text-sm font-bold text-gray-700 border-b pb-1">
                                            📊 Emission Breakdown
                                        </h3>

                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Manufacturing CO2 */}
                                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">🏭</span>
                                                    <p className="font-semibold text-gray-700 text-sm">Manufacturing</p>
                                                </div>
                                                <p className="font-bold text-blue-700 text-sm">
                                                    {car.manufacturing_co2_kg ? `${car.manufacturing_co2_kg.toLocaleString()} kg` : "N/A"}
                                                </p>
                                            </div>

                                            {/* Running CO2 */}
                                            <div className="p-2 bg-orange-50 rounded-lg border border-orange-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">🚗</span>
                                                    <p className="font-semibold text-gray-700 text-sm">Running</p>
                                                </div>
                                                <p className="font-bold text-orange-700 text-sm">
                                                    {car.running_co2_kg ? `${car.running_co2_kg.toLocaleString()} kg` : "N/A"}
                                                </p>
                                            </div>

                                            {/* Battery CO2 */}
                                            <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-lg">🔋</span>
                                                    <p className="font-semibold text-gray-700 text-sm">Battery</p>
                                                </div>
                                                <p className="font-bold text-purple-700 text-sm">
                                                    {car.battery_co2_kg ? `${car.battery_co2_kg.toLocaleString()} kg` : "Negligible"}
                                                </p>
                                            </div>

                                            {/* CO2 per KM */}
                                            {car.lifecycle_intensity_kg_per_km && (
                                                <div className="p-2 bg-teal-50 rounded-lg border border-teal-200">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-lg">📏</span>
                                                        <p className="font-semibold text-gray-700 text-sm">CO₂/KM</p>
                                                    </div>
                                                    <p className="font-bold text-teal-700 text-sm">
                                                        {car.lifecycle_intensity_kg_per_km.toLocaleString()} kg/km
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Regular Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setIsExpanded(true)}
            >
                {/* Car Image */}
                <div className="relative h-40 w-full overflow-hidden bg-gray-200">
                    <img
                        src={carImage}
                        alt={car.name || car.model_name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600";
                        }}
                    />
                </div>

                {/* Car Details */}
                <div className="p-4 space-y-3">
                    {/* Car Name */}
                    <h3 className="font-bold text-lg">
                        {car.name || `${car.company_name || ''} ${car.model_name}`.trim()}
                    </h3>

                    {/* Vehicle Type Badge */}
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeColor(car.type || car.vehicle_type)}`}>
                            {car.type || car.vehicle_type}
                        </span>
                    </div>

                    {/* Price */}
                    {(car.price || car.price_inr_lakhs) && (
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Price:</span> ₹{car.price || car.price_inr_lakhs} Lakhs
                        </p>
                    )}

                    {/* CO2 Emissions */}
                    <div className={`p-3 rounded-lg font-semibold text-sm ${getCO2BadgeColor(car.co2 || car.total_lifecycle_co2_kg)}`}>
                        <div>🌍 Total CO₂ Lifecycle</div>
                        <div className="text-lg">{(car.co2 || car.total_lifecycle_co2_kg).toLocaleString()} kg</div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
                                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Left Side - Image (50%) */}
                                <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-200">
                                    <img
                                        src={carImage}
                                        alt={car.name || car.model_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600";
                                        }}
                                    />
                                    {/* Vehicle Type Badge */}
                                    <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1 rounded-full ${getTypeColor(car.type || car.vehicle_type)}`}>
                                        {car.type || car.vehicle_type}
                                    </span>
                                </div>

                                {/* Right Side - Details (50%) */}
                                <div className="md:w-1/2 p-6 md:p-8 space-y-6 overflow-y-auto">
                                    {/* Close Button */}
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                            {car.name || `${car.company_name || ''} ${car.model_name}`.trim()}
                                        </h2>
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Price */}
                                    {(car.price || car.price_inr_lakhs) && (
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <p className="text-sm text-gray-500">Price</p>
                                            <p className="text-2xl font-bold text-gray-800">₹{car.price || car.price_inr_lakhs} Lakhs</p>
                                        </div>
                                    )}

                                    {/* CO2 Details Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                            🌍 Carbon Emission Details
                                        </h3>

                                        {/* Manufacturing CO2 */}
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🏭</span>
                                                <span className="text-gray-700">Manufacturing CO₂</span>
                                            </div>
                                            <span className="font-bold text-blue-700">
                                                {car.manufacturing_co2_kg ? `${car.manufacturing_co2_kg.toLocaleString()} kg` : "N/A"}
                                            </span>
                                        </div>

                                        {/* Running CO2 */}
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🚗</span>
                                                <span className="text-gray-700">Running CO₂</span>
                                            </div>
                                            <span className="font-bold text-orange-700">
                                                {car.running_co2_kg ? `${car.running_co2_kg.toLocaleString()} kg` : "N/A"}
                                            </span>
                                        </div>

                                        {/* Battery CO2 (if EV) */}
                                        {car.battery_co2_kg && (
                                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">🔋</span>
                                                    <span className="text-gray-700">Battery CO₂</span>
                                                </div>
                                                <span className="font-bold text-purple-700">
                                                    {car.battery_co2_kg.toLocaleString()} kg
                                                </span>
                                            </div>
                                        )}

                                        {/* Total Lifecycle CO2 */}
                                        <div className={`flex justify-between items-center p-4 rounded-lg ${getCO2BadgeColor(car.co2 || car.total_lifecycle_co2_kg)}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">🌍</span>
                                                <span className="font-semibold">Total Lifecycle CO₂</span>
                                            </div>
                                            <span className="font-bold text-lg">
                                                {(car.co2 || car.total_lifecycle_co2_kg)?.toLocaleString()} kg
                                            </span>
                                        </div>

                                        {/* CO2 per KM */}
                                        {car.lifecycle_intensity_kg_per_km && (
                                            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">📊</span>
                                                    <span className="text-gray-700">CO₂ per KM</span>
                                                </div>
                                                <span className="font-bold text-teal-700">
                                                    {car.lifecycle_intensity_kg_per_km} kg/km
                                                </span>
                                            </div>
                                        )}
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

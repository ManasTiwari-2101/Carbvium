import { motion } from "framer-motion";

export default function CarCard({ car }) {
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
        if (co2 < 15000) return "bg-yellow-50 text-yellow-700";
        return "bg-red-50 text-red-700";
    };

    // Fallback image if car image is not available
    const carImage =
        car.image_link ||
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
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
                    {car.name || car.model_name}
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

                {/* Optional: Additional CO2 Details */}
                {(car.manufacturing_co2_kg || car.running_co2_kg) && (
                    <div className="text-xs text-gray-600 space-y-1 border-t pt-2">
                        {car.manufacturing_co2_kg && (
                            <p>🏭 Manufacturing: {car.manufacturing_co2_kg.toLocaleString()} kg</p>
                        )}
                        {car.running_co2_kg && (
                            <p>🚗 Running: {car.running_co2_kg.toLocaleString()} kg</p>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

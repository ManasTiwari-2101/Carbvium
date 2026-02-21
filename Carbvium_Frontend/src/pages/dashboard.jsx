import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
    
      <nav className="flex text-white bg-[#0a2c2a]   justify-between items-center px-10 py-5">
          <div className="text-2xl font-bold">🌿 Carbvium</div> 

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>

      {/* ================= HERO SECTION ================= */}
      <div className="flex flex-col lg:flex-row px-8 py-10 gap-6">

        {/* LEFT SIDE - 30% */}
        <div className="w-full lg:w-[25%]">
          <div className="bg-white rounded-xl shadow p-6 h-full">
            <h2 className="text-lg font-semibold mb-2">Welcome 👋</h2>
            <p className="text-gray-600">
              Compare lifecycle carbon emissions of vehicles based on your needs.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - 70% */}
        <div className="w-full lg:w-[70%]">

          {/* Static Expanded Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6 w-full">
            
            <h3 className="text-lg font-semibold mb-4">
              Vehicle Carbon Comparison
            </h3>

            {/* Chart Area */}
            <div className="h-72 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart goes here</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
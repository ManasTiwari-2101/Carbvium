import { useNavigate } from "react-router-dom";
import treeImg from "../assets/LandingPage_img.png"; 
import co2Img from "../assets/CO2_arrow.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans">

      <nav className="flex text-white bg-[#0a2c2a]   justify-between items-center px-10 py-5">
          <div className="text-2xl font-bold">🌿 Carbvium</div> 
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 text-black font-medium px-6 py-2 rounded-full"
          >
            Login
          </button>
        </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#041f1d] text-white min-h-screen flex flex-col">

        {/* Navbar */}
        {/* <nav className="flex bg-[#0a2c2a] position-sticky top-0 justify-between items-center px-10 py-6">
          <div className="text-2xl font-bold">🌿 Carbvium</div> 

          {/* <div className="hidden md:flex gap-8 text-sm text-gray-300">
            <span className="cursor-pointer hover:text-white">Product</span>
            <span className="cursor-pointer hover:text-white">About</span>
            <span className="cursor-pointer hover:text-white">Blog</span>
            <span className="cursor-pointer hover:text-white">Contact</span>
          </div> */}

          {/* <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 text-black font-medium px-6 py-2 rounded-full"
          >
            Join Today
          </button> */}
        {/* </nav> */} 

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center px-6 mt-10">

          <h1 className="text-4xl md:text-[46px] mt-5 font-extrabold leading-tight max-w-4xl">
            EVERY VEHICLE HAS A {" "}
            <span className="text-green-400">CARBON</span> STORY <br/>
            CHOOSE THE RIGHT ONE 
          </h1>

          <p className="text-gray-300 mt-6 max-w-xl">
            Join a global movement toward sustainability. Monitor your carbon
            emissions in real time and discover ways to reduce your impact.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium">
              Calculate Footprints
            </button>

            <button className="border border-green-400 text-green-400 px-6 py-3 rounded-full font-medium hover:bg-green-400 hover:text-black transition">
              Get Started
            </button>
          </div>

          {/* Tree Image */}
          <div className="mt-12">
            <img
              src={treeImg}
              alt="Tree"
              className="w-[350px] md:w-[450px] mx-auto drop-shadow-2xl  shadow-yellow-200"
            />
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-100 py-20 text-center px-6">
        <h2 className="text-4xl font-extrabold text-[#062f2b] font-stretch-condensed font-family:'sans-serif'">
          HOW IT WORKS
        </h2>
        <p className="text-gray-800 mt-2">
          Simple steps to a greener future.
        </p>

        <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
          {[
            "Enter your activity data or connect integrations.",
            "We calculate your carbon emissions instantly.",
            "Get actionable insights and reduction tips.",
            "Offset with verified climate projects.",
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm text-left"
            >
              <h3 className="font-extrabold text-[#062f2b] mb-2">
                STEP {index + 1}
              </h3>
              <p className="text-gray-800 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY IT MATTERS ================= */}
      <section className="bg-white py-20 text-center px-6">
        <h2 className="text-4xl font-extrabold text-[#062f2b]">
          WHY IT MATTERS
        </h2>

        <p className="text-gray-800 max-w-2xl mx-auto mt-4">
          Carbon dioxide is the leading cause of global warming. Tracking your
          footprint is the first step in reducing it. Together, we can build a
          cleaner, sustainable world.
        </p>

        <div className="mt-12">
          <div className="text-7xl flex  font-extrabold text-green-500 w-[250px] md:w-[250px] mx-auto"><img src={co2Img} alt="CO₂" /></div>
        </div>

        <button className="mt-8 bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium">
          Learn More
        </button>
      </section>

      {/* ================= LEARN & TAKE ACTION ================= */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-9 items-center">

          {/* Left Image */}
          <div className=" shadow-2xl shadow-black rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d"
              alt="Plant"
              className="rounded-xl shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-4xl font-extrabold text-[#062f2b]">
              LEARN & TAKE ACTION
            </h2>

            <p className="text-gray-800 mt-4">
              Stay informed about climate science, sustainability tips, and
              industry insights.
            </p>

            <p className="text-gray-800  mt-2">
              Our blog is filled with resources to help you better understand
              carbon emissions, personal responsibility, and global solutions.
            </p>

            <button className="mt-6 bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium">
              Read Articles
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#041f1d] text-white py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">

          <div>
            <h2 className="text-2xl font-bold">🌿 Coaler</h2>
            <p className="text-gray-300 mt-4 max-w-sm">
              Join a global movement toward sustainability. Monitor your carbon
              emissions in real time and discover ways to reduce your impact.
            </p>

            <button className="mt-6 bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-medium">
              Get Started
            </button>
          </div>

          <div className="flex gap-10 text-gray-300">
            <div className="flex px-5 gap-5">
              <h4 >Product</h4>
              <p>About</p>
              <p>Blog</p>
              <p>Contact</p>
            </div>
          </div>
        </div>

        
      </footer>
      <div className=" text-center text-black text-sm flex justify-center  w-full bg-yellow-300/70">
          ©2025 Coral Inc. All rights reserved
        </div>

    </div>
  );
};

export default Landing;

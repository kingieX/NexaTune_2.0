import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Nexatune = () => {
  const navigate = useNavigate();

  return (
    <div>
        <BackgroundImage />
        <div className="content">
          <Header showLogin = {true} />
          <div className="flex flex-col justify-center mb-10 items-center">
              <div className="flex flex-col">
                  <h1 className="text-5xl p-4 text-center text-white font-bold">Unwind, Refresh & Explore</h1>
                  <p className="text-md p-2 mb-8 text-lg text-white text-center">From Melodic Music to engaging and <br /> Captivating Videos, your perfect escape awaits..</p>
              </div>
              <div>
                  <button onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 font-semibold text-white rounded-md">Get Started</button>
              </div>
          </div>
        </div>
    </div>
  )
}

export default Nexatune;
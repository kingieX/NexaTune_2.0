/* eslint-disable react/prop-types */
import Logo from "../assets/Nexatune.png";
import { useNavigate, NavLink, Link } from "react-router-dom";

const Header = ({ showLogin = true }) => {
  const navigate = useNavigate();

    // Some TailwindCSS Classes
  const activeClass = "primary font-semibold text-xl underline"

  return (
    <div className="headerColor flex p-5 sm:p-10 justify-between items-center">
      <div onClick={() => navigate("/")}>
        <img className="sm:h-10 h-6" src={Logo} alt="Logo" />
      </div>
      {showLogin ? (<div></div>) :(
        <div className="flex gap-10 justify-center items-center text-white">
            <NavLink to="/music" className={({ isActive }) => (isActive ? activeClass : "hover:text-blue-600")}>Home</NavLink>
            <NavLink to="/preferences" className={({ isActive }) => (isActive ? activeClass : "hover:text-blue-600")}>Preferences</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : "hover:text-blue-600")}>About</NavLink>
        </div>
      )}
      {showLogin ? (<div>
        <button onClick={() => navigate("/login")} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 font-semibold text-white rounded-md">Sign in</button>
      </div>) : (<div className="flex flex-row justify-center items-center gap-3">
        <Link to='/profile'>
          <div className="bg-blue-600 px-4 py-2 hover:bg-blue-400 hover:border-blue-600 rounded-full">
            <p className="text-white font-semibold text-xl">P</p>
          </div>
        </Link>
        <button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-400 px-2 py-2 font-semibold text-white rounded-md">Sign out</button>
      </div>)}
    </div>
  )
}

export default Header
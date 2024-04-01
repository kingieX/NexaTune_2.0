import {BrowserRouter, Routes, Route} from "react-router-dom";
import Nexatune from "./pages/Nexatune";
import Register from "./components/Register";
import Login from "./components/Login";
import Preferences from "./pages/Preferences";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
// import Protected from "./components/Protected";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Nexatune />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/music" element={<Dashboard /> } />
          <Route exact path="/preferences" element={<Preferences />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
    </BrowserRouter>
    )
}

export default App

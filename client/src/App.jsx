import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Signin from "./Pages/Signin.jsx";
import Projects from "./Pages/Projects.jsx";
import Home from "./Pages/Home.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
      </Routes>
      ;
    </BrowserRouter>
  );
}

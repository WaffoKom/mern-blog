import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./Pages/About.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Signin from "./Pages/Signin.jsx";
import Signup from "./Pages/Signup.jsx";
import Projects from "./Pages/Projects.jsx";
import Home from "./Pages/Home.jsx";
import Header from "./Components/Header.jsx";
import FooterComponent from "./Components/Footer.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute..jsx";
import CreatePost from "./Pages/CreatePost.jsx";
import UpdatePost from "./Pages/UpdatePost.jsx";
import PostPage from "./Pages/PostPage.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Search from "./Pages/Search.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />}></Route>
          <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
        </Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/post/:postSlug" element={<PostPage />}></Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

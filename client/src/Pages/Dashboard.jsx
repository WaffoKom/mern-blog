import  { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSideBar from "../Components/DashSideBar.jsx";
import DashProfile from "../Components/DashProfile.jsx";
import DashPosts from "../Components/DashPosts.jsx";
import DashUsers from "../Components/DashUsers.jsx";
import DashComments from "../Components/DashComments.jsx";
import DashBoardComponents from "../Components/DashBoardComponents.jsx";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSideBar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments */}
      {tab === "comments" && <DashComments />}
      {/* DasbooardComponents */}
      {tab === "dashboardcomponents" && <DashBoardComponents />}
    </div>
  );
}

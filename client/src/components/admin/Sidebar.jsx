import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faChartLine,
  faBell,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="text-black shadow-2xl left-0 h-full p-6 flex flex-col justify-between bg-white "
      style={{
        // backgroundColor: "#F5F5F5",
        borderTopRightRadius: "1rem",
        borderBottomRightRadius: "1rem",
        width: "15vw",
      }}
    >
      <div className="mt-16">
        <div className="flex flex-col space-y-8">
          <Link
            to="/dashboard"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/dashboard")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-4" />
            Dashboard
          </Link>
          <Link
            to="/userManagement"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/userManagement")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faUsers} className="mr-4" />
            Users
          </Link>
          <Link
            to="/reports"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/reports")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-4" />
            Reports
          </Link>
          <Link
            to="/notifications"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/notifications")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBell} className="mr-4" />
            Notifications
          </Link>
          <Link
            to="/complaints"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/complaints")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faBell} className="mr-4" />
            Complaints
          </Link>
          <Link
            to="/settings"
            className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${
              isActive("/settings")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
            }`}
          >
            <FontAwesomeIcon icon={faCog} className="mr-4" />
            Account Settings
          </Link>
        </div>
      </div>
      <div>
        <button className="text-xl flex items-center p-4 rounded transition-colors duration-300 bg-white text-black hover:bg-gray-200 w-full justify-center">
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

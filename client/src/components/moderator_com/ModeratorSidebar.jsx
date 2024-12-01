import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faNewspaper,
  faBell,
  faUser,
  faSignOutAlt,
  faBook,
  faQuestionCircle,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

const ModeratorSidebar = (props) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`fixed h-screen w-8  z-50 flex flex-col justify-center ${props.value ? "-left-8" : "left-0"}`} onMouseEnter={() => props.setValue(true)}>
        <div className="h-56 bg-gray1 w-full shadow-2xl flex flex-col justify-center rounded-r-lg bg-opacity-30 backdrop-filter backdrop-blur-lg" style={
          {
            background: "rgba(108, 108, 108, 0.2)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(108, 108, 108, 0.1)"
          }
        }>
          <FontAwesomeIcon icon={faChevronRight} className="text-2xl text-gray1" />
        </div>
      </div>
      <div
        className={`fixed text-black shadow-2xl w-96 p-6 pr-0 pt-0 flex flex-col justify-between bg-white transition-all duration-800 ${props.value ? "left-0" : "-left-96"}`}
        style={{
          height: "calc(100vh - 62.9px)",
          borderTopRightRadius: "1rem",
          borderBottomRightRadius: "1rem",
          top: "62.9px",
        }}
      >
        <div className="my-8">
          <div className="flex flex-col space-y-8">
            <Link
              to="/modDashboard"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/modDashboard")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-4" />
              Dashboard
            </Link>
            <Link
              to="/articles/reviewList"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/articles/reviewList")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faNewspaper} className="mr-4" />
              Pending Articles
            </Link>
            <Link
              to="/articles/reviewedArticleListByMod"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/articles/reviewedArticleListByMod")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faNewspaper} className="mr-4" />
              Reviewed Articles
            </Link>
            <Link
              to="/reviewQuizList"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/reviewQuizList")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="mr-4" />
              Weekly Quizzes
            </Link>
            {/* <Link
              to="/resources"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/resources")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faBook} className="mr-4" />
              Resources
            </Link> */}
            <Link
              to="/modNotifications"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/modNotifications")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faBell} className="mr-4" />
              Notifications
            </Link>
            <Link
              to="/tProfile"
              className={`text-2xl flex items-center p-4 rounded transition-colors duration-300 ${isActive("/tProfile")
                ? "bg-blue text-white"
                : "hover:bg-gray-200 text-black"
                }`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-4" />
              Profile
            </Link>
          </div>
        </div>
        <div>
          <button className="text-2xl flex items-center p-4 rounded transition-colors duration-300 bg-white text-black hover:bg-gray-200 w-full">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-4" />
            Logout
          </button>
        </div>
      </div>
    </>

  );
};

export default ModeratorSidebar;

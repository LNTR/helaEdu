import React, { useState } from "react";
import { Footer, Header } from "@/components/common";
import Sidebar from "@components/admin/Sidebar";
import TableRows from "@/components/admin/TableRows"; 

const UserManagement = () => {
  const [isPending, setIsPending] = useState(true);
  const [isStudents, setIsStudents] = useState(false);
  const [isTeachers, setIsTeachers] = useState(false);
  const [isModerators, setIsModerators] = useState(false);
  const [isTopTeachers, setIsTopTeachers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tab) => {
    setIsPending(false);
    setIsStudents(false);
    setIsTeachers(false);
    setIsModerators(false);
    setIsTopTeachers(false);

    switch (tab) {
      case "PendingRequests":
        setIsPending(true);
        break;
      case "Students":
        setIsStudents(true);
        break;
      case "Teachers":
        setIsTeachers(true);
        break;
      case "Moderators":
        setIsModerators(true);
        break;
      case "TopTeachers":
        setIsTopTeachers(true);
        break;
      default:
        break;
    }
  };
  const resetSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-wrapper mb-9">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="content-wrapper ">
          
            <div className="tabs text-sm flex justify-center mb-4">
              <button
                onClick={() => handleTabClick("PendingRequests")}
                className={`tab-button ${isPending ? "active" : ""}`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => handleTabClick("Students")}
                className={`tab-button ${isStudents ? "active" : ""}`}
              >
                Students
              </button>
              <button
                onClick={() => handleTabClick("Teachers")}
                className={`tab-button ${isTeachers ? "active" : ""}`}
              >
                Teachers
              </button>
              <button
                onClick={() => handleTabClick("Moderators")}
                className={`tab-button ${isModerators ? "active" : ""}`}
              >
                Moderators
              </button>
              <button
                onClick={() => handleTabClick("TopTeachers")}
                className={`tab-button ${isTopTeachers ? "active" : ""}`}
              >
                Top Teachers
              </button>
            </div>
            <div className="flex justify-end mr-40 mt-4">
              <input 
                type="text" 
                className="border border-blue px-10 py-2 rounded-2xl h-16 w-60" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <button 
                onClick={resetSearch} 
                className="ml-2 px-6 py-2 bg-blue text-white text-xl rounded-2xl h-16"
              >
                Reset
              </button>
            </div>
            <div className="">
              <TableRows 
                isPending={isPending} 
                isStudents={isStudents} 
                isTeachers={isTeachers} 
                isModerators={isModerators} 
                isTopTeachers={isTopTeachers} 
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default UserManagement;

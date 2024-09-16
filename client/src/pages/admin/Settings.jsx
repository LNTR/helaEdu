import React from "react";
import { Header, Footer } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import Profile from "@/components/admin/Profile";
import Password from "@/components/admin/Password";
import ProfileDeletion from "@/components/admin/ProfileDeletion";

const Settings = () => {
  return (
  
    <>
    <Header />
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="content-wrapper">
          <div className="mx-32 mt-10">
            <h1>Account Settings</h1>
            <Profile/>
            <ProfileDeletion/>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
};

export default Settings;

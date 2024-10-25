import React from "react";
import { Footer, Header } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import ReportBox from "@components/admin/ReportBox";
// import CountBox from '@/components/admin/CountBox';
// import Accessbtn from '@/components/admin/AccessBtn';
// import Table from '@/components/admin/Table';
// import SeeMoreBtn from '@/components/admin/SeeMoreBtn';
import Preview from "@components/admin/Preview";
const Reports = () => {
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
              <h1>Report Generation</h1>
              <ReportBox/>
              <Preview/>
            </div>
           
           
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Reports;

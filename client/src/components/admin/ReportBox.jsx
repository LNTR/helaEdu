import React, { useState } from "react";
import { getSubscriptionsByDate, getUserRegistrationsByDate } from "@services/ReportService";
import Preview from "./Preview";

export default function ReportBox() {
  const [reportData, setReportData] = useState([]);
  const [reportTitle, setReportTitle] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const [reportType, setReportType] = useState("Subscriptions");
  const [userType, setUserType] = useState("Student"); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const generateReport = () => {
    let data = [];
    if (reportType === "Subscriptions") {
      data = getSubscriptionsByDate(startDate, endDate);
      setReportTitle("Subscriptions Report");
      setReportDescription("This report shows the number of subscriptions by date.");
    } else if (reportType === "Registrations") {
      data = getUserRegistrationsByDate(startDate, endDate, userType);
      setReportTitle("User Registrations Report");
      setReportDescription(
        `This report shows the number of registrations by date for ${
          userType ? userType : "all user types"
        }.`
      );
    }
    setReportData(data);
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
    if (value === "Subscriptions") {
      setUserType("Student"); // Lock user type to "Student" for subscriptions
    } else {
      setUserType(""); // Reset user type for registrations
    }
  };

  return (
    <div>
      <div className="shadow-xl rounded-xl px-14 pt-14 pb-7">
        <h2 className="text-blue text-3xl py-2">Get your customized Report</h2>
        <p className="text-black text-2xl pb-7">
          You can download and also customize your reports with filters
        </p>

        <h1 className="text-2xl text-blue">Choose your report type</h1>
        <select
          value={reportType}
          onChange={(e) => handleReportTypeChange(e.target.value)}
          className="my-4 px-5 py-3 w-10/12 border border-blue rounded-xl text-xl"
        >
          <option value="Subscriptions">User Subscriptions</option>
          <option value="Registrations">User Registrations</option>
        </select>

        {reportType === "Registrations" && (
          <>
            <h1 className="text-2xl text-blue my-6">Choose user type</h1>
            <div className="flex justify-start">
              {["Student", "Teacher", "Moderator"].map((type) => (
                <label key={type} className="text-xl flex items-center mx-2">
                  <input
                    type="radio"
                    value={type}
                    checked={userType === type}
                    onChange={(e) => setUserType(e.target.value)}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </>
        )}

        <h1 className="text-2xl text-blue my-6">Choose time duration</h1>
        <div className="flex justify-start mt-7">
          <div className="w-1/2">
            <label className="text-xl flex items-center">
              <span>Start date</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-5 py-3 border border-blue rounded-xl mx-5 text-2xl"
              />
            </label>
          </div>
          <div className="w-1/2">
            <label className="text-xl flex items-center">
              <span>End Date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-5 py-3 border border-blue rounded-xl mx-5 text-2xl"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end my-10">
          <button
            onClick={generateReport}
            className="bg-blue px-6 py-3 rounded-xl text-2xl text-white"
          >
            Generate report
          </button>
        </div>
      </div>

      {reportData.length > 0 && (
        <Preview data={reportData} title={reportTitle} description={reportDescription} />
      )}
    </div>
  );
}

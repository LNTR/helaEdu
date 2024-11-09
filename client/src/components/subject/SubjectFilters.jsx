import React, { useEffect } from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
function SubjectFilters() {
  const grades = [
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
    "Grade 13",
  ];
  let [enrollFilter, setEnrollFilter] = useState("all");
  let [selectedGrade, setSelectedGrade] = useState(grades[0] || "Select Grade");
  useEffect(() => {
    switch (enrollFilter) {
      case "all":
        //all course detail logic
        break;
      case "enroll":
        //enroll course details logic
        break;
    }
  }, [enrollFilter]);

  useEffect(() => {
    switch (selectedGrade) {
      case "all":
        //all course detail logic
        break;
      case "enroll":
        //enroll course details logic
        break;
    }
  }, [selectedGrade]);

  return (
    <div className="mx-44 ">
      <div className="flex justify-center items-center mt-12">
        <div className="flex justify-center items-center mb-10">
          <div className="flex space-x-4 text-sm">
            <button
              className={`text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 transition-colors ${
                enrollFilter == "all" ? "bg-blue text-white" : ""
              }`}
              onClick={() => {
                setEnrollFilter("all");
              }}
            >
              All
            </button>
            <button
              className={`text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 transition-colors ${
                enrollFilter == "enroll" ? "bg-blue text-white" : ""
              }`}
              onClick={() => {
                setEnrollFilter("enroll");
              }}
            >
              Enrolled Only
            </button>
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 transition-colors flex items-center"
              >
                {selectedGrade}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-gray1 text-sm ml-2"
                />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-1 shadow rounded-box w-52 text-sm"
                style={{ zIndex: 10 }}
              >
                {grades.map((grade, index) => (
                  <li key={index} className="z-10">
                    <button
                      onClick={() => setSelectedGrade(grade)}
                      className={`text-xl w-full text-left px-4 py-2 z-10 ${
                        selectedGrade == grade ? "bg-blue text-white" : ""
                      }`}
                    >
                      {grade}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button className="text-xl bg-black px-10 py-3 rounded-sm border border-gray1 text-white hover:bg-blue hover:text-white transition-colors">
              Save Filters
            </button>
            <button className="text-xl bg-black px-10 py-3 rounded-sm border border-gray1 text-white hover:bg-blue hover:text-white transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

export default SubjectFilters;

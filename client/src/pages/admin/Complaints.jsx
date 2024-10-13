import React, { useState } from "react";
import { Header } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import TableRowHeaderC from "@components/admin/TableRowHeaderC";
import TableRowC from "@components/admin/TableRowC";
import Pagination from "@components/articles/Pagination";

const Complaints = () => {
  const commentsData = [
    {
      commentId: 1,
      comment: "Great job on the project!",
      commentedBy: "John Doe",
      reportedBy: "Alice Smith",
      date: "2024-08-30",
      status: "Approved",
    },
    {
      commentId: 2,
      comment: "Please revise the design.",
      commentedBy: "Jane Smith",
      reportedBy: "Bob Johnson",
      date: "2024-08-28",
      status: "Pending",
    },
    {
      commentId: 3,
      comment: "Content needs updating.",
      commentedBy: "Michael Brown",
      reportedBy: "Charlie Lee",
      date: "2024-08-27",
      status: "Rejected",
    },
    {
      commentId: 4,
      comment: "This is ready to go live.",
      commentedBy: "Emily Davis",
      reportedBy: "David Wilson",
      date: "2024-08-26",
      status: "Approved",
    },
    {
      commentId: 5,
      comment: "Fix the typos in the document.",
      commentedBy: "Daniel Miller",
      reportedBy: "Eve Thompson",
      date: "2024-08-25",
      status: "Pending",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7; 
  const totalPages = Math.ceil(commentsData.length / rowsPerPage);

  const currentRows = commentsData
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((comment) => (
      <TableRowC
        key={comment.commentId}
        comment={comment.comment}
        commentedBy={comment.commentedBy}
        reportedBy={comment.reportedBy}
        date={comment.date}
        status={comment.status}
      />
    ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <div className="dashboard-wrapper">
          <div className="sidebar-wrapper">
            <Sidebar />
          </div>
          <div className="content-wrapper">
            <h1 className="mx-32 my-14">Complaints</h1>
            <TableRowHeaderC />
            <div>{currentRows}</div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Complaints;

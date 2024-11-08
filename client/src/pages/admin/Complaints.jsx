import React, { useEffect, useState } from "react";
import { Header } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import TableRowHeaderC from "@components/admin/TableRowHeaderC";
import TableRowC from "@components/admin/TableRowC";
import Pagination from "@components/articles/Pagination";
import { getCommentById} from "@services/ArticleService";
import { getUserDetails } from "@services/TeacherService";
import { listComplaints } from "@services/AdminService";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsList = await listComplaints();
        console.log("Complaints List:", complaintsList);
      
        const complaintsArray = complaintsList.data;
        console.log("array",complaintsArray);
  
        const complaintsWithDetails = await Promise.all(
          complaintsArray.map(async (complaint) => {
            const reporterDetails = await getUserDetails(complaint.userId);
            console.log("reporter",reporterDetails);
            const commentDetails = await getCommentById(complaint.commentId);
            console.log("comments",commentDetails);
            const commentAuthorDetails = await getUserDetails(commentDetails.data.userId);
            console.log("commentsauther",commentAuthorDetails);
            return {
              ...complaint,
              reportedBy: reporterDetails.data.firstName + reporterDetails.data.lastName,
              comment: commentDetails.data.comment,
              commentedBy: commentAuthorDetails.data.firstName + commentAuthorDetails.data.lastName,
            };
          })
        );
        setComplaints(complaintsWithDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  const totalPages = Math.ceil(complaints.length / rowsPerPage);
  const currentRows = complaints
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((complaint) => (
      <TableRowC
        key={complaint.complaintId}
        complaintId={complaint.complaintId}
        comment={complaint.comment}
        complaint={complaint.complaint}
        commentedBy={complaint.commentedBy}
        reportedBy={complaint.reportedBy}
        date={complaint.publishedTimestamp}
        status={complaint.status || "Pending"}
        articleId={complaint.articleId}
        commentId={complaint.commentId}
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

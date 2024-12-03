import React, { useEffect, useState } from "react";
import { Header } from "@/components/common";
import Sidebar from "@/components/admin/Sidebar";
import TableRowHeaderC from "@components/admin/TableRowHeaderC";
import TableRowC from "@components/admin/TableRowC";
import Pagination from "@components/articles/Pagination";
import { getCommentById } from "@services/ArticleService";
import { getUserDetails } from "@services/TeacherService";
import { listAllUsersDetails } from "@services/TeacherService";
import { listComplaints } from "@services/AdminService";
import Sort from "@components/complaints/Sort";
import LoadingComponent from "@components/common/LoadingComponent";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const rowsPerPage = 7;
  const [loadingState,setLoadingState] =useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoadingState(true);
      try {
        const complaintsList = await listComplaints();
        const complaintsArray = complaintsList.data;

        const complaintsWithDetails = await Promise.all(
          complaintsArray.map(async (complaint) => {
            const reporterDetails = await listAllUsersDetails(complaint.userId);
            const commentDetails = await getCommentById(complaint.commentId);
            const commentAuthorDetails = await listAllUsersDetails(commentDetails.data.userId);
            return {
              ...complaint,
              reportedBy: reporterDetails.data.firstName + ' ' + reporterDetails.data.lastName,
              comment: commentDetails.data.comment,
              commentedBy: commentAuthorDetails.data.firstName + ' ' + commentAuthorDetails.data.lastName,
            };
          })
        );
        setComplaints(complaintsWithDetails);
        setFilteredComplaints(complaintsWithDetails); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoadingState(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...complaints];

    if (selectedStatus !== "All") {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter((complaint) =>
        new Date(complaint.publishedTimestamp).toDateString() === selectedDate.toDateString()
      );
    }

    setFilteredComplaints(filtered);
  }, [selectedStatus, selectedDate, complaints]);

  const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
  const currentRows = filteredComplaints
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
            {loadingState?
              <LoadingComponent/> :null
            }
            <Sort onDateChange={setSelectedDate} onStatusChange={setSelectedStatus} />
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

import TableRaw from "@components/assignments/TableRaw";
import { Header, Footer } from "@components/common";
import React, { useState, useEffect } from "react";
import Pagination from "@components/articles/Pagination";
import { Link } from "react-router-dom";
import { listAssignment } from "@services/AssignmentService";
import TableRowHeader from "@components/assignments/TableRowHeader";
import { listTeacherDetails } from "@services/TeacherService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DetailesView from "@components/assignments/DetailesView";
import { deleteAssignment } from "@services/AssignmentService";
import LoadingComponent from "@components/common/LoadingComponent";

export default function AssignmentList() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewPopup, setIsViewPopupOpen] = useState(false);
  const [assignment, setAssignment] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [loadingState,setLoadingState] = useState(false);
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const openDeleteModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsPopupOpen(true);
  };

  const closeDeleteModal = () => {
    setIsPopupOpen(false);
    setSelectedAssignmentId(null);
  };
  const openViewModal = () => {
    setIsViewPopupOpen(true);
  };

  const closeViewModal = () => {
    setIsViewPopupOpen(false);
  };

  const handleDelete = async () => {
    
    try {
      await deleteAssignment(selectedAssignmentId);
      setAssignment((prev) => prev.filter((a) => a.assignmentId !== selectedAssignmentId));
      closeDeleteModal();
      alert("Assignment deleted successfully.");
    } catch (error) {
      console.error("Failed to delete assignment:", error);
      alert("Failed to delete the assignment.");
    }
  };

  useEffect(() => {
   
    const fetchAssignments = async () => {
      setLoadingState(true);
      try {
        const teacherDetails = await listTeacherDetails(headers);
        const teacherResponse = teacherDetails.data.userId;
        console.log(teacherResponse);
        const assignmentDetails = await listAssignment(teacherResponse);
        const assignment = assignmentDetails.data;

        console.log(assignment);
        setAssignment(assignment);
      } catch (error) {
        console.error(error);
      }finally{
        setLoadingState(false);
      }
    };

    fetchAssignments();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const totalPages = Math.ceil(assignment.length / rowsPerPage);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
  const convertMillisToISO = (millis) => {
    const date = new Date(millis);
    return date.toISOString();
  };

  const currentRows = assignment
  .sort((a, b) => b.publishedTimestamp - a.publishedTimestamp) 
  .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  .map((data, index) => (
    <TableRaw
      key={data.assignmentId}
      assignmentId={data.assignmentId}
      title={data.title}
      instruction={data.instructions}
      publishedDate={convertMillisToISO(data.publishedTimestamp)}
      totalTime={formatTime(data.totalTime * 1000)}
      onClose={() => openDeleteModal(data.assignmentId)}
      onView={openViewModal}
      started={data.started}
    />
  ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <div className="flex justify-between mx-48 my-12">
          {isPopupOpen && (
            <dialog open className="modal">
              <div className="modal-box max-w-3xl p-10">
                <p className="py-4 text-3xl">
                  Are you sure you want to delete this assignment?
                </p>
                <div className="modal-action">
                  <button
                    className="btn bg-red-400 text-white text-2xl"
                    onClick={closeDeleteModal}
                  >
                    Cancel
                  </button>
                  <button className="btn bg-blue text-white text-2xl" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </dialog>
          )}
          {isViewPopup && (
            <dialog open className="modal">
              <div className="modal-box max-w-3xl p-10">
                <DetailesView />
              </div>
            </dialog>
          )}
          <div>
            <h1>My Assignments</h1>
            <hr className="border-yellow border-t-4 w-full hover:border-white transition duration-300 ease-in-out"></hr>
          </div>
          <div>

            <Link to="/assignments/createAssignments">
              <button className="bg-yellow text-white rounded-xl p-4 text-3xl">
                Create Assignment
              </button>
            </Link>
          </div>
        </div>
        {loadingState && (
          <LoadingComponent/>
        )}

        <TableRowHeader />
        <div className="min-h-screen">{currentRows}</div>
        <div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

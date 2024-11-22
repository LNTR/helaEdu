import TableRawForPending from "@components/admin/TableRowForPending";
import React, { useState, useEffect } from "react";
import Pagination from "@components/articles/Pagination";
import { getPendingTeachers } from "@services/TeacherService";
import TableHeaderForUsers from "@components/admin/TableHeaderForUsers";

export default function ApproveTeachers({ searchQuery }) {
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 7;

  useEffect(() => {
    const fetchPendingTeachers = async () => {
      try {
        const response = await getPendingTeachers();
        const fetchedTeachers = response.data;
        if (Array.isArray(fetchedTeachers)) {
          setTeachers(fetchedTeachers);
        } else {
          setTeachers([]); 
        }
      } catch (error) {
        console.error(error);
        setTeachers([]); 
      }
    };

    fetchPendingTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => 
    teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    teacher.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

  const currentRows = filteredTeachers
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((teacher) => (
      <TableRawForPending
        key={teacher.teacherId}
        teacherId={teacher.teacherId}
        firstName={teacher.firstName}
        lastName={teacher.lastName}
        email={teacher.email}
        proofPdf={teacher.proofRef}
      />
    ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="my-10">
       
        <div className='flex justify-center my-4'>
              <div className='bg-blue rounded-3xl w-10/12 h-16 px-7 py-4 flex justify-between items-center text-white'>
                  <div className='w-4/12 text-center'>
                      <p className='text-2xl text-left'>User Name</p>
                  </div>
                  <div className='w-4/12  text-center'>
                      <p className='text-2xl text-left'>Email</p>
                  </div>
                  <div className='w-3/12  text-center'>
                      <p className='text-2xl text-left'>Validation Proof</p>
                  </div>
                  <div className='w-2/12  text-right'>
                      <p className='text-2xl text-left'>Actions</p>
                  </div>
              
              </div>
        </div>
        <div className="min-h-72">
         
          {currentRows}
        </div>
        <div>
         
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

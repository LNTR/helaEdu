import React, { useState, useEffect } from 'react';
import TableRawTopTeachers from '@components/admin/TableRowTopTeachers';
import Pagination from '@components/articles/Pagination';
import TableHeaderForUsers from '@components/admin/TableHeaderForUsers';
import { getTopTeachers } from '@services/TeacherService';

export default function TopTeachersPage({ searchQuery}) {
  const [teachers, setTeachers] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await getTopTeachers();
        setTeachers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // teacher.points?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

  const currentRows = filteredTeachers
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((teacher) => (
      <TableRawTopTeachers
        key={teacher.userId}
        teacherId={teacher.userId}
        firstName={teacher.firstName}
        email={teacher.email}
        points={teacher.points}
        subjects={teacher.subjects}
      />
    ));

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="my-10 z-50">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <TableHeaderForUsers isTopTeacher={true}/>
            <div>{currentRows}</div>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

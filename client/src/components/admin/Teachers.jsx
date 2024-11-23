import TableRawTeachers from '@components/admin/TableRowTeachers';
import React ,{useState, useEffect} from 'react';
import Pagination from '@components/admin/Pagination';
import { listAllTeachersDetails } from '@services/TeacherService';
import TableHeaderForUsers from "@components/admin/TableHeaderForUsers";
export default function Teachers({searchQuery}) {

    const [currentPage, setCurrentPage] = useState(1);
    const [teachers, setTeachers] = useState([]);
    const rowsPerPage = 7;

    useEffect(() => {
      const fetchTeachers = async () => {
          const response = await listAllTeachersDetails(currentPage);
          setTeachers(response.data); 
          console.log(response.data);
      };
      fetchTeachers();
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
        <TableRawTeachers
        key={teacher.userId}
        userId={teacher.userId}
        profileRef={teacher.profilePictureUrl}
        firstName={teacher.firstName}
        lastName={teacher.lastName}
        email={teacher.email}
        />
    ));
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

  return (
    <div>
     
      <div className=' my-10 z-50'>
       
        <div className="min-h-72">
          <TableHeaderForUsers/>
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

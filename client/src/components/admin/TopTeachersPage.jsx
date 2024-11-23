import TableRawTopTeachers from '@components/admin/TableRowTopTeachers';
import { Header, Footer } from '@components/common';
import React ,{useState} from 'react';
import Pagination from '@components/articles/Pagination';
import TableHeaderForUsers from "@components/admin/TableHeaderForUsers";

const teacher = [
    {
      teacherId: 1,
      firstName: 'M.perera',
      email: 'perera23@gmail.com',
      contactNo: '0766767678',
      subjects:'sinhala,english'
    },
    {
        teacherId: 4,
        firstName: 'M.perera',
        email: 'perera23@gmail.com',
        contactNo: '0766767678',
        subjects:'sinhala,english'
      },
      {
        teacherId: 5,
        firstName: 'M.perera',
        email: 'perera23@gmail.com',
        contactNo: '0766767678',
        subjects:'sinhala,english'
      },
      {
        teacherId: 6,
        firstName: 'M.perera',
        email: 'perera23@gmail.com',
        contactNo: '0766767678',
        subjects:'sinhala,english'
      }
    
  ];
  
export default function TopTeachersPage({searchQuery}) {

    const [currentPage, setCurrentPage] = useState(1);
    
    const rowsPerPage = 7;
    const filteredTeachers = teacher.filter((teacher) => 
      teacher.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

    const currentRows = filteredTeachers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    ).map((teacher, index) => (
        <TableRawTopTeachers
        key={teacher.teacherId}
        teacherId={teacher.teacherId}
        firstName={teacher.firstName}
        email={teacher.email}
        contactNo={teacher.contactNo}
        subjects={teacher.subjects}
       
        />
    ));
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

  return (
    <div>
     
      <div className='my-10 z-50'>
       
        <div>
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

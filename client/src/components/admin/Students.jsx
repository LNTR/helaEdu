import TableRawStudents from '@components/admin/TableRowStudents';
import React ,{useState , useEffect} from 'react';
import Pagination from '@components/admin/Pagination';
import { listStudentDetails } from '@services/StudentService';
import TableHeaderForUsers from "@components/admin/TableHeaderForUsers";
export default function Students({searchQuery}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState([]);
  const rowsPerPage = 7;
  
  const filteredStudents = students.filter(( student) => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    const fetchStudents = async () => {
        const response = await listStudentDetails(currentPage);
        setStudents(response.data); 
        console.log(response.data);
    };
    fetchStudents();
  }, []);
  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    // const [currentPage, setCurrentPage] = useState(1);
    // const rowsPerPage = 7;
    // const totalPages = Math.ceil(student.length / rowsPerPage);

    const currentRows = filteredStudents
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    .map((student) => (
      <TableRawStudents
        key={student.userId}
        userId={student.userId}
        profileRef={student.profilePictureUrl}
        firstName={student.firstName}
        lastName={student.lastName}
        email={student.email}
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

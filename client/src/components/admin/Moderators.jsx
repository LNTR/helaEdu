import TableRawModerators from '@components/admin/TableRowModerators';
import { Header, Footer } from '@components/common';
import React ,{useState , useEffect} from 'react';
import Pagination from '@components/admin/Pagination';
import { listModeratorDetails } from '@services/TeacherService';
import TableHeaderForUsers from "@components/admin/TableHeaderForUsers";

export default function Moderators({ searchQuery }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [moderators, setModerators] = useState([]);
  const rowsPerPage = 7;
  useEffect(() => {
    const fetchModerators = async () => {
        const response = await listModeratorDetails(currentPage);
        setModerators(response.data); 
        console.log(response.data);
    };
    fetchModerators();
  }, [currentPage]);

  const filteredModerators = moderators.filter((moderators) => 
    moderators.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    moderators.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moderators.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredModerators.length / rowsPerPage);

  const currentRows = filteredModerators
  .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  .map((moderator) => (
    <TableRawModerators
      key={moderator.userId}
      userId={moderator.userId}
      profileRef={moderator.profilePictureUrl}
      firstName={moderator.firstName}
      lastName={moderator.lastName}
      email={moderator.email}
    />
  ));
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div>
     
      <div className='my-8 z-50'>
       
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

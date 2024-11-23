import React from 'react';
import ApproveTeachers from '@components/admin/ApproveTeachers';
import TopTeachersPage from "@components/admin/TopTeachersPage"
import Students from "@components/admin/Students";
import Moderators from "@components/admin/Moderators";
import Teachers from '@components/admin/Teachers';

const TableRows = ({ isPending, isStudents, isTeachers, isModerators, isTopTeachers ,searchQuery }) => {
  if (isPending) {
    return <ApproveTeachers searchQuery={searchQuery} />;
  }
  
  if (isStudents) {
    return <Students searchQuery={searchQuery}  />;
  }
  if (isTeachers) {
    return <Teachers searchQuery={searchQuery} />;
  }
  if (isModerators) {
    return <Moderators searchQuery={searchQuery} />;
  }
  if (isTopTeachers) {
    return <TopTeachersPage searchQuery={searchQuery} />;
  }
  return null;
};

export default TableRows;

import React from 'react'
import Sidebar from '@components/admin/Sidebar';
import { Header, Footer } from '@components/common';
import Pagination from '@components/admin/Pagination';
import TableRowHeaderSub from '@components/admin/TableRowHeaderSub';

export default function Subscription() {
  return (
    <>
    <Header />
    <div className="dashboard">
      <div className="dashboard-wrapper">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="content-wrapper">
          <h1 className="mx-32 my-14">Subscriptions</h1>
         
          <TableRowHeaderSub />
          {/* <div>{currentRows}</div> */}
          {/* <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          /> */}
        </div>
      </div>
    </div>
  </>
  )
}

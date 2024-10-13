import React from 'react'
import { Header } from '@components/common'
import Sidebar from '@components/moderator_com/ModeratorSidebar'
import { useState } from 'react'
import Topic from '@components/moderator_com/Topic';
import AddResource from '@components/moderator_com/AddResource';

export default function Resources() {
    const [sidebar, setSidebar] = useState(false);

    return (
  
      <>
        <Header />
        <div className="dashboard h-screen mx-auto" style={{ width: sidebar ? `calc(100vw - 384px)` : '100vw' }} onClick={() => setSidebar(false)}>
          <Sidebar value={sidebar} setValue={setSidebar} />
          <div className="content-wrapper mx-64" >
            <Topic topic='Resources' description='Upload updated or newly published textbooks and teachers resources' />
            <AddResource />
          </div>
        </div>
  
      </>
    )
}

import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile,faTrash,faEye,faEdit } from '@fortawesome/free-solid-svg-icons';

export default function SubjectFile({subjects}) {

  const [isOpenDeletePopup,setDeletePopup] = useState(false);
  const [isOpenEditPopup,setEditPopup] = useState(false);

  const openDeletePopup=()=>{
    setDeletePopup(true);
  }
  const closeDeletePopup=()=>{
    setDeletePopup(false);
  }
  const openEditPopup=()=>{
    setEditPopup(true);
  }
  const closeEditPopup=()=>{
    setEditPopup(false);
  }
  const openPdf = () => {
    window.open(subjects.pdf, '_blank');
   
  };
  return (
    <div>
      <div className='rounded-xl shadow-xl w-56 h-80 py-20 hover:scale-95 transition-transform '>
       
        <div className='flex justify-center mb-5 text-black cursor-pointer' onClick={openPdf} ><FontAwesomeIcon icon={faFile} size="3x"/></div>
        <p className='text-3xl text-black text-center h-12'>{subjects.subject}</p>
        
        <div className='flex justify-center text-center mt-10'>  
            <div className='bg-blue p-2 rounded-lg hover:translate-x-1 mx-3'>
                <FontAwesomeIcon icon={faEye}  onClick={openPdf} className='text-xl m-2 text-white cursor-pointer'/>
                <FontAwesomeIcon icon={faEdit} onClick={openEditPopup}  className='text-xl m-2 text-white cursor-pointer' />
                <FontAwesomeIcon icon={faTrash} onClick={openDeletePopup}  className='text-xl m-2 text-white cursor-pointer' />
            </div>  
           
        </div>

      </div>
      {isOpenDeletePopup && (
          <div className="popup-overlay">
            <div className="popup-content">
                <h3 className="text-2xl mb-4">Do you want to delete this textbook ?</h3>
                <div className="flex justify-end space-x-4">
                <button  className="bg-red-500 text-xl text-white px-4 py-2 rounded-md">Yes, Delete</button>
                <button
                    onClick={closeDeletePopup}
                    className="bg-gray-500  text-xl text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                </div>
            
            </div>
          </div>
      )}
      {isOpenEditPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <div className="bg-yellow rounded-full p-3 h-9 w-9 flex justify-items-end cursor-pointer"onClick={closeEditPopup}>
              X
              </div>
              <div className='mx-16'>
                <h3 className="text-4xl mb-4  flex justify-center ">Edit Your Resource</h3>
                <form>
                  <label className='text-3xl my-3'>Subject</label><br></br>
                  <input type="text" className="border border-blue rounded-md px-5 py-3"/>
                  <input type="file" placeholder='Subject' className="my-6 w-full"/>
                  <br></br>
                  <button className='bg-blue rounded-md px-5 py-3 text-2xl  text-white my-10'>Submit</button>
                </form>
              </div>

              
            
            
            </div>
          </div>
      )}
    </div>
  )
}

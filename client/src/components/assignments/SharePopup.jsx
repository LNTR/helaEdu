// SharePopup.js
import React , {useState} from 'react';
import QR from "@assets/img/assignments/QR.png"
import { QRCodeCanvas } from "qrcode.react";

function SharePopup({ closePopup ,assignmentId }) {
    const teachers = [
        { email: 'userd@gmail.com'},
        { email: 'kasun3435@gmail.com'},
        { email: 'wiman436s@gmail.com'},
        { email: 'helor56@gmail.com'},
        
      ];
      const [copied, setCopied] = useState(false);
     
      const baseURL = "https://yourdomain.com/assignment/";
      const assignmentURL = `${baseURL}${assignmentId}`;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(assignmentURL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-10'>
      <div className='bg-white rounded-lg p-6 '>
        <div className='flex justify-between mb-4'>
          <div className='w-1/2 pr-4'>
            

            <div className=' p-2  mb-4'>
                <span className='text-xl '>Assignment Link</span>
                <div className='flex justify-between  mt-7'>
                    <div className='w-10/12 mx-3' >
                        <input
                            type='text'
                            value={assignmentURL}
                            readOnly
                            className='w-full border border-blue p-3 rounded-lg '
                        />
                    </div>
                    <div className='w-2/12'><button onClick={copyToClipboard} className='text-white bg-blue  text-xl px-6 py-3 rounded-lg '>{copied ? "Copied" : "Copy"}</button></div>
                </div>
              
              
            </div>
            <p className='mb-4'>Scan to open in Assignment</p>
            <div className=' flex justify-center' >
              
                <QRCodeCanvas value={assignmentURL} className='w-128' />
            </div>
            
          </div>
          <div className='w-1/2 pl-4'>
            <h2 className='text-3xl mb-4'>Invite students to your assignment</h2>
            <span className='text-xl text-blue '>We'll email them instructions and a link to access this assignemnt</span>
            <br></br>
            <h4>Invite Email</h4>
            <input
              type='email'
              placeholder='Enter email address'
              className='w-full border border-gray-300 rounded-lg p-2 mb-4'
            />
            <button className='bg-blue text-white rounded-lg p-2 w-48 text-xl mb-4'>Send invite</button>
            <div className='space-y-2'>
                    {teachers.map((teacher, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 mb-2 "
                        >
                            <div className="flex items-center">
                                <div className='flex justify-between'>
                                    <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                                        <span className="text-white text-lg">{teacher.email.charAt(0)}</span>
                                    </div>
                                    <div className='mx-4'>
                                        <p className="text-xl text-gray-500">{teacher.email}</p>
                                    </div>

                                </div>
                                <div className='flex-1 mx-4 bg-gray-400 p-2 rounded-lg '>
                                    <p className='text-sm'>Invite Sent</p>
                                </div>

                               
                               
                               
                               
                            </div>
                        </div>
                    ))}
                </div>

            
          </div>
        </div>
        <button className='mt-4 text-white bg-blue p-3 text-xl ' onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SharePopup;

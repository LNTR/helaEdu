import { Footer } from '@components/common';
import Header from '@components/teacher_com/Header';
import React from 'react';
import { Link } from 'react-router-dom';
export default function CreateAssignments() {
  return (
    <div>
      <Header />
      <div className="my-24 mx-32 border border-blue rounded-lg p-8 shadow-lg">
        <div className="flex justify-between mb-6">
          <div className="w-3/5">
            <label className="text-3xl block mb-2 ">Select a Group</label>
            <select className="border border-blue h-16 rounded-lg w-full px-4 text-xl">
              <option className="h-16">11C Mathematics II</option>
              <option className="h-16">11C Mathematics I</option>
              <option className="h-16">11E Mathematics I</option>
              {/* Add other options here */}
            </select>
          </div>
          <div className="flex items-center flex-start">
            <p className="text-2xl">Need a new group</p>
            <span className="text-blue text-2xl ml-2 cursor-pointer">Create a Group</span>
          </div>
        </div>
        <div className="flex justify-between mb-6">
          <div className="w-3/5 mr-8">
            <label className="text-3xl block mb-2 ">Title</label>
            <input placeholder="Enter title" className="border border-blue h-16 rounded-lg w-full px-4 text-xl" />
          </div>
          <div className="w-2/5">
            <label className="text-3xl block mb-2 ">Due Date (Optional)</label>
            <input type="date" className="border border-blue h-16 rounded-lg w-full px-4 text-xl" />
          </div>
        </div>
        <div className="mb-6">
          <label className="text-3xl block mb-2 ">Instructions for student</label>
          <textarea placeholder="Enter instructions" className="border border-blue h-40 rounded-lg w-full px-4 text-xl"></textarea>
        </div>
        <div className="flex justify-between mb-6">
          <div className="w-2/5">
            <label className="text-3xl block mb-2 ">No of Questions</label>
            <input placeholder="Enter number of questions" className="border border-blue h-16 rounded-lg w-full px-4 text-xl" />
          </div>
          <div className="w-2/5">
            <label className="text-3xl block mb-2 ">Total Time</label>
            <input placeholder="Enter total time" className="border border-blue h-16 rounded-lg w-full px-4 text-xl" />
          </div>
          <div className="flex items-end">
            <Link to="/quizFormat">
              <button className="bg-yellow text-white text-2xl px-8 py-4 rounded-lg ml-4">Create Quiz</button>
            </Link>
           
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { Header, Footer } from "@components/common";
import React , {useState,useEffect} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "@services/AssignmentService";

export default function CreateAssignments() {

  const [title,setTitle]=useState("");
  const [instructions,setInstruction]=useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authHeader = useAuthHeader;
  const headers = {
    Authorization: authHeader(),
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleInstruction = (e) => {
    setInstruction(e.target.value);
  };
  const handleHours = (e) => {
    setHours(e.target.value);
  };
  const handleMinutes = (e) => {
    setMinutes(e.target.value);
  };

  const saveAssignment = async (e) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim() || (hours === 0 && minutes === 0)) {

      setError("All the fileds are required.");
      return;
    }
    const formattedTotalTime =(hours*60*60)+(minutes*60) ;
    const assignment = {
      title,
      instructions,
      totalTime: formattedTotalTime,
    };
    console.log(assignment);
    try {
      const response = await createAssignment(assignment, headers);
      // const response = await createAssignment(assignment);
      console.log("Create Assignment Response:", response);
      const assignmentId = response.data;
      navigate(`assignments/quizFormat/${assignmentId}`);

    } catch (error) {
      console.error("Failed to create assignment", error);
      setError("Failed to create assignment");
    }
  };
  return (
    <div>
      <Header />
      <div className="my-24 mx-96  rounded-lg p-8 shadow-xl">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={saveAssignment}>
        <div className=" mb-6">
            
            <div className=" ">
              <label className="text-3xl block mb-2 ">Title</label>
              <input
                placeholder="Enter title"
                className="border border-blue h-16 rounded-lg w-full px-4 text-xl"
                value={title}
                onChange={handleTitle}
                name="title"
                required/>
            </div>
            
          </div>
          <div className="mb-6">
            <label className="text-3xl block mb-2 ">
              Instructions for student
            </label>
            <textarea
              placeholder="Enter instructions"
              className="border border-blue h-40 rounded-lg w-full px-4 py-4 text-xl"
              value={instructions}
                onChange={handleInstruction}
                name="instructions"
                required></textarea>
          </div>
          <div className="flex justify-between mb-6">
          
            <div className="w-4/5">
              <label className="text-3xl block mb-2 ">Total Time</label>
              <div className=" flex justify-start">
                <input type="number" min="0" step="1"  id="hoursInput" placeholder="hours"className="border border-blue h-16 rounded-lg w-40 px-4 text-xl" value={hours} onChange={handleHours} required/>
                <p className="text-3xl mx-6 py-4">:</p>
                <input type="number" min="0" step="1"  max="59" id="minutesInput" placeholder="minutes" className="border border-blue h-16 rounded-lg w-40 px-4 text-xl" value={minutes} onChange={handleMinutes} required/>
              
            </div>

            </div>
            <div className="flex items-end">
              
                <button className="bg-yellow text-white text-2xl px-8 py-4 rounded-lg ml-4" type="submit">
                  Create Quiz
                </button>
              
            </div>
          </div>

              
            </form>
        
        </div>
      <Footer />
    </div>
  );
}

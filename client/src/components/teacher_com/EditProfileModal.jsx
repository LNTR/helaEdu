import React ,{useState} from "react";

const EditProfileModal = ({ isModalOpen, closeModal, handleSubmit, formData, handleInputChange ,addSubject,
  removeSubject}) => {
  const [newSubject, setNewSubject] = useState(""); 

  const handleAddSubject = () => {
    if (newSubject.trim() !== "" && formData.preferredSubjects.length < 3) {
      addSubject(newSubject);
      setNewSubject(""); 
    }
  };
  return (
    <>
      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box max-w-5xl p-14">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-yellow"
              onClick={closeModal}
            >
              ✕
            </button>
            <form onSubmit={handleSubmit}>
              <h3 className="font-bold text-4xl mb-4">Edit Profile</h3>
              <hr className="border-yellow border-t-4 w-1/4 hover:border-white transition duration-300 ease-in-out"></hr>
              <br></br>
              <div className="mb-4">
              <input
                  name="password"
                  type="password"
                  className="w-full rounded-xl p-2 border border-blue focus:border-yellow hidden"
                  value={formData.password}
                  onChange={handleInputChange} 
                disabled/>
                <label className="block text-2xl font-medium mb-2">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xl font-medium mb-2">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xl font-medium mb-2">
                  About You (Brief Introduction about yourself)
                </label>
                <textarea
                  name="about"
                  className="w-full rounded-xl p-2 h-24 border border-blue focus:border-yellow"
                  value={formData.about}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xl font-medium mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                  value={formData.email}
                  onChange={handleInputChange}
                disabled/>
              </div>
              <div className="mb-4">
                <label className="block text-2xl font-medium mb-2">
                  Working Institute / School
                </label>
                <input
                  name="school"
                  type="text"
                  className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                  value={formData.school}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-2xl font-medium mb-2">Your Preferred Subjects</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-blue text-white px-4 py-2 rounded text-2xl"
                    onClick={handleAddSubject}
                    disabled={formData.preferredSubjects.length >= 3}
                  >
                    Add
                  </button>
                </div>
                {formData.preferredSubjects.length >= 3 && (
                  <p className="text-red-500 mt-2">You can only add up to 3 subjects.</p>
                )}
              </div>

              <ul className="mt-4 flex justify-start">
                {formData.preferredSubjects.map((subject, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border-b border-gray2 text-xl"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      className="text-red-500 text-2xl"
                      onClick={() => removeSubject(index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="mt-4 bg-blue text-2xl py-2 px-3 rounded hover:transition-shadow text-center justify-center"
              >
                Submit
              </button>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};

export default EditProfileModal;

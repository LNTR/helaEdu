import React, { useState, useEffect } from 'react';

export default function FormComponent({ onSubmit, onClose, grades,subjects, subjectId }) {
  const [subject, setSubject] = useState(subjects);
  const [grade, setGrade] = useState(grades);
  const [topic, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); 
    const daysUntilNextMonday = (8 - currentDay) % 7 || 7; 
    const nextMonday = new Date(
      currentDate.setDate(currentDate.getDate() + daysUntilNextMonday)
    );

    const formattedDate = nextMonday.toISOString().split('T')[0];
    setIdentifier(formattedDate);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      subjectId,
      subject,
      grade,
      topic,
      identifier, 
    };
    onSubmit(formData);
    onClose();
  };

  const handleAddTopic = () => {
    if (newTopic && topic.length < 10) {
      setTopics([...topic, newTopic]);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = topic.filter((_, i) => i !== index);
    setTopics(updatedTopics);
  };

  return (
    <div className="popup-overlay fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="popup-content bg-white p-6 rounded-lg shadow-lg max-w-md w-full items-center px-20">
        <h3 className="text-4xl my-7 text-center">Create Weekly Quiz</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between my-4">
            <label className="text-2xl">Subject:</label>
            <input
              className="rounded-xl border border-gray-600 w-80 px-3 py-3"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between my-4">
            <label className="text-2xl">Grade:</label>
            <input
              className="rounded-xl border border-gray-600 w-80 px-3 py-3"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-2xl font-medium mb-2">Add Topics</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full rounded-xl p-2 border border-blue focus:border-yellow"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />
              <button
                type="button"
                className="bg-blue text-white px-4 py-2 rounded text-2xl"
                onClick={handleAddTopic}
                disabled={topic.length >= 10}
              >
                Add
              </button>
            </div>
            {topic.length >= 10 && (
              <p className="text-red-500 mt-2">You can only add up to 10 topics.</p>
            )}
          </div>

          <ul className="mt-4 flex justify-start">
            {topic.map((topic, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray2 text-xl"
              >
                <span>{topic}</span>
                <button
                  type="button"
                  className="text-red-500 text-2xl"
                  onClick={() => handleRemoveTopic(index)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue px-3 py-2 rounded-lg text-xl text-white mx-6"
            >
              Generate
            </button>
            <button
              type="button"
              className="bg-red-500 px-3 py-2 rounded-lg text-xl text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

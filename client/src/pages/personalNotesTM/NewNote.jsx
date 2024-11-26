import React, { useState } from 'react';
import { Header } from '@components/common';
import { createNoteByTeacher } from '@services/NotesService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import TextEditor from '@components/articles/TextEditor';
import { useNavigate } from 'react-router-dom';

const NewNote = () => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const authHeader = useAuthHeader();
    const headers = {
        Authorization: authHeader,
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(null);
        // setSuccess(false);
        setLoading(true);

        if (!title || !subject || !content) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const noteData = {
            title,
            subject,
            content,
        };
        try {
            await createNoteByTeacher(noteData, headers);
            setTitle('');
            setSubject('');
            setContent('');
            navigate('/notes');
        } catch (err) {
            console.error("Error creating note:", err);
            alert(error);
            setError(
                err.response?.data?.message || "Failed to save the note. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <form onSubmit={handleSubmit}>
                <div className="mx-64 my-11">
                    <input
                        type="text"
                        placeholder="Add your subject..."
                        className="w-full px-4 py-2 border rounded-md"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className="mx-64 my-11">
                    <input
                        type="text"
                        placeholder="Add your title..."
                        className="w-full px-4 py-2 border rounded-md"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="mx-64 my-11">
                    <TextEditor content={content} setContent={setContent} /> 
                </div>
              
                <div className="flex justify-end mb-24 mx-64">
                    <button
                        type="submit"
                        className={`px-7 py-2 rounded-lg text-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue'}`}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewNote;


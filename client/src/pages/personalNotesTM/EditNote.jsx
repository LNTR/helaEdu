import React, { useState } from "react";
import { Header } from "@components/common";
import { updateNoteByTeacher } from "@services/NotesService"; 
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import TextEditor from "@components/articles/TextEditor";
import { useLocation, useNavigate } from "react-router-dom";

const EditNote = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const authHeader = useAuthHeader();

    const { noteId:initialId,title: initialTitle, subject: initialSubject, content: initialContent } = location.state || {};
    const [id, setId] = useState(initialId || "");
    const [title, setTitle] = useState(initialTitle || "");
    const [subject, setSubject] = useState(initialSubject || "");
    const [content, setContent] = useState(initialContent || "");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const headers = {
        Authorization: authHeader(),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
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
            await updateNoteByTeacher(id,noteData); 
            navigate("/notes"); 
        } catch (err) {
            console.error("Error updating note:", err);
            setError(err.response?.data?.message || "Failed to update the note. Please try again.");
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
                        placeholder="Edit your subject..."
                        className="w-full px-4 py-2 border rounded-md"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className="mx-64 my-11">
                    <input
                        type="text"
                        placeholder="Edit your title..."
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
                        className={`px-7 py-2 rounded-lg text-lg text-white ${loading ? "bg-gray-400" : "bg-blue"}`}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Update Note"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditNote;

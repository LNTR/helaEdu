import React, { useState, useEffect } from 'react';
import { Footer, Header } from '@components/common';
import NoteCard from '@components/notes/NoteCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {getNotesByUserId } from '@services/NotesService';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import NoteView from '@components/notes/NoteView';
import LoadingComponent from '@components/common/LoadingComponent';

const AllNotes = () => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);  
    const authHeader = useAuthHeader();
    const navigate = useNavigate();
    const [loadingState,setLoadingState] = useState(false);

    useEffect(() => {
     
        const fetchNotes = async () => {
            setLoadingState(true);
            try {
                const headers = {
                    Authorization: authHeader,
                };
                const response = await getNotesByUserId(headers);
                console.log("API Response:", response);
                setNotes(response.data || []);
            } catch (err) {
                console.error("Error fetching notes:", err);
                setError("Failed to fetch notes");
            }finally{
                setLoadingState(false);
            }
        };

        fetchNotes(); 
    }, []); 

    const handleIconClick = () => {
        navigate(`./new`);
    };

    const handleCardClick = (note) => {
        setSelectedNote(note); 
        document.getElementById('my_modal_4').showModal();  
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="min-h-screen">
            <Header />
            <div className='px-64 mt-12 h-full w-full min-h-screen'>
                {loadingState && (
                    <LoadingComponent/>
                )}
                <div className='flex justify-between items-center'>
                    <div className='p-10 h-1/5'>
                        <div className='s-topic'>Sticky Notes</div>
                        <div className='n-text'>Stay updated with your own knowledge</div>
                    </div>
                    <button
                        className="py-3 px-10 border-blue bg-blue rounded-2xl n-text text-white gap-8"
                        onClick={handleIconClick}
                    >
                        <p>New Note</p> <FontAwesomeIcon icon={faPlus} size="1x" />
                    </button>
                </div>

                <div className='p-10 h-4/5 w-full grid grid-cols-3'>
                    {(Array.isArray(notes) ? notes : []).map((note, index) => (
                       
                        <NoteCard 
                            key={index} 
                            topic={note.title} 
                            date={note.publishedTimestamp} 
                            subject={note.subject} 
                            content={note.content} 
                            onClick={() => handleCardClick(note)}
                        />
                    ))}
                   
                </div>
            </div>
            <Footer />

            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <button 
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
                        onClick={() => document.getElementById('my_modal_4').close()}
                    >
                        ✕
                    </button>
                    {selectedNote && (
                        <NoteView 
                            noteId={selectedNote.noteId}
                            topic={selectedNote.title} 
                            date={selectedNote.publishedTimestamp} 
                            subject={selectedNote.subject} 
                            content={selectedNote.content} 
                        />
                    )}
                </div>
            </dialog>
        </div>
    );
};

export default AllNotes;

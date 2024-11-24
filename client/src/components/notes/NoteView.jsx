import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import HTMLReactParser from "html-react-parser";
import { useNavigate } from "react-router-dom";

const NoteView = ({ noteId,topic, subject, date, content }) => {
    const navigate = useNavigate();

    const handleEditClick = () => {

        navigate("/notes/edit", { state: { noteId:noteId, title: topic, subject, content } });
    };

    return (
        <div className="p-5">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="s-topic w-full">{topic}</h2>
                    <div>
                        <FontAwesomeIcon
                            icon={faPencil}
                            className="size-8 cursor-pointer"
                            onClick={handleEditClick}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="n-text text-gray1">{subject}</p>
                    <p className="n-text text-gray1">{date}</p>
                </div>
            </div>
            <div>
                <p className="n-text p-10">{HTMLReactParser(content)}</p>
            </div>
        </div>
    );
};

export default NoteView;

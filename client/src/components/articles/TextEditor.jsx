import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

export default function TextEditor({ content, setContent }) {
    const editor = useRef(null);
    
    // const config = {
    //     height: 300, 
    // };

    return (
        <div className='my-7 border border-blue rounded-xl'>
            <JoditEditor
                ref={editor}
                value={content}
                // config={config}
                onChange={newContent => setContent(newContent)}
            />
           
            <style jsx global>{`
                .jodit-status-bar-link {
                    color: white !important;
                }
            `}</style>
        </div>
    );
}

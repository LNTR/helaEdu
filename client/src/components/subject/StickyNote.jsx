import React, { useMemo, useEffect, useState } from "react";
import { viewNote, updateNote } from "@services/SubjectNoteService";
import JoditEditor from "jodit-react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

function StickyNote({ subjectId }) {
  const authHeader = useAuthHeader();
  const headers = {
    Authorization: authHeader,
  };

  const [content, setContent] = useState("");

  useEffect(() => {
    viewNote(subjectId, headers).then((res) => {
      setContent(res.data ? res.data.note_content : "");
    });
  }, [subjectId]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "",
      height: "80vh",
    }),
    []
  );

  return (
    <>
      <JoditEditor
        config={config}
        value={content}
        onChange={(newContent) => setContent(newContent)}
      />
      <div className="flex justify-end my-4 mx-10">
        <button
          type="submit"
          className="bg-blue px-2 py-1 text-lg text-white"
          onClick={async () => {
            await updateNote(subjectId, { content }, headers);
          }}
        >
          Save Note
        </button>
      </div>
    </>
  );
}

export default StickyNote;

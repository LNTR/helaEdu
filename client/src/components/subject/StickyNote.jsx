import React, { useMemo } from "react";

import JoditEditor from "jodit-react";

function StickyNote({subjectId}) {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typings...",
      height: "80vh",
    }),
    []
  );
  return (
    <>
      <JoditEditor config={config} />
      <div className="flex justify-end my-4 mx-10">
        <button type="submit" className="bg-blue px-2 py-1 text-lg text-white">Save Note</button>
      </div>
     
    </>
  );
}

export default StickyNote;

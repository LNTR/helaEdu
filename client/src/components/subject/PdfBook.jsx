import React from "react";

function PdfBook({ subjectId, pdfRef }) {
  return (
    <div className="pdf">
      <p className="flex justify-end p-0 m-0 text-xl">{subjectId}</p>
      {pdfRef ? (
        <object data={pdfRef} type="application/pdf" height="100%" width="100%">
          <param name="src" value={pdfRef} />
        </object>
      ) : (
        <p className="text-center text-red-500">
          No PDF available for this subject.
        </p>
      )}
    </div>
  );
}

export default PdfBook;

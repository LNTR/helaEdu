import React from "react";
import test from '@assets/temp/test.pdf'

function PdfBook({ subject,subjectId, pdfRef }) {  return (
    <div className="pdf">
      
      <p className="flex justify-end p-0 m-0 text-xl">{subject}</p>
      <object data={test} type="application/pdf" height="100%" width="100%">
      <param name="src" value={test} />
    </object>


    </div>
  );
}

export default PdfBook;

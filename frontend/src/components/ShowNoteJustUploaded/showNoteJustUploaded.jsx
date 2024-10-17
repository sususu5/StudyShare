import { useEffect, useState } from 'react';
import './ShowNoteJustUploaded.css'; // Import the CSS for styling

function ShowNoteJustUploaded() {
  const [pdfUrl, setPdfUrl] = useState('');
  useEffect(() => {
    // when the user uploads a note, the server will return a url to the uploaded file
    const uploadedFileUrl = 'http://localhost:5000/' + localStorage.getItem('uploadedFileUrl');
    if (uploadedFileUrl) {
      setPdfUrl(uploadedFileUrl);
    }
  }, []);

  return (
    <div className="show-note-just-uploaded">
      <h2>Note Uploaded Successfully!</h2>
      <p>Your note has been uploaded and is now available.</p>
      {pdfUrl ? (
        <div className="pdf-viewer">
          <iframe src={pdfUrl} width="80%" height="600px" title="PDF Viewer"></iframe>
        </div>
      ) : (
        <p>Loading PDF...</p>
      )}
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
}

export default ShowNoteJustUploaded;

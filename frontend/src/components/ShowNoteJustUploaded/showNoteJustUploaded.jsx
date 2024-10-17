import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './showNoteJustUploaded.css'; // Import the CSS for styling

function ShowNoteJustUploaded() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState('');
  useEffect(() => {
    // when the user uploads a note, the server will return a url to the uploaded file
    //const uploadedFileUrls = JSON.parse(localStorage.getItem('uploadedFileUrls'));
    const uploadedFileUrl = 'http://localhost:5000/' + location.state.uploadedFileUrl;
    if (uploadedFileUrl) {
      setPdfUrl(uploadedFileUrl);
    }
  }, [location.state.uploadedFileUrl]);

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

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './showOneNote.css'; // Import the CSS for styling

function ShowOneNote() {
  const location = useLocation();
  const [pdfUrl, setPdfUrl] = useState('');
  const [noteDetails, setNoteDetails] = useState(null); // State to hold note details

  useEffect(() => {
    const fetchNoteData = async () => {
      const noteId = location.state.noteId;
      console.log("noteId: ", noteId);
      try {
        // get data through api
        const response = await fetch('http://localhost:5000/api/data');
        if (!response.ok) {
          console.error('Failed to fetch data');
          return;
        }
        const result = await response.json();
        console.log("result ", result);
        const note = result.notes.find(n => n.noteId === noteId);
        if (!note) {
          console.error('Note not found');
          return;
        }
        const uploadedFileUrl = 'http://localhost:5000/' + note.filePath;
        if (uploadedFileUrl) {
          setPdfUrl(uploadedFileUrl);
        }
        setNoteDetails(note); // Set the note details
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchNoteData();
  }, [location.state.noteId]);

  return (
    <div className="show-one-note">
      {noteDetails && (
        <div className="note-details">
          <h2>{noteDetails.title}</h2>
          <p>{noteDetails.description}</p>
          <p>Course: {noteDetails.courseCode}</p>
          <p>Tag: {noteDetails.tag}</p>
        </div>
      )}
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

export default ShowOneNote;

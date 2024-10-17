import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadNotePage.css';

function UploadNotePage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [tag, setTag] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert('File size cannot exceed 3MB');
        return;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    if (!courseCode) {
      alert('Please enter the course code');
      return;
    }
    if (!tag) {
      alert('Please enter the tag');
      return;
    }
    if (!title) {
      alert('Please enter the title');
      return;
    }
    if (!description) {
      alert('Please enter the description');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseCode', courseCode);
    formData.append('tag', tag);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const token = localStorage.getItem('authToken'); // Retrieve the token

      const response = await fetch('http://localhost:5173/api/saveNotes', {
        method: 'POST',
        headers: {
          token: token || '', // Use the token or an empty string if not found
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed!!!');
      }

      const result = await response.json();
      console.log('Upload success:', result.newNote);
      // navigate to the page that shows the uploaded note
      //navigate('/showNoteJustUploaded', { state: { uploadedFileUrl: result.filePath } });
      navigate('/showOneNote', { state: { noteId: result.newNote.noteId } });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="upload-note-page">
      <h2 className="title">Upload Your Note</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="file" className="choose-file">Choose File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {fileName && <p className="file-name">Selected file: {fileName}</p>}
        </div>
  
        <div className="form-group">
          <label htmlFor="courseCode">Course Code:</label>
          <input
            type="text"
            id="courseCode"
            placeholder="Enter Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="tag">Tag:</label>
          <input
            type="text"
            id="tag"
            placeholder="Enter Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
  
        <button type="submit" className="submit-button">Upload</button>
      </form>
    </div>
  );
}

export default UploadNotePage;

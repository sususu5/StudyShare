import { useState } from 'react';

function UploadNotePage() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Check file size limit 3MB
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert('File size cannot exceed 3MB');
        return;
      }

      // File size is ok, start reading and converting to base64
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64String = e.target.result;
        console.log('Base64 file: ', base64String);
        
        // Call upload API
        uploadNotes("user-token", "CS101", "Lecture", base64String, "Lecture Notes", "These are the notes for week 1");
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    // Additional logic for handling form submission
  };

  return (
    <div className="upload-note-page">
      <h2>Upload Your Note</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

// Dummy upload function, replace with actual API call
async function uploadNotes(token, courseCode, tag, base64File, title, description) {
  const noteData = {
    token,
    courseCode,
    tag,
    file: base64File, // base64
    title,
    description,
  };

  try {
    const response = await fetch('http://localhost:3000/api/saveNotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    console.log('Upload success:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

export default UploadNotePage;

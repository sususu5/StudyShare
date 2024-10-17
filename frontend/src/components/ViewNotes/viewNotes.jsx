import { useNavigate, useParams } from "react-router-dom";
import './viewNotes.css';

function ViewNotes() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <div className="top-bar">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <header className="notes-header">Notes for {courseCode}</header>
      </div>
    </>
  );
}

export default ViewNotes;
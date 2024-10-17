import { useNavigate } from 'react-router-dom';
import './uploadButton.css';

function UploadButton() {
  const navigate = useNavigate();

  const handleUpload = () => {
    console.log('Upload clicked');
    navigate('/uploadPage');
  }

  return (<button className='upload-button' onClick={handleUpload}>Upload Note</button>);
}

export default UploadButton;
// import { Link } from 'react-router-dom';
// import './uploadButton.css';

// function UploadButton() {
//   return (
//     <Link to="/uploadPage" className="upload-button">
//       Upload Note
//     </Link>
//   );
// }

//export default UploadButton;
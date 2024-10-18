import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout.jsx'
import App from './App.jsx'
import Login from './login.jsx'
import UploadNotePage from './components/UploadNotePage/uploadNotePage.jsx';
import ShowNoteJustUploaded from './components/ShowNoteJustUploaded/showNoteJustUploaded.jsx';
import ViewNotes from './components/ViewNotes/viewNotes';
import ShowOneNote from './components/ShowOneNote/showOneNote';
import './index.css'
import './layout.css'

export default function Main() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="login" element={<Login />} />
            <Route path="/uploadPage" element={<UploadNotePage />} />
            <Route path="/showNoteJustUploaded" element={<ShowNoteJustUploaded />} />
            <Route path="/showOneNote" element={<ShowOneNote />} />
            <Route path='/viewNotes/:courseCode' element={<ViewNotes />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>  
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />)

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import Layout from './components/Layout/layout.jsx';
import Login from './components/Login/login.jsx';
import MyNotePage from './components/MyNotePage/myNotePage.jsx';
import ShowNoteJustUploaded from './components/ShowNoteJustUploaded/showNoteJustUploaded.jsx';
import ShowOneNote from './components/ShowOneNote/showOneNote';
import UploadNotePage from './components/UploadNotePage/uploadNotePage.jsx';
import ViewNotes from './components/ViewNotes/viewNotes';
import './index.css';

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
            <Route path='/myNotePage' element={<MyNotePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />)

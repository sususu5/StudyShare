import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout.jsx'
import App from './App.jsx'
import Login from './login.jsx'
import './index.css'

export default function Main() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>  
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />)

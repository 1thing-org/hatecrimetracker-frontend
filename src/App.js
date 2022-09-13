import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import HomePage from './views/Home'
import IncidentAdminPage from './views/IncidentAdmin'
import './assets/scss/style.scss'

export default function App() {
    return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="admin" element={<IncidentAdminPage />} />
    </Routes>
  </BrowserRouter>
    )
  }

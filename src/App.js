import ReactGA from "react-ga4"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./assets/scss/style.scss"
import HomePage from "./views/Home"
import IncidentAdminPage from "./views/IncidentAdmin"
import IncidentListPage from "./views/IncidentAdminList";
import News from "./views/News";

ReactGA.initialize("UA-241702877-1")
ReactGA.send("pageview")

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<IncidentAdminPage />} />
        <Route path="/admin/selfreport" element={<IncidentListPage />} />
        <Route path="/admin/news" element={<IncidentListPage />} />
      </Routes>
    </BrowserRouter>
  )
}

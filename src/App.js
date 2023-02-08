import ReactGA from "react-ga4"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./assets/scss/style.scss"
import HomePage from "./views/Home"
import IncidentAdminPage from "./views/IncidentAdmin"

ReactGA.initialize("UA-241702877-1")
ReactGA.send("pageview")

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<IncidentAdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}

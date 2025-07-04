import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import { Home } from './routes/home'
import { useEffect } from "react"








function App() {


  useEffect(() => {
    function updateViewportVars() {
      const vh = window.visualViewport?.height || window.innerHeight;
      const vw = window.visualViewport?.width || window.innerWidth;

      document.documentElement.style.setProperty('--app-height', `${vh}px`);
      document.documentElement.style.setProperty('--app-width', `${vw}px`);
    }
    window.addEventListener("resize", () => {
      updateViewportVars()
    })
    updateViewportVars()
  }, [])

  useEffect(() => {

    fetch(import.meta.env.VITE_BACKEND_URL);

  }, [])

  return (
    <div id='app' className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

        </Routes>
      </Router>

    </div>
  )
}

export default App

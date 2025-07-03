import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import { Home } from './routes/home'
import { useEffect } from "react"








function App() {

  useEffect(() => {

    fetch(import.meta.env.VITE_BACKEND_URL);

  }, [])

  return (
    <div id='app' className="app">
      <Router>
        {/* <nav>
        <Link to="/">Home</Link>
      </nav> */}
        <Routes>
          <Route path="/" element={<Home />} />

        </Routes>
      </Router>

    </div>
  )
}

export default App

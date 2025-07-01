import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import './App.css'
import { Home } from './routes/home'







function App() {


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

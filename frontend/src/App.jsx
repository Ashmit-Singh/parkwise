import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import Home from './pages/Home'
import Parks from './pages/Parks'
import Species from './pages/Species'
import Campaigns from './pages/Campaigns'
import Donate from './pages/Donate'
import About from './pages/About'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
        {/* Simple Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <span className="font-bold text-xl text-gray-800">ParkWise</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-green-600">Home</Link>
                <Link to="/parks" className="text-gray-600 hover:text-green-600">Parks</Link>
                <Link to="/species" className="text-gray-600 hover:text-green-600">Species</Link>
                <Link to="/campaigns" className="text-gray-600 hover:text-green-600">Campaigns</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/parks" element={<Parks />} />
          <Route path="/species" element={<Species />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
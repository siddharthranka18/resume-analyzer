import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Upload from './pages/Uploads'
import Results from './pages/Results'
import History from './pages/History'
import Navbar from './components/Navbar'

export default function App() {
  const [analysisData, setAnalysisData] = useState(null)

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Upload setAnalysisData={setAnalysisData} />} />
        <Route path="/results" element={<Results data={analysisData} />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}
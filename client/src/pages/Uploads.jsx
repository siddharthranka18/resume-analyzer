import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Uploads.css'

export default function Upload({ setAnalysisData }) {
  const [file, setFile] = useState(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!file || !jd.trim()) {
      setError('Both resume and job description are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jd)
      const res = await axios.post('/api/analyze/analyze', formData)
      setAnalysisData(res.data)
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-hero">
        <p className="upload-kicker">
          AI POWERED RESUME ANALYSIS
        </p>
        <h1 className="upload-title">
          <span className="upload-title-top">
            HOW WELL DOES YOUR RESUME
          </span>
          <span className="upload-title-main">
            ACTUALLY FIT THE JOB?
          </span>
        </h1>
      </div>

      <div className="upload-grid">
        {/* File Upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const dropped = e.dataTransfer.files[0]
            if (dropped) setFile(dropped)
          }}
          onClick={() => document.getElementById('fileInput').click()}
          className="upload-dropzone"
          style={{
            border: `1px solid ${dragging ? '#C8FF00' : file ? '#00FFD1' : '#2A2A2A'}`,
            background: dragging ? 'rgba(200,255,0,0.03)' : '#141414',
          }}>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="upload-icon" style={{
            border: `1px solid ${file ? '#00FFD1' : '#2A2A2A'}`,
            color: file ? '#00FFD1' : '#F0F0E8'
          }}>
            {file ? '✓' : '↑'}
          </div>
          <div className="upload-drop-text">
            <p className="upload-drop-title" style={{
              color: file ? '#00FFD1' : '#F0F0E8',
            }}>
              {file ? file.name : 'DROP RESUME HERE'}
            </p>
            <p className="upload-drop-meta">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF OR DOCX · MAX 5MB'}
            </p>
          </div>
        </div>

        {/* JD Input */}
        <div className="upload-jd">
          <p className="upload-jd-label">
            JOB_DESCRIPTION.txt
          </p>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="upload-textarea"
            style={{
              border: `1px solid ${jd ? '#C8FF00' : '#2A2A2A'}`,
            }}
          />
          {jd && (
            <p className="upload-charcount">
              {jd.length} chars
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="upload-error">
          ✗ {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="upload-submit"
        style={{
          background: loading ? '#1A1A1A' : '#C8FF00',
          color: loading ? '#666660' : '#0D0D0D',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
        {loading ? 'ANALYZING...' : 'RUN ANALYSIS →'}
      </button>

      {loading && (
        <div className="upload-loading">
          {['PARSING RESUME...', 'EXTRACTING SKILLS...', 'RUNNING AI ANALYSIS...'].map((step, i) => (
            <p key={i} className="upload-loading-step" style={{
              animation: `fadeIn 0.5s ${i * 0.4}s both`
            }}>
              {'>'} {step}
            </p>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  )
}
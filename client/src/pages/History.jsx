import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './History.css'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#C8FF00' : score >= 40 ? '#00FFD1' : '#FF4545'
  return (
    <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '22px', color }}>
      {score}%
    </span>
  )
}

export default function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
  axios.get(`${BASE_URL}/api/analyze/history`)
      .then(res => setAnalyses(res.data.analyses))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="history-loading">
      LOADING HISTORY...
    </div>
  )

  return (
    <div className="history-page">

      <div className="history-header-wrap">
        <div className="history-header">
          <h1 className="history-title">
            HISTORY
          </h1>
          <button onClick={() => navigate('/')} className="history-new-btn">
            + NEW ANALYSIS
          </button>
        </div>
        <p className="history-count">
          {analyses.length} analyses saved
        </p>
      </div>

      {analyses.length === 0 ? (
        <div className="history-empty">
          <p className="history-empty-text">
            NO ANALYSES YET
          </p>
        </div>
      ) : (
        <div className="history-list">
          {analyses.map((item, i) => (
            <div key={item._id} className="history-item" style={{
              border: `1px solid ${expanded === i ? '#C8FF00' : '#2A2A2A'}`,
            }}>
              <div
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="history-item-head">
                <div className="history-item-main">
                  <span className="history-item-index">
                    {String(analyses.length - i).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="history-file-name">
                      {item.filename || 'Unknown File'}
                    </p>
                    <p className="history-file-date">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="history-scores">
                  <div className="history-score-block">
                    <p style={{ fontSize: '9px', color: '#666660', letterSpacing: '2px', marginBottom: '4px' }}>AI</p>
                    <ScoreBadge score={item.aiAnalysis?.matchScore || 0} />
                  </div>
                  <div className="history-score-block">
                    <p style={{ fontSize: '9px', color: '#666660', letterSpacing: '2px', marginBottom: '4px' }}>KEYWORD</p>
                    <ScoreBadge score={item.skillMatch?.matchPercentage || 0} />
                  </div>
                  <span className="history-chevron" style={{
                    color: expanded === i ? '#C8FF00' : '#666660',
                    fontSize: '16px',
                    transform: expanded === i ? 'rotate(180deg)' : 'none',
                  }}>↓</span>
                </div>
              </div>

              {expanded === i && (
                <div className="history-item-details">
                  <div className="history-skills-section">
                    <p style={{ fontSize: '10px', color: '#C8FF00', letterSpacing: '2px', marginBottom: '12px' }}>
                      ✓ MATCHED
                    </p>
                    <div className="history-skills-list">
                      {item.aiAnalysis?.matchedSkills?.map((skill, j) => (
                        <span key={j} className="history-skill-badge history-skill-matched">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="history-skills-section">
                    <p style={{ fontSize: '10px', color: '#FF4545', letterSpacing: '2px', marginBottom: '12px' }}>
                      ✗ MISSING
                    </p>
                    <div className="history-skills-list">
                      {item.aiAnalysis?.missingSkills?.map((skill, j) => (
                        <span key={j} className="history-skill-badge history-skill-missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="history-summary-section">
                    <p style={{ fontSize: '10px', color: '#666660', letterSpacing: '2px', marginBottom: '8px' }}>
                      SUMMARY
                    </p>
                    <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#F0F0E8' }}>
                      {item.aiAnalysis?.summary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
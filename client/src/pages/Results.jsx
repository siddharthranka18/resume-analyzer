import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Results.css'

function ScoreCircle({ score }) {
  const [displayed, setDisplayed] = useState(0)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayed / 100) * circumference
  const color = score >= 70 ? '#C8FF00' : score >= 40 ? '#00FFD1' : '#FF4545'

  useEffect(() => {
    let start = 0
    const timer = setInterval(() => {
      start += 2
      if (start >= score) { setDisplayed(score); clearInterval(timer) }
      else setDisplayed(start)
    }, 20)
    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="results-score-circle">
      <svg viewBox="0 0 160 160" width="100%" height="100%" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#1A1A1A" strokeWidth="8" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke={color}
          strokeWidth="8" strokeDasharray={circumference}
          strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
      </svg>
      <div className="results-score-circle-inner">
        <span className="results-score-value">{displayed}%</span>
        <span className="results-score-label">MATCH</span>
      </div>
    </div>
  )
}

function SkillBadge({ skill, type }) {
  const colors = {
    matched: { bg: 'rgba(200,255,0,0.08)', border: '#C8FF00', color: '#C8FF00', prefix: '✓' },
    missing: { bg: 'rgba(255,69,69,0.08)', border: '#FF4545', color: '#FF4545', prefix: '✗' },
  }
  const style = colors[type]

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '2px',
      color: style.color,
      fontSize: '11px',
      fontFamily: 'DM Mono',
      margin: '4px'
    }}>
      {style.prefix} {skill}
    </span>
  )
}

export default function Results({ data }) {
  const navigate = useNavigate()

  if (!data) return (
    <div className="results-empty">
      <p className="results-empty-text">No analysis data found.</p>
      <button onClick={() => navigate('/')} className="results-primary-btn">← GO BACK</button>
    </div>
  )

  const { aiAnalysis, skillMatch } = data

  return (
    <div className="results-page">

      {/* Header */}
      <div className="results-header">
        <h1 className="results-title">
          YOUR RESULTS
        </h1>
        <button onClick={() => navigate('/')} className="results-secondary-btn">
          ← NEW ANALYSIS
        </button>
      </div>

      {/* Score Row */}
      <div className="results-grid results-grid-3">
        <div className="results-card results-score-card">
          <ScoreCircle score={aiAnalysis.matchScore} />
          <p style={{ fontSize: '10px', color: '#666660', letterSpacing: '2px' }}>AI SCORE</p>
        </div>

        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#666660', letterSpacing: '2px', marginBottom: '16px' }}>
            KEYWORD MATCH
          </p>
          <div style={{
            fontFamily: 'Syne', fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800, color: '#00FFD1', lineHeight: 1
          }}>
            {skillMatch.matchPercentage}%
          </div>
          <div style={{ marginTop: '16px' }}>
            <div style={{ height: '4px', background: '#2A2A2A', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${skillMatch.matchPercentage}%`,
                background: '#00FFD1', borderRadius: '2px', transition: 'width 1s ease'
              }} />
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#666660', marginTop: '12px' }}>
            {skillMatch.matchedSkills.length} of {skillMatch.jdSkills.length} required skills found
          </p>
        </div>

        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#666660', letterSpacing: '2px', marginBottom: '16px' }}>
            SUMMARY
          </p>
          <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#F0F0E8', fontFamily: 'DM Mono' }}>
            {aiAnalysis.summary}
          </p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="results-grid results-grid-2 results-gap-bottom">
        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#C8FF00', letterSpacing: '2px', marginBottom: '16px' }}>
            ✓ MATCHED SKILLS ({aiAnalysis.matchedSkills.length})
          </p>
          <div>
            {aiAnalysis.matchedSkills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} type="matched" />
            ))}
          </div>
        </div>

        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#FF4545', letterSpacing: '2px', marginBottom: '16px' }}>
            ✗ MISSING SKILLS ({aiAnalysis.missingSkills.length})
          </p>
          <div>
            {aiAnalysis.missingSkills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} type="missing" />
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="results-grid results-grid-2">
        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#00FFD1', letterSpacing: '2px', marginBottom: '16px' }}>
            STRENGTHS
          </p>
          {aiAnalysis.strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#00FFD1', fontSize: '12px', marginTop: '2px' }}>→</span>
              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#F0F0E8' }}>{s}</p>
            </div>
          ))}
        </div>

        <div className="results-card">
          <p style={{ fontSize: '10px', color: '#C8FF00', letterSpacing: '2px', marginBottom: '16px' }}>
            IMPROVEMENTS
          </p>
          {aiAnalysis.improvements.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: '#C8FF00', fontSize: '12px', marginTop: '2px' }}>!</span>
              <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#F0F0E8' }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
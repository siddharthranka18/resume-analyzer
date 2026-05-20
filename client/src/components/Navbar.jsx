import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        RESUME<span className="navbar-brand-alt">_ANALYZER</span>
      </div>

      <div className="navbar-links">
        {[
          { path: '/', label: 'ANALYZE' },
          { path: '/history', label: 'HISTORY' }
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`navbar-link ${location.pathname === path ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
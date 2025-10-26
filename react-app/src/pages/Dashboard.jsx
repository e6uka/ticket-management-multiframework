import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { tickets } from '../utils/tickets';
import Footer from '../components/Footer';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, closed: 0 });

  useEffect(() => {
    setStats(tickets.getStats());
  }, []);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="container navbar-content">
          <h2 className="navbar-brand">Ticket Management</h2>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>

      <div className="container dashboard-content">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: '#E0E7FF' }}>📊</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Tickets</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: '#D1FAE5' }}>✓</div>
            <div className="stat-info">
              <h3>{stats.open}</h3>
              <p>Open Tickets</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: '#FEF3C7' }}>⏳</div>
            <div className="stat-info">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon" style={{ backgroundColor: '#F3F4F6' }}>✔</div>
            <div className="stat-info">
              <h3>{stats.closed}</h3>
              <p>Resolved Tickets</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/tickets" className="btn btn-primary">Manage Tickets</Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

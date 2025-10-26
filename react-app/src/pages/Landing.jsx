import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <div className="hero">
        <div className="decorative-circle circle-1"></div>
        <div className="container hero-content">
          <h1>Ticket Management System</h1>
          <p className="hero-description">
            Streamline your workflow with our powerful ticket tracking solution.
            Manage, prioritize, and resolve tickets efficiently.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
        <svg className="wave" viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path fill="#F9FAFB" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>

      <div className="container features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-box card">
            <h3>Easy Tracking</h3>
            <p>Keep track of all your tickets in one centralized location with powerful filtering and search capabilities.</p>
          </div>
          <div className="feature-box card">
            <h3>Real-time Updates</h3>
            <p>Get instant notifications and updates on ticket status changes and team activities.</p>
          </div>
          <div className="feature-box card">
            <h3>Collaborative</h3>
            <p>Work together with your team seamlessly with built-in collaboration tools and assignment features.</p>
          </div>
        </div>
        <div className="decorative-circle circle-2"></div>
      </div>

      <Footer />
    </div>
  );
}

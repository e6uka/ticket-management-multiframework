import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../utils/auth';
import { tickets } from '../utils/tickets';
import Toast from '../components/Toast';
import Footer from '../components/Footer';
import './Tickets.css';

const VALID_STATUSES = ['open', 'in_progress', 'closed'];

export default function Tickets() {
  const navigate = useNavigate();
  const [ticketList, setTicketList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setTicketList(tickets.getAll());
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim() === '') {
      newErrors.title = 'Title is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    } else if (!VALID_STATUSES.includes(formData.status)) {
      newErrors.status = 'Status must be one of: open, in_progress, closed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingTicket) {
      const result = tickets.update(editingTicket.id, formData);
      if (result.success) {
        setToast({ message: 'Ticket updated successfully!', type: 'success' });
        resetForm();
        loadTickets();
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    } else {
      const result = tickets.create(formData);
      if (result.success) {
        setToast({ message: 'Ticket created successfully!', type: 'success' });
        resetForm();
        loadTickets();
      } else {
        setToast({ message: result.error, type: 'error' });
      }
    }
  };

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      title: ticket.title,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority || 'medium'
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = (id) => {
    const result = tickets.delete(id);
    if (result.success) {
      setToast({ message: 'Ticket deleted successfully!', type: 'success' });
      loadTickets();
    } else {
      setToast({ message: result.error, type: 'error' });
    }
    setDeleteConfirm(null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'open',
      priority: 'medium'
    });
    setEditingTicket(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="tickets-page">
      <nav className="navbar">
        <div className="container navbar-content">
          <h2 className="navbar-brand">Ticket Management</h2>
          <div className="navbar-actions">
            <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container tickets-content">
        <div className="tickets-header">
          <h1>Manage Tickets</h1>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              Create New Ticket
            </button>
          )}
        </div>

        {showForm && (
          <div className="ticket-form card">
            <h2>{editingTicket ? 'Edit Ticket' : 'Create New Ticket'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title *</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  aria-label="Ticket title"
                />
                {errors.title && <div className="error-message">{errors.title}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  aria-label="Ticket description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status" className="form-label">Status *</label>
                  <select
                    id="status"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    aria-label="Ticket status"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  {errors.status && <div className="error-message">{errors.status}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="priority" className="form-label">Priority</label>
                  <select
                    id="priority"
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    aria-label="Ticket priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTicket ? 'Update Ticket' : 'Create Ticket'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="tickets-list">
          {ticketList.length === 0 ? (
            <div className="empty-state card">
              <p>No tickets found. Create your first ticket to get started!</p>
            </div>
          ) : (
            ticketList.map(ticket => (
              <div key={ticket.id} className="ticket-card card">
                <div className="ticket-header">
                  <h3>{ticket.title}</h3>
                  <span className={`status-badge status-${ticket.status}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                {ticket.description && <p className="ticket-description">{ticket.description}</p>}
                <div className="ticket-meta">
                  <span className="ticket-priority">Priority: {ticket.priority || 'medium'}</span>
                  <span className="ticket-date">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="ticket-actions">
                  <button onClick={() => handleEdit(ticket)} className="btn btn-secondary">
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(ticket.id)} 
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Footer />
    </div>
  );
}

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { auth } from '../utils/auth';
import { tickets } from '../utils/tickets';
import Toast from '../components/Toast.vue';
import Footer from '../components/Footer.vue';

const VALID_STATUSES = ['open', 'in_progress', 'closed'];

const router = useRouter();
const ticketList = ref([]);
const showForm = ref(false);
const editingTicket = ref(null);
const formData = ref({
  title: '',
  description: '',
  status: 'open',
  priority: 'medium'
});
const errors = ref({});
const toast = ref(null);
const deleteConfirm = ref(null);

onMounted(() => {
  loadTickets();
});

const loadTickets = () => {
  ticketList.value = tickets.getAll();
};

const handleLogout = () => {
  auth.logout();
  router.push('/');
};

const validate = () => {
  const newErrors = {};
  if (!formData.value.title || formData.value.title.trim() === '') {
    newErrors.title = 'Title is required';
  }
  if (!formData.value.status) {
    newErrors.status = 'Status is required';
  } else if (!VALID_STATUSES.includes(formData.value.status)) {
    newErrors.status = 'Status must be one of: open, in_progress, closed';
  }
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  if (editingTicket.value) {
    const result = tickets.update(editingTicket.value.id, formData.value);
    if (result.success) {
      toast.value = { message: 'Ticket updated successfully!', type: 'success' };
      resetForm();
      loadTickets();
    } else {
      toast.value = { message: result.error, type: 'error' };
    }
  } else {
    const result = tickets.create(formData.value);
    if (result.success) {
      toast.value = { message: 'Ticket created successfully!', type: 'success' };
      resetForm();
      loadTickets();
    } else {
      toast.value = { message: result.error, type: 'error' };
    }
  }
};

const handleEdit = (ticket) => {
  editingTicket.value = ticket;
  formData.value = {
    title: ticket.title,
    description: ticket.description || '',
    status: ticket.status,
    priority: ticket.priority || 'medium'
  };
  showForm.value = true;
  errors.value = {};
};

const handleDelete = (id) => {
  const result = tickets.delete(id);
  if (result.success) {
    toast.value = { message: 'Ticket deleted successfully!', type: 'success' };
    loadTickets();
  } else {
    toast.value = { message: result.error, type: 'error' };
  }
  deleteConfirm.value = null;
};

const resetForm = () => {
  formData.value = {
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  };
  editingTicket.value = null;
  showForm.value = false;
  errors.value = {};
};
</script>

<template>
  <div class="tickets-page">
    <nav class="navbar">
      <div class="container navbar-content">
        <h2 class="navbar-brand">Ticket Management</h2>
        <div class="navbar-actions">
          <RouterLink to="/dashboard" class="btn btn-secondary">Dashboard</RouterLink>
          <button @click="handleLogout" class="btn btn-secondary">Logout</button>
        </div>
      </div>
    </nav>

    <div class="container tickets-content">
      <div class="tickets-header">
        <h1>Manage Tickets</h1>
        <button v-if="!showForm" @click="showForm = true" class="btn btn-primary">
          Create New Ticket
        </button>
      </div>

      <div v-if="showForm" class="ticket-form card">
        <h2>{{ editingTicket ? 'Edit Ticket' : 'Create New Ticket' }}</h2>
        <form @submit="handleSubmit">
          <div class="form-group">
            <label for="title" class="form-label">Title *</label>
            <input
              id="title"
              type="text"
              class="form-input"
              v-model="formData.title"
              aria-label="Ticket title"
            />
            <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              class="form-textarea"
              v-model="formData.description"
              aria-label="Ticket description"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status" class="form-label">Status *</label>
              <select
                id="status"
                class="form-select"
                v-model="formData.status"
                aria-label="Ticket status"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              <div v-if="errors.status" class="error-message">{{ errors.status }}</div>
            </div>

            <div class="form-group">
              <label for="priority" class="form-label">Priority</label>
              <select
                id="priority"
                class="form-select"
                v-model="formData.priority"
                aria-label="Ticket priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ editingTicket ? 'Update Ticket' : 'Create Ticket' }}
            </button>
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div class="tickets-list">
        <div v-if="ticketList.length === 0" class="empty-state card">
          <p>No tickets found. Create your first ticket to get started!</p>
        </div>
        <div v-else v-for="ticket in ticketList" :key="ticket.id" class="ticket-card card">
          <div class="ticket-header">
            <h3>{{ ticket.title }}</h3>
            <span :class="['status-badge', `status-${ticket.status}`]">
              {{ ticket.status.replace('_', ' ') }}
            </span>
          </div>
          <p v-if="ticket.description" class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-meta">
            <span class="ticket-priority">Priority: {{ ticket.priority || 'medium' }}</span>
            <span class="ticket-date">
              {{ new Date(ticket.createdAt).toLocaleDateString() }}
            </span>
          </div>
          <div class="ticket-actions">
            <button @click="handleEdit(ticket)" class="btn btn-secondary">
              Edit
            </button>
            <button @click="deleteConfirm = ticket.id" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="deleteConfirm" class="modal-overlay" @click="deleteConfirm = null">
      <div class="modal card" @click.stop>
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="handleDelete(deleteConfirm)" class="btn btn-danger">
            Delete
          </button>
          <button @click="deleteConfirm = null" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <Toast v-if="toast" :message="toast.message" :type="toast.type" @close="toast = null" />

    <Footer />
  </div>
</template>

<style src="../assets/styles/Tickets.css"></style>

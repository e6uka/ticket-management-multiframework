<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { auth } from '../utils/auth';
import { tickets } from '../utils/tickets';
import Footer from '../components/Footer.vue';

const router = useRouter();
const stats = ref({ total: 0, open: 0, inProgress: 0, closed: 0 });

onMounted(() => {
  stats.value = tickets.getStats();
});

const handleLogout = () => {
  auth.logout();
  router.push('/');
};
</script>

<template>
  <div class="dashboard-page">
    <nav class="navbar">
      <div class="container navbar-content">
        <h2 class="navbar-brand">Ticket Management</h2>
        <button @click="handleLogout" class="btn btn-secondary">Logout</button>
      </div>
    </nav>

    <div class="container dashboard-content">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon" style="background-color: #E0E7FF">📊</div>
          <div class="stat-info">
            <h3>{{ stats.total }}</h3>
            <p>Total Tickets</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" style="background-color: #D1FAE5">✓</div>
          <div class="stat-info">
            <h3>{{ stats.open }}</h3>
            <p>Open Tickets</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" style="background-color: #FEF3C7">⏳</div>
          <div class="stat-info">
            <h3>{{ stats.inProgress }}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-icon" style="background-color: #F3F4F6">✔</div>
          <div class="stat-info">
            <h3>{{ stats.closed }}</h3>
            <p>Resolved Tickets</p>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <RouterLink to="/tickets" class="btn btn-primary">Manage Tickets</RouterLink>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style src="../assets/styles/Dashboard.css"></style>

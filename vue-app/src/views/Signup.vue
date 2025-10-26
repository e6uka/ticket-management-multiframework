<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { auth } from '../utils/auth';
import Toast from '../components/Toast.vue';

const router = useRouter();
const formData = ref({ name: '', email: '', password: '' });
const errors = ref({});
const toast = ref(null);

const validate = () => {
  const newErrors = {};
  if (!formData.value.name) {
    newErrors.name = 'Name is required';
  }
  if (!formData.value.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    newErrors.email = 'Email is invalid';
  }
  if (!formData.value.password) {
    newErrors.password = 'Password is required';
  } else if (formData.value.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  const result = await auth.signup(formData.value.email, formData.value.password, formData.value.name);
  if (result.success) {
    toast.value = { message: 'Account created successfully!', type: 'success' };
    setTimeout(() => router.push('/dashboard'), 1000);
  } else {
    toast.value = { message: result.error, type: 'error' };
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-container card">
      <h1>Get Started</h1>
      <p class="auth-subtitle">Create your account</p>
      
      <form @submit="handleSubmit">
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input
            id="name"
            type="text"
            class="form-input"
            v-model="formData.name"
            aria-label="Full name"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            type="email"
            class="form-input"
            v-model="formData.email"
            aria-label="Email address"
          />
          <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            type="password"
            class="form-input"
            v-model="formData.password"
            aria-label="Password"
          />
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>

        <button type="submit" class="btn btn-primary">Sign Up</button>
      </form>

      <p class="auth-link">
        Already have an account? <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>

    <Toast v-if="toast" :message="toast.message" :type="toast.type" @close="toast = null" />
  </div>
</template>

<style src="../assets/styles/Auth.css"></style>

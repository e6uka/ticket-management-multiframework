<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
  message: String,
  type: String
});

const emit = defineEmits(['close']);

let timer;

onMounted(() => {
  timer = setTimeout(() => {
    emit('close');
  }, 3000);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <div :class="['toast', type]">
    {{ message }}
  </div>
</template>

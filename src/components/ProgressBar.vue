<template>
  <div class="progress-container" :style="progressStyles">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
    <span class="progress-text">{{ current }}/{{ total }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  colors: {
    type: Object,
    required: true
  }
})

const progress = computed(() => (props.current / props.total) * 100)

const progressStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground
}))
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  width: 100%;
  max-width: 440px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--card-bg);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: var(--text-secondary);
  min-width: 50px;
  text-align: right;
}
</style>

<template>
  <div class="intro-screen" :style="screenStyles">
    <div class="intro-content">
      <div class="intro-icon">
        <svg v-if="currentScreen.icon === 'welcome'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <svg v-else-if="currentScreen.icon === 'how'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <svg v-else-if="currentScreen.icon === 'swipe'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <path d="M12 18v-6"></path>
          <path d="M9 15l3 3 3-3"></path>
        </svg>
        <svg v-else width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>

      <h1 class="intro-title" v-html="currentScreen.title"></h1>
      <p class="intro-text">{{ currentScreen.text }}</p>

      <div class="intro-dots">
        <span
          v-for="(screen, index) in screens"
          :key="index"
          class="dot"
          :class="{ active: index === currentIndex }"
          @click="goToScreen(index)"
        ></span>
      </div>

      <div class="intro-buttons">
        <button v-if="currentIndex > 0" class="btn-secondary" @click="prev">
          Zurück
        </button>
        <button v-if="currentIndex < screens.length - 1" class="btn-primary" @click="next">
          Weiter
        </button>
        <button v-else class="btn-primary" @click="$emit('done')">
          {{ texts.startButton }}
        </button>
      </div>

      <button class="skip-btn" @click="$emit('done')">
        Überspringen
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  screens: {
    type: Array,
    required: true
  },
  colors: {
    type: Object,
    required: true
  },
  texts: {
    type: Object,
    required: true
  }
})

defineEmits(['done'])

const currentIndex = ref(0)

const currentScreen = computed(() => props.screens[currentIndex.value])

const screenStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--secondary-color': props.colors.secondary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground
}))

function next() {
  if (currentIndex.value < props.screens.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function goToScreen(index) {
  currentIndex.value = index
}
</script>

<style scoped>
.intro-screen {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.intro-content {
  text-align: center;
  max-width: 400px;
}

.intro-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.intro-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f2f2f2;
  margin-bottom: 16px;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.intro-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--card-bg);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--primary-color);
  width: 24px;
  border-radius: 5px;
}

.intro-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: var(--card-bg);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.skip-btn {
  background: none;
  border: #ffa754;
  color: #ffa754;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
}

.skip-btn:hover {
  color: #f2f2f2;
}
</style>

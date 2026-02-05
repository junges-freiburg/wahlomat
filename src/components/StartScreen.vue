<template>
  <div class="start-screen" :style="screenStyles">
    <div class="start-content">
      <div class="logo-container">
        <div class="logo-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
      </div>

      <h1 class="app-title">{{ appTitle }}</h1>
      <p class="app-subtitle">{{ appSubtitle }}</p>

      <div class="instructions">
        <div class="instruction-item">
          <div class="instruction-icon swipe-right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <span>Nach rechts = Zustimmung</span>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon swipe-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <span>Nach links = Ablehnung</span>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon tap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span>Tippen = Neutral</span>
        </div>
      </div>

      <button class="start-btn" @click="$emit('start')">
        {{ texts.startButton }}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      <button v-if="showPartiesButton" class="parties-btn" @click="$emit('show-parties')">
        <span>{{ texts.showPartiesButton }}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="7 7 17 12 7 17"></polyline>
        </svg>
      </button>

      <p class="party-count">{{ partyCount }} Parteien · {{ questionCount }} Thesen</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  appTitle: {
    type: String,
    required: true
  },
  appSubtitle: {
    type: String,
    required: true
  },
  texts: {
    type: Object,
    required: true
  },
  colors: {
    type: Object,
    required: true
  },
  partyCount: {
    type: Number,
    required: true
  },
  questionCount: {
    type: Number,
    required: true
  },
  showPartiesButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['start', 'show-parties'])

const screenStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--secondary-color': props.colors.secondary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--agree-color': props.colors.agree,
  '--disagree-color': props.colors.disagree,
  '--neutral-color': props.colors.neutral,
  '--background': props.colors.background
}))
</script>

<style scoped>
.start-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--text-primary);
}

.start-content {
  text-align: center;
  max-width: 400px;
}

.logo-container {
  margin-bottom: 24px;
}

.logo-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.app-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.instruction-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.instruction-icon.swipe-right {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.instruction-icon.swipe-left {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

.instruction-icon.tap {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.instruction-item span {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.start-btn {
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.start-btn:active {
  transform: translateY(0);
}

.parties-btn {
  width: 100%;
  margin-top: 16px;
  padding: 16px 32px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.4);
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.parties-btn:hover {
  border-color: var(--primary-color);
  background: rgba(99, 102, 241, 0.18);
  transform: translateY(-1px);
}

.parties-btn svg {
  color: var(--text-secondary);
}

.party-count {
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

@media (min-width: 768px) {
  .app-title {
    font-size: 3rem;
  }

  .app-subtitle {
    font-size: 1.2rem;
  }
}
</style>

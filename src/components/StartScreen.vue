<template>
  <div class="start-screen" :style="screenStyles">
    <div class="start-content">
      <div class="brand-signature">
        <span class="brand-by">by</span>
        <img src="/jflogo.svg" alt="Junges Freiburg">
      </div>
        <div class="intro-icon">
          <img src="/logo.svg" alt="Logo" class="intro-logo">
        </div>

      <p class="app-subtitle">{{ appSubtitle }}</p>

      <div class="instructions">
        <div class="instruction-item">
          <div class="instruction-icon swipe-right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <span>Zustimmung</span>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon swipe-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
          <span>Ablehnung</span>
        </div>
        <div class="instruction-item">
          <div class="instruction-icon tap">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <span>Neutral</span>
        </div>
      </div>

      <button class="start-btn" @click="$emit('start')">
        {{ texts.startButton }}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>

      <p class="party-count">{{ partyCount }} Kandidaten · {{ questionCount }} Thesen</p>
    </div>
		<FooterLinks :footer="footer" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FooterLinks from './FooterLinks.vue'

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
	 footer: { type: Object, default: () => ({}) }
})

defineEmits(['start'])

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
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  color: var(--text-primary);
}

.start-content {
  text-align: center;
  max-width: 400px;
}

.brand-by {
  color: #f2f2f2;
  opacity: 0.75;
}
  
.brand-signature {
  position: fixed;
  top: 8px;
  right: 8px;

  display: flex;
  align-items: center;

  font-size: 0.75rem;
  opacity: 0.7;
  backdrop-filter: blur(4px);
  
}
  
.brand-signature img {
  height: 50px;
  width: auto;
}
  
.intro-logo {
  width: 200px;
  height: 160px;
  margin: 0 auto 20px;
  display: block;
  align-items: center;
  justify-content: center;
  color: white;
}

.app-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
  opacity: 0.9;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.instruction-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.instruction-icon {
  width: 38px;
  height: 38px;
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
  border: 1px solid rgba(242, 242, 242, 0.4);
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
  box-shadow: 0 10px 30px rgba(255, 167, 84, 0.3);
}

.start-btn:active {
  transform: translateY(0);
}

.party-count {
  margin-top: 20px;
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .app-title {
    font-size: 1.8rem;
    margin-bottom: 8px;
  }

  .app-subtitle {
    font-size: 0.95rem;
    margin-bottom: 16px;
    opacity: 0.85;
  }

  .legend-item {
    padding: 10px;
    gap: 6px;
  }

  .legend-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
    border-radius: 10px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-icon {
    width: 72px;
    height: 72px;
    padding: 12px;
    border-radius: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-icon svg {
    width: 48px;
    height: 48px;
  }
 } 
@media (min-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }

  .app-subtitle {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }
}
</style>

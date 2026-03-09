<template>
  <div class="intro-screen" :style="screenStyles">
    <div class="intro-content">
      <div class="intro-icon">
        <svg v-if="screen.icon === 'welcome'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>

        <svg v-else-if="screen.icon === 'how'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>

        <svg v-else-if="screen.icon === 'swipe'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

     <h1 class="intro-title">Dein-Freiburg-Match</h1>

<h2 class="intro-subtitle">Disclaimer</h2>

<p class="intro-text">
  Dein-Freiburg-Match ist ein Informationstool, das von Junges Freiburg e.V.
  bereitgestellt wird.
</p>

<p class="intro-text">
  Die Inhalte spiegeln die Perspektive des Vereins wider und erheben keinen
  Anspruch auf vollständige politische Neutralität.
</p>

<p class="intro-text intro-note">
  Als Alternative empfehlen wir den Kommunal-O-Mat der Landeszentrale für
  politische Bildung.
</p>

      <div class="intro-buttons">
        <button class="btn-primary" @click="$emit('done')">
          {{ texts.startButton }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const screen = computed(() => props.screens[0])

const screenStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--secondary-color': props.colors.secondary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground
}))
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
  color: #ffa754;
  margin-bottom: 16px;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.intro-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.btn-primary{
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
  box-shadow: 0 8px 25px rgba(255, 167, 84, 0.3);
}

</style>

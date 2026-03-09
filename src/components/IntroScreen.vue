<template>
  <div class="intro-screen" :style="screenStyles">
    <div class="intro-content">
      <div class="intro-icon">
        <img src="/logo.svg" alt="Logo" class="intro-logo">
      </div>

     <h1 class="intro-title">Dein-Freiburg-Match</h1>

     <h2 class="intro-subtitle">Disclaimer</h2>

     <p class="intro-text">
        Dein-Freiburg-Match ist ein Informationstool, das von Junges Freiburg e.V.
        bereitgestellt wird. <br>
        Die Inhalte spiegeln die Perspektive des Vereins wider und erheben keinen
        Anspruch auf vollständige politische Neutralität. <br><br>
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

.intro-logo {
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
  
  .intro-subtitle {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffa754;
  margin-bottom: 8px;
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

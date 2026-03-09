<template>
  <div class="intro-screen" :style="screenStyles">
    <div class="intro-content">
      <div class="intro-icon">
        <img src="/logo.svg" alt="Logo" class="intro-logo">
      </div>
      
  <p class="intro-tagline">
    Finde heraus, welche Freiburger Parteien am besten zu deinen Positionen passen.
  </p>
      
     <div class="intro-disclaimer">
  <h2 class="intro-subtitle">Disclaimer</h2>
       
  <p class="intro-text">
    Dein-Freiburg-Match ist ein Informationstool, das von Junges Freiburg e.V.
    bereitgestellt wird. Die Inhalte spiegeln die Perspektive des Vereins wider
    und erheben keinen Anspruch auf vollständige politische Neutralität.
  </p>

  <p class="intro-note">
    Alternative: Kommunal-O-Mat der Landeszentrale für politische Bildung.
  </p>
</div>

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
  width: 300px;
  height: 300px;
  margin: 0 auto 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
  
  .intro-tagline {
  font-size: 1rem;
  opacity: 0.7;
  margin-top: 6px;
  margin-bottom: 36px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
}
  
.intro-disclaimer {
  max-width: 460px;
  margin: 28px auto 36px;
  padding: 18px 22px;

  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;

  backdrop-filter: blur(4px);
}
  
.intro-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffa754;
  margin-top: 10px;
  margin-bottom: 0.05px;
}

.intro-text {
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--text-secondary);
  opacity: 0.9;
  margin-bottom: 10px;
}
  
.intro-note {
  font-size: 0.75rem;
  opacity: 0.65;
  margin-top: 8px;
  line-height: 1.5;
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
  margin-top: 12px;
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

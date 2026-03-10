<template>
  <div class="intro-screen" :style="screenStyles">
    <div class="intro-content">
      <div class="brand-signature">
        <span class="brand-by">by</span>
        <img src="/jflogo.svg" alt="Junges Freiburg">
      </div>
      <div class="intro-icon">
        <img src="/logo.svg" alt="Logo" class="intro-logo">
      </div>
      
  <p class="intro-tagline">
    Swipe deinen Oberbürgermeister-Kandidaten <br> für Freiburg.
  </p>
      
     <div class="intro-disclaimer">
  <h2 class="intro-subtitle">Disclaimer</h2>
       
  <p class="intro-text">
    Dein-Freiburg-Match ist ein Informationstool, das von Junges Freiburg e.V.
    bereitgestellt wird. Die Inhalte spiegeln die Perspektive des Vereins wider
    und erheben keinen Anspruch auf vollständige politische Neutralität.
  </p>

  <p class="intro-note">
    Alternative: <a href="https://www.kommunal-o-mat.de/" target="_blank">Kommunal-O-Mat</a> der Landeszentrale für politische Bildung.
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
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 10vh;
}

.intro-content {
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
  
.intro-tagline {
  font-size: 1.05rem;
  opacity: 0.9;
  margin-bottom: 24px;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
  
.intro-disclaimer {
  max-width: 460px;
  margin: 16px auto 20px;
  padding: 22px 24px;

  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);

  backdrop-filter: blur(4px);
}
  
.intro-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffa754;
  margin-bottom: 10px;
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
.intro-note a {
  color: #ffa754;
  text-decoration: underline;
  cursor: pointer;
}
  
.intro-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: 16px;
}

.btn-primary{
  padding: 18px 42px;
  border-radius: 16px;
  font-size: 1.05rem;
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

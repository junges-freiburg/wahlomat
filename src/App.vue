<template>
  <div class="app"
  :class="{ 'has-bottom-ui': screen === 'weighting' }"
  :style="[appStyles, screenStyles]"
>
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <p>Laden...</p>
      </div>

    <div v-else-if="error" class="error">
      <p>Fehler beim Laden der Daten</p>
      <button @click="initialize">Erneut versuchen</button>
    </div>

    <template v-else>
      <IntroScreen
        v-if="screen === 'intro'"
        :screens="config.intro.screens"
        :colors="config.colors"
        :texts="config.texts"
						:footer="config.footer"
        @done="finishIntro"
      />

      <StartScreen
        v-else-if="screen === 'start'"
        :app-title="config.appTitle"
        :app-subtitle="config.appSubtitle"
        :texts="config.texts"
        :colors="config.colors"
        :party-count="parteien.length"
        :question-count="positionen.length"
        :show-parties-button="config.settings.showPartiesBeforeStart"
					  :footer="config.footer"
        @start="startQuiz"
        @show-parties="showParties"
      />

      <div v-else-if="screen === 'quiz'" class="quiz-screen">
        <ProgressBar
          :current="progress.current"
          :total="progress.total"
          :colors="config.colors"
        />

        <div class="card-container">
          <div class="card-stack">
            
          <SwipeCard
            ref="swipeCard"
            :position="currentPosition"
            :current-index="currentIndex"
            :total-cards="positionen.length"
            :colors="config.colors"
            :texts="config.texts"
            :show-explanation="config.settings.showExplanations"
            :enable-swipe="config.settings.enableSwipeGestures"
            :is-weighted="isCurrentPositionWeighted"
            @swipe="handleSwipe"
            @toggle-weight="toggleWeightForCurrent"
          />

        <div class="undo-container">
        <button
    class="undo-btn"
    :class="{ visible: canUndo }"
    @click="undoLast"
      >
          zur vorigen These springen
        </button>
      </div>
    </div>
  </div>

        <ActionButtons
          v-if="hasMorePositions"
          :colors="config.colors"
          :texts="config.texts"
          @agree="handleAgree"
          @disagree="handleDisagree"
          @neutral="handleNeutral"
        />

         </div>
      
      <WeightingScreen
        v-else-if="screen === 'weighting'"
        :answered-positions="answeredPositions"
        :colors="config.colors"
        :texts="config.texts"
        :is-position-weighted="isPositionWeighted"
        :toggle-weight="toggleWeight"
        :footer="config.footer"
        @show-results="showResults"
      />

      <ResultsView
        v-else-if="screen === 'results'"
        :results="results"
        :colors="config.colors"
        :texts="config.texts"
        :share-url="config.shareUrl"
        :hashtags="config.shareHashtags"
        :share-config="config.shareImage"
        :app-title="config.appTitle"
        @restart="restart"
      />

   </template>
    <FooterLinks v-if="config && screen !== 'weighting' && screen !== 'intro' && screen !== 'start'" :footer="config.footer" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { loadConfig, useConfig } from './composables/useConfig'
import { useWahlomat } from './composables/useWahlomat'
import IntroScreen from './components/IntroScreen.vue'
import StartScreen from './components/StartScreen.vue'
import PartiesOverview from './components/PartiesOverview.vue'
import SwipeCard from './components/SwipeCard.vue'
import ActionButtons from './components/ActionButtons.vue'
import ProgressBar from './components/ProgressBar.vue'
import ResultsView from './components/ResultsView.vue'
import WeightingScreen from './components/WeightingScreen.vue'
import FooterLinks from './components/FooterLinks.vue'

const history = ref([])
  
const { config } = useConfig()
const {
  parteien,
  positionen,
  userAnswers,
  currentIndex,
  currentPosition,
  hasMorePositions,
  progress,
  isLoading,
  error,
  loadData,
  answerPosition,
  calculateResults,
  toggleWeight,
  isPositionWeighted,
  reset
} = useWahlomat()

const screenStyles = computed(() => {
  if (!config.value) return {}

  return {
    '--primary-color': config.value.colors.primary,
    '--secondary-color': config.value.colors.secondary,
    '--text-primary': config.value.colors.textPrimary,
    '--text-secondary': config.value.colors.textSecondary,
    '--card-bg': config.value.colors.cardBackground
  }
})
  
const screen = ref('start')
const results = ref([])
const swipeCard = ref(null)
const isCurrentPositionWeighted = computed(() => {
  if (!currentPosition.value) return false
  return isPositionWeighted(currentPosition.value.id)
})

const answeredPositions = computed(() =>
  positionen.value.filter(p => userAnswers.value[p.id] !== undefined)
)

watch(hasMorePositions, (newValue) => {
  if (!newValue && screen.value === 'quiz') {
    showResults()
  }
})
  
const appStyles = computed(() => {
  if (!config.value) return {}
  return {
    '--background': config.value.colors.background,
    background: config.value.colors.background
  }
})

async function initialize() {
  try {
    await Promise.all([loadConfig(), loadData()])
    if (config.value?.settings?.showIntro && config.value?.intro?.enabled) {
      screen.value = 'intro'
    }
  } catch (e) {
    console.error('Initialization error:', e)
  }
}

function finishIntro() {
  screen.value = 'start'
}

function showParties() {
  screen.value = 'parties'
}

function startQuiz() {
  screen.value = 'quiz'
}

function handleSwipe(direction) {
  history.value.push(currentIndex.value)
  answerPosition(direction)
}

const canUndo = computed(() => history.value.length > 0)

function undoLast() {
  const last = history.value.pop()
  if (last !== undefined) {
    const position = positionen.value[last]

    if (position) {
      delete userAnswers.value[position.id]   // 🔥 DAS ist der Fix
    }

    currentIndex.value = last
  }
}

function handleAgree() {
  if (swipeCard.value) {
    history.value.push(currentIndex.value)
    swipeCard.value.swipeRight()
  }
}

function handleDisagree() {
  if (swipeCard.value) {
    history.value.push(currentIndex.value)
    swipeCard.value.swipeLeft()
  }
}

function handleNeutral() {
  history.value.push(currentIndex.value)
  answerPosition(0)
}

function toggleWeightForCurrent() {
  if (!currentPosition.value) return
  toggleWeight(currentPosition.value.id)
}

function showResults() {
  if (config.value?.settings?.showWeightingScreen && screen.value !== 'weighting') {
    screen.value = 'weighting'
    return
  }
  results.value = calculateResults()
  screen.value = 'results'
}

function restart() {
  reset()
  screen.value = 'start'
}

function handleKeydown(e) {
  if (screen.value === 'intro') {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault()
      finishIntro()
    }
    return
  }
  
  if (screen.value === 'start') {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      startQuiz()
    }
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault()
      showParties()
    }
    return
  }

  if (screen.value === 'parties') {
    if (e.key === 'Escape') {
      e.preventDefault()
      screen.value = 'start'
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      startQuiz()
    }
    return
  }

  if (screen.value === 'quiz' && hasMorePositions.value) {
    switch (e.key) {
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault()
        handleAgree()
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault()
        handleDisagree()
        break
      case 'ArrowDown':
      case 'ArrowUp':
      case 's':
      case 'S':
      case ' ':
        e.preventDefault()
        handleNeutral()
        break
    }
  }

  if (screen.value === 'quiz' && !hasMorePositions.value) {
    if (e.key === 'Enter') {
      e.preventDefault()
      showResults()
    }
  }

  if (screen.value === 'weighting') {
    if (e.key === 'Enter') {
      e.preventDefault()
      showResults()
    }
    return
  }

  if (screen.value === 'results') {
    if (e.key === 'Escape' || e.key === 'r' || e.key === 'R') {
      e.preventDefault()
      restart()
    }
  }
}

onMounted(() => {
  initialize()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app > *:not(.footer-links) {
  flex: 1;
}

.loading,
.error {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f8fafc;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error button {
  padding: 12px 24px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.quiz-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: max(30px, env(safe-area-inset-bottom));
  justify-content: space-between;
  overflow: hidden;
  min-height: 0;
}

.card-stack {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}
  
.undo-container {
  position: relative;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  margin-top: 18px;
  height: 24px;
}

.undo-btn {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
  
.undo-btn.visible {
  opacity: 1;
  pointer-events: auto;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.undo-btn:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.08);
}
  
.card-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 0;
}

.no-more-cards {
  text-align: center;
  color: #f8fafc;
}

.no-more-cards h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.has-bottom-ui .footer-links {
  margin-bottom: 120px;
}
  
.show-results-btn {
  padding: 16px 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.show-results-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 167, 84, 0.3);
}

@media (min-width: 768px) {
  .card-container {
    padding: 40px;
  }
}
</style>

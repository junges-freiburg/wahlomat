<template>
  <div class="app" :style="appStyles">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Laden...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>Fehler beim Laden der Daten</p>
      <button @click="initialize">Erneut versuchen</button>
    </div>

    <template v-else>
      <StartScreen
        v-if="screen === 'start'"
        :app-title="config.appTitle"
        :app-subtitle="config.appSubtitle"
        :texts="config.texts"
        :colors="config.colors"
        :party-count="parteien.length"
        :question-count="positionen.length"
        @start="startQuiz"
      />

      <div v-else-if="screen === 'quiz'" class="quiz-screen">
        <ProgressBar
          :current="progress.current"
          :total="progress.total"
          :colors="config.colors"
        />

        <div class="card-container">
          <div v-if="!hasMorePositions" class="no-more-cards">
            <h2>{{ config.texts.noMoreCards }}</h2>
            <button class="show-results-btn" @click="showResults">
              {{ config.texts.showResults }}
            </button>
          </div>

          <SwipeCard
            v-else
            ref="swipeCard"
            :position="currentPosition"
            :current-index="currentIndex"
            :total-cards="positionen.length"
            :colors="config.colors"
            :texts="config.texts"
            :show-explanation="config.settings.showExplanations"
            :enable-swipe="config.settings.enableSwipeGestures"
            @swipe="handleSwipe"
          />
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

      <ResultsView
        v-else-if="screen === 'results'"
        :results="results"
        :colors="config.colors"
        :texts="config.texts"
        @restart="restart"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadConfig, useConfig } from './composables/useConfig'
import { useWahlomat } from './composables/useWahlomat'
import StartScreen from './components/StartScreen.vue'
import SwipeCard from './components/SwipeCard.vue'
import ActionButtons from './components/ActionButtons.vue'
import ProgressBar from './components/ProgressBar.vue'
import ResultsView from './components/ResultsView.vue'

const { config } = useConfig()
const {
  parteien,
  positionen,
  currentIndex,
  currentPosition,
  hasMorePositions,
  progress,
  isLoading,
  error,
  loadData,
  answerPosition,
  calculateResults,
  reset
} = useWahlomat()

const screen = ref('start')
const results = ref([])
const swipeCard = ref(null)

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
  } catch (e) {
    console.error('Initialization error:', e)
  }
}

function startQuiz() {
  screen.value = 'quiz'
}

function handleSwipe(direction) {
  answerPosition(direction)
}

function handleAgree() {
  if (swipeCard.value) {
    swipeCard.value.swipeRight()
  }
}

function handleDisagree() {
  if (swipeCard.value) {
    swipeCard.value.swipeLeft()
  }
}

function handleNeutral() {
  answerPosition(0)
}

function showResults() {
  results.value = calculateResults()
  screen.value = 'results'
}

function restart() {
  reset()
  screen.value = 'start'
}

function handleKeydown(e) {
  if (screen.value === 'start') {
    if (e.key === 'Enter' || e.key === ' ') {
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
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
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
  padding-bottom: env(safe-area-inset-bottom);
}

.card-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  position: relative;
}

.no-more-cards {
  text-align: center;
  color: #f8fafc;
}

.no-more-cards h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.show-results-btn {
  padding: 16px 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
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
}

@media (min-width: 768px) {
  .card-container {
    padding: 40px;
  }
}
</style>

<template>
  <div class="results-view" :style="viewStyles">
    <header class="results-header">
      <h1>{{ texts.resultsTitle }}</h1>
      <p>{{ texts.resultsSubtitle }}</p>
    </header>

    <div class="results-list">
      <div
        v-for="result in sortedResults"
        :key="result.partei.id"
        class="result-item"
        @click="toggleDetails(result.partei.id)"
      >
        <div class="result-main">
          <div class="party-info">
            <div class="party-badge" :style="{ background: result.partei.farbe }">
              {{ result.partei.kurzname }}
            </div>
            <span class="party-name">{{ result.partei.name }}</span>
          </div>
          <div class="match-info">
            <span class="match-percentage">{{ Math.round(result.percentage) }}%</span>
            <span class="match-label">{{ texts.matchLabel }}</span>
          </div>
        </div>
        <div class="match-bar">
          <div
            class="match-fill"
            :style="{
              width: `${result.percentage}%`,
              background: result.partei.farbe
            }"
          ></div>
        </div>

        <Transition name="expand">
          <div v-if="expandedParty === result.partei.id" class="result-details">
            <div class="detail-header">
              <span class="detail-stat agree">{{ result.agrees }} Zustimmungen</span>
              <span class="detail-stat neutral">{{ result.neutrals }} Neutral</span>
              <span class="detail-stat disagree">{{ result.disagrees }} Ablehnungen</span>
            </div>
            <div class="position-list">
              <div
                v-for="pos in result.positions"
                :key="pos.id"
                class="position-item"
                :class="getMatchClass(pos)"
              >
                <div class="position-header">
                  <span class="position-these">{{ pos.these }}</span>
                  <div class="position-comparison">
                    <span class="user-answer" :class="getAnswerClass(pos.userAnswer)">
                      Du: {{ getAnswerText(pos.userAnswer) }}
                    </span>
                    <span class="party-answer" :class="getAnswerClass(pos.partyAnswer)">
                      {{ result.partei.kurzname }}: {{ getAnswerText(pos.partyAnswer) }}
                    </span>
                  </div>
                </div>
                <p v-if="pos.partyExplanation" class="party-explanation">
                  {{ texts.partyPositionLabel }}: {{ pos.partyExplanation }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <button class="restart-btn" @click="$emit('restart')">
      {{ texts.restartButton }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  results: {
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

defineEmits(['restart'])

const expandedParty = ref(null)

const sortedResults = computed(() =>
  [...props.results].sort((a, b) => b.percentage - a.percentage)
)

const viewStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground,
  '--background': props.colors.background,
  '--agree-color': props.colors.agree,
  '--disagree-color': props.colors.disagree,
  '--neutral-color': props.colors.neutral
}))

function toggleDetails(partyId) {
  expandedParty.value = expandedParty.value === partyId ? null : partyId
}

function getMatchClass(pos) {
  if (pos.userAnswer === pos.partyAnswer) return 'match'
  if (pos.userAnswer === 0 || pos.partyAnswer === 0) return 'partial'
  return 'mismatch'
}

function getAnswerClass(answer) {
  if (answer === 1) return 'agree'
  if (answer === -1) return 'disagree'
  return 'neutral'
}

function getAnswerText(answer) {
  if (answer === 1) return 'Ja'
  if (answer === -1) return 'Nein'
  return 'Neutral'
}
</script>

<style scoped>
.results-view {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  color: var(--text-primary);
}

.results-header {
  text-align: center;
  margin-bottom: 30px;
}

.results-header h1 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.results-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.result-item {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.result-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.party-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.party-badge {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
}

.party-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.match-info {
  text-align: right;
}

.match-percentage {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.match-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.match-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.match-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.result-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.detail-stat {
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
}

.detail-stat.agree {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.detail-stat.neutral {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.detail-stat.disagree {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

.position-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.position-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid transparent;
}

.position-item.match {
  border-left-color: var(--agree-color);
}

.position-item.partial {
  border-left-color: var(--neutral-color);
}

.position-item.mismatch {
  border-left-color: var(--disagree-color);
}

.position-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.position-these {
  font-size: 14px;
  line-height: 1.4;
}

.position-comparison {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.user-answer,
.party-answer {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.user-answer.agree,
.party-answer.agree {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.user-answer.neutral,
.party-answer.neutral {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.user-answer.disagree,
.party-answer.disagree {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

.party-explanation {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 8px;
  font-style: italic;
}

.restart-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.restart-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

@media (min-width: 768px) {
  .results-view {
    padding: 40px;
  }

  .results-header h1 {
    font-size: 2.2rem;
  }

  .party-name {
    font-size: 1.1rem;
  }

  .match-percentage {
    font-size: 1.8rem;
  }
}
</style>

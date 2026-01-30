<template>
  <div class="results-view" :style="viewStyles">
    <header class="results-header">
      <h1>{{ texts.resultsTitle }}</h1>
      <p>{{ texts.resultsSubtitle }}</p>
    </header>

    <div v-if="topResult" class="top-result">
      <div class="top-avatar" :style="{ borderColor: topResult.partei.farbe }">
        <img
          v-if="topResult.partei.logo"
          class="top-photo"
          :src="topResult.partei.logo"
          :alt="`${topResult.partei.name} Logo`"
          loading="lazy"
        />
        <div v-else class="top-badge" :style="{ background: topResult.partei.farbe }">
          {{ topResult.partei.kurzname }}
        </div>
      </div>
      <div class="top-info">
        <span class="top-label">Dein Top-Match</span>
        <span class="top-name">{{ topResult.partei.name }}</span>
        <span class="top-percentage">{{ Math.round(topResult.percentage) }}% Übereinstimmung</span>
      </div>
    </div>

    <div class="results-list">
      <div
        v-for="result in sortedResults"
        :key="result.partei.id"
        class="result-item"
        @click="toggleDetails(result.partei.id)"
      >
        <div class="result-main">
          <div class="party-info">
            <div class="party-identity" :style="{ borderColor: result.partei.farbe }">
              <img
                v-if="result.partei.logo"
                class="result-photo"
                :src="result.partei.logo"
                :alt="`${result.partei.name} Logo`"
                loading="lazy"
              />
              <div v-else class="party-badge" :style="{ background: result.partei.farbe }">
                {{ result.partei.kurzname }}
              </div>
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
                :class="[getMatchClass(pos), { weighted: isWeightedPosition(pos) }]"
              >
                <div class="position-header">
                  <span class="position-these">{{ pos.these }}</span>
                  <span v-if="isWeightedPosition(pos)" class="weight-chip">x2</span>
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
            <div v-if="getWeightedPositions(result.positions).length" class="weighted-summary">
              <p class="weighted-title">
                {{ texts.weightedSummaryTitle || 'Doppelt gewichtete Thesen' }}
              </p>
              <ul class="weighted-list">
                <li
                  v-for="weighted in getWeightedPositions(result.positions)"
                  :key="weighted.id"
                  class="weighted-item"
                >
                  <span class="weighted-dot"></span>
                  <span class="weighted-these">{{ weighted.these }}</span>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <ShareButtons
      v-if="shareUrl"
      :share-url="shareUrl"
      :share-text="texts.shareText"
      :hashtags="hashtags"
      :top-result="topResult"
      :colors="colors"
      :texts="texts"
    />

    <button class="restart-btn" @click="$emit('restart')">
      {{ texts.restartButton }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ShareButtons from './ShareButtons.vue'

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
  },
  shareUrl: {
    type: String,
    default: ''
  },
  hashtags: {
    type: String,
    default: ''
  }
})

defineEmits(['restart'])

const expandedParty = ref(null)

const sortedResults = computed(() =>
  [...props.results].sort((a, b) => b.percentage - a.percentage)
)

const topResult = computed(() => sortedResults.value[0] || null)

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

function isWeightedPosition(pos) {
  return Number(pos?.weight) > 1
}

function getWeightedPositions(positions = []) {
  return positions.filter(isWeightedPosition)
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

.top-result {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--card-bg);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 2px solid var(--primary-color);
}

.top-avatar {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  border: 1px solid var(--primary-color);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  flex-shrink: 0;
  overflow: hidden;
}

.top-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  display: block;
}

.top-badge {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.top-avatar .top-badge {
  width: 100%;
  height: 100%;
  border-radius: 18px;
}

.top-info {
  display: flex;
  flex-direction: column;
}

.top-label {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.top-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.top-percentage {
  font-size: 14px;
  color: var(--text-secondary);
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

.party-identity {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.party-identity .party-badge {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.result-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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

.weighted-summary {
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.weighted-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.weighted-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}

.weighted-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-primary);
  background: rgba(99, 102, 241, 0.18);
  border: 1px solid rgba(99, 102, 241, 0.35);
  border-radius: 10px;
  padding: 10px 12px;
}

.weighted-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-primary);
  flex-shrink: 0;
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

.position-item.weighted {
  background: rgba(99, 102, 241, 0.15);
  border-left-color: var(--primary-color);
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.25);
}

.position-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.weight-chip {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 2px 8px;
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

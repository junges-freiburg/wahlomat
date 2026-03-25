<template>
  <div class="results-view" :style="viewStyles">


      <div class="brand-signature">
        <span class="brand-by">by</span>
        <img src="/jflogo.svg" alt="Junges Freiburg">
      </div>
      <div class="intro-icon">
        <img src="/logo.svg" alt="Logo" class="intro-logo">
      </div>

    <header class="results-header">
      <h1>{{ texts.resultsTitle }}</h1>
      <p>{{ texts.resultsSubtitle }}</p>
    </header>

    <!-- Tab-Switcher -->
    <div class="view-tabs">
      <button
        class="tab-btn"
        :class="{ active: activeView === 'candidates' }"
        @click="activeView = 'candidates'"
      >
        Nach Kandidaten
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeView === 'topics' }"
        @click="activeView = 'topics'"
      >
        Nach Thesen
      </button>
    </div>

    <!-- Ansicht: Nach Kandidaten (bestehend) -->
    <template v-if="activeView === 'candidates'">
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
              :style="{ width: `${result.percentage}%`, background: result.partei.farbe }"
            ></div>
          </div>

          <Transition name="expand">
            <div v-if="expandedParty === result.partei.id" class="result-details">
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
                    <span class="explanation-label">💬 Begründung des Kandidaten</span>
                    „{{ pos.partyExplanation }}"
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
    </template>

    <!-- Ansicht: Nach Thesen -->
    <template v-else>
      <div class="topics-list">
        <div
          v-for="topic in topicsView"
          :key="topic.id"
          class="topic-item"
        >
          <div class="topic-header" @click="toggleTopic(topic.id)">
            <span class="topic-these">
              <span v-if="topic.weighted" class="weight-chip">x2</span>
              {{ topic.these }}
            </span>
            <span class="topic-arrow" :class="{ open: expandedTopic === topic.id }">▾</span>
          </div>

          <div class="topic-user-answer">
            Deine Antwort:
            <span :class="getAnswerClass(topic.userAnswer)">
              {{ getAnswerText(topic.userAnswer) }}
            </span>
          </div>

          <Transition name="expand">
            <div v-if="expandedTopic === topic.id" class="topic-candidates">
              <div
                v-for="candidate in topic.candidates"
                :key="candidate.parteiId"
                class="topic-candidate-item"
                :class="getMatchClass({ userAnswer: topic.userAnswer, partyAnswer: candidate.partyAnswer })"
              >
                <div class="topic-candidate-info">
                  <div class="topic-candidate-avatar">
                    <img
                      v-if="candidate.logo"
                      :src="candidate.logo"
                      :alt="candidate.name"
                      class="topic-candidate-photo"
                    />
                    <div v-else class="topic-candidate-badge" :style="{ background: candidate.farbe }">
                      {{ candidate.kurzname }}
                    </div>
                  </div>
                  <span class="topic-candidate-name">{{ candidate.name }}</span>
                  <span class="topic-candidate-answer" :class="getAnswerClass(candidate.partyAnswer)">
                    {{ getAnswerText(candidate.partyAnswer) }}
                  </span>
                </div>
                <p v-if="candidate.explanation" class="party-explanation">
                  <span class="explanation-label">💬 Begründung</span>
                  „{{ candidate.explanation }}"
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <ShareButtons
      v-if="shareUrl"
      :share-url="shareUrl"
      :share-text="texts.shareText"
      :hashtags="hashtags"
      :top-result="topResult"
      :colors="colors"
      :texts="texts"
      :share-config="shareConfig"
      :app-title="appTitle"
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
  results: { type: Array, required: true },
  colors: { type: Object, required: true },
  texts: { type: Object, required: true },
  shareUrl: { type: String, default: '' },
  hashtags: { type: String, default: '' },
  shareConfig: { type: Object, default: () => ({}) },
  appTitle: { type: String, default: '' }
})

defineEmits(['restart'])

const activeView = ref('candidates')
const expandedParty = ref(null)
const expandedTopic = ref(null)

const sortedResults = computed(() =>
  [...props.results].sort((a, b) => b.percentage - a.percentage)
)

const topResult = computed(() => sortedResults.value[0] || null)

// Thesen-Ansicht aufbauen
const topicsView = computed(() => {
  if (!props.results.length) return []
  const firstResult = props.results[0]
  return firstResult.positions.map(pos => ({
    id: pos.id,
    these: pos.these,
    userAnswer: pos.userAnswer,
    weighted: Number(pos.weight) > 1,
    candidates: props.results.map(result => {
      const p = result.positions.find(p => p.id === pos.id)
      return {
        parteiId: result.partei.id,
        name: result.partei.name,
        kurzname: result.partei.kurzname,
        farbe: result.partei.farbe,
        logo: result.partei.logo,
        partyAnswer: p?.partyAnswer,
        explanation: p?.partyExplanation
      }
    })
  }))
})

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

function toggleTopic(topicId) {
  expandedTopic.value = expandedTopic.value === topicId ? null : topicId
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
  margin: 0 auto;
  padding: 10px 10px 50px 10px;
  min-height: 100vh;
  color: var(--text-primary);
}

.results-header,
.top-result,
.results-list,
.topics-list,
.restart-btn {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.results-header {
  text-align: center;
  margin-bottom: 16px;
}

.results-header h1 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.results-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* Tab-Switcher */
.view-tabs {
  display: flex;
  gap: 8px;
  max-width: 400px;
  margin: 0 auto 24px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: linear-gradient(135deg, #ff953e, #ffaa33);
  color: rgba(0, 0, 0, 0.85);
  border-color: transparent;
}

/* Top Result */
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

/* Kandidaten-Ansicht */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}

.result-item {
  background: linear-gradient(135deg, #ff953e, #ffaa33);
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
  color: rgba(0, 0, 0, 0.9);
}

.match-info {
  text-align: right;
}

.match-percentage {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
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

.position-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.position-item {
  padding: 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-left: 3px solid transparent;
}

.position-item.match { border-left-color: var(--agree-color); }
.position-item.partial { border-left-color: var(--neutral-color); }
.position-item.mismatch { border-left-color: var(--disagree-color); }

.position-item.weighted {
  background: rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 12px rgba(180, 80, 0, 0.5);
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
  color: rgba(180, 80, 0, 0.8);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 2px 8px;
}

.position-these {
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.9);
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

.user-answer.agree, .party-answer.agree {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.user-answer.neutral, .party-answer.neutral {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.user-answer.disagree, .party-answer.disagree {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

.party-explanation {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  margin-top: 8px;
  font-style: normal;
  background: rgba(255, 255, 255, 0.35);
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: 6px;
}

.explanation-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

/* Thesen-Ansicht */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}

.topic-item {
  background: linear-gradient(135deg, #ff953e, #ffaa33);
  border-radius: 16px;
  padding: 16px;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.topic-these {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.4;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.topic-arrow {
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.topic-arrow.open {
  transform: rotate(180deg);
}

.topic-user-answer {
  font-size: 0.78rem;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 8px;
}

.topic-user-answer span {
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.topic-user-answer span.agree {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.topic-user-answer span.neutral {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.topic-user-answer span.disagree {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

.topic-candidates {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.topic-candidate-item {
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.15);
  border-left: 3px solid transparent;
}

.topic-candidate-item.match { border-left-color: var(--agree-color); }
.topic-candidate-item.partial { border-left-color: var(--neutral-color); }
.topic-candidate-item.mismatch { border-left-color: var(--disagree-color); }

.topic-candidate-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.topic-candidate-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.topic-candidate-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.topic-candidate-badge {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  color: white;
  border-radius: 10px;
}

.topic-candidate-name {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
}

.topic-candidate-answer {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.topic-candidate-answer.agree {
  background: rgba(34, 197, 94, 0.2);
  color: var(--agree-color);
}

.topic-candidate-answer.neutral {
  background: rgba(245, 158, 11, 0.2);
  color: var(--neutral-color);
}

.topic-candidate-answer.disagree {
  background: rgba(239, 68, 68, 0.2);
  color: var(--disagree-color);
}

/* Weighted Summary */
.weighted-summary {
  margin-top: 24px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.weighted-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.8);
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
  color: rgba(0, 0, 0, 0.8);
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 10px 12px;
}

.weighted-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
}

/* Restart */
.restart-btn {
  width: 100%;
  max-width: 400px;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.restart-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Transitions */
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
  max-height: 2000px;
}

.brand-by {
  color: #f2f2f2;
  opacity: 0.75;
}
  
.brand-signature {
  position: absolute;
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
  margin: 0 auto 8px;
  display: block;
  align-items: center;
  justify-content: center;
  color: white;
}

@media (min-width: 768px) {
  .results-view { padding: 40px; }
  .results-header h1 { font-size: 2.2rem; }
  .party-name { font-size: 1.1rem; }
  .match-percentage { font-size: 1.8rem; }
}
</style>
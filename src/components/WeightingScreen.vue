<template>
  <div class="weighting-screen">
    <div class="content">
    <div class="header">
      <h1>{{ texts.weightingScreenTitle || 'Doppelt gewichten' }}</h1>
      <p class="subtitle">{{ texts.weightingScreenSubtitle || 'Welche Thesen sind dir besonders wichtig?' }}</p>
    </div>

    <div class="positions-list">
      <div
        v-for="position in answeredPositions"
        :key="position.id"
        class="position-item"
        :class="{ weighted: isPositionWeighted(position.id) }"
      >
        <span class="position-these">{{ position.these }}</span>
        <button
          class="weight-btn"
          :class="{ active: isPositionWeighted(position.id) }"
          @click="toggleWeight(position.id)"
          :style="isPositionWeighted(position.id) ? { background: colors.primary, color: '#fff' } : {}"
        >
          <span class="weight-icon">×2</span>
          <span class="weight-label">{{ isPositionWeighted(position.id)
            ? (texts.weightToggleActiveLabel || 'Doppelt gewichtet')
            : (texts.weightToggleLabel || 'Doppelt gewichten') }}</span>
        </button>
      </div>
    </div>
</div>
    
    <div class="actions">
      <div class="actions-inner">
      <button class="results-btn" @click="$emit('show-results')" :style="{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }">
        {{ texts.showResults || 'Ergebnisse anzeigen' }}
      </button>
    </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  answeredPositions: { type: Array, required: true },
  colors: { type: Object, required: true },
  texts: { type: Object, required: true },
  isPositionWeighted: { type: Function, required: true },
  toggleWeight: { type: Function, required: true }
})

defineEmits(['show-results'])
</script>

<style scoped>
.weighting-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  color: var(--text-secondary);
  min-height: 0;
}

.content {
  width: 100%;
  max-width: 400px;   
  margin: 0 auto;     
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 120px;
}
  
.header {
  padding: 20px 20px 12px;
  text-align: center;
  flex-shrink: 0;
}

.header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.75;
}

.positions-list {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.position-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  padding: 10px 14px;
  transition: background 0.2s;
}

.position-item.weighted {
  background: rgba(255, 255, 255, 0.12);
}

.position-these {
  flex: 1;
  font-size: 0.85rem;
  line-height: 1.4;
}

.weight-btn {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 72px;
}

.weight-btn.active {
  border-color: transparent;
}

.weight-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.weight-icon {
  font-size: 0.95rem;
  font-weight: 700;
}

.weight-label {
  font-size: 0.65rem;
  white-space: nowrap;
}

.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: var(--background);
  padding: 16px;
  z-index: 100;
}

.actions-inner {
  width: 100%;
  max-width: 400px;

  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 12px;
}
  
.results-btn {
  width: 100%;
  max-width: 400px;
  padding: 16px;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.results-btn:hover {
  transform: translateY(-2px);
}
</style>

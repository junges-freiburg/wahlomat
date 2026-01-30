<template>
  <div class="parties-overview" :style="viewStyles">
    <header class="parties-header">
      <button class="back-btn" @click="$emit('back')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        {{ texts.backButton }}
      </button>
      <h1>{{ texts.partiesTitle }}</h1>
      <p>{{ texts.partiesSubtitle }}</p>
    </header>

    <div class="parties-list">
      <div
        v-for="partei in parteien"
        :key="partei.id"
        class="party-card"
        :style="{ '--party-color': partei.farbe }"
      >
        <div class="party-header">
          <div class="party-avatar" :style="{ borderColor: partei.farbe }">
            <img
              v-if="partei.logo"
              class="party-photo"
              :src="partei.logo"
              :alt="`${partei.name} Logo`"
              loading="lazy"
            />
            <div v-else class="party-badge" :style="{ background: partei.farbe }">
              {{ partei.kurzname }}
            </div>
          </div>
          <div class="party-info">
            <h2>{{ partei.name }}</h2>
            <span class="party-short">{{ partei.kurzname }}</span>
          </div>
        </div>
        <p v-if="partei.beschreibung" class="party-description">
          {{ partei.beschreibung }}
        </p>
      </div>
    </div>

    <div class="parties-footer">
      <button class="start-btn" @click="$emit('start')">
        {{ texts.startButton }}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  parteien: {
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

defineEmits(['back', 'start'])

const viewStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--secondary-color': props.colors.secondary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground,
  '--background': props.colors.background
}))
</script>

<style scoped>
.parties-overview {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 20px;
  color: var(--text-primary);
}

.parties-header {
  text-align: center;
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--card-bg);
  color: var(--text-primary);
}

.parties-header h1 {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.parties-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.parties-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto 100px;
}

.party-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  border-left: 4px solid var(--party-color);
  transition: transform 0.2s ease;
}

.party-card:hover {
  transform: translateX(4px);
}

.party-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.party-avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  border: 1px solid var(--party-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  flex-shrink: 0;
}

.party-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
}

.party-badge {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
  flex-shrink: 0;
}

.party-info h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.party-short {
  font-size: 13px;
  color: var(--text-secondary);
}

.party-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.parties-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, var(--background) 30%);
  display: flex;
  justify-content: center;
}

.start-btn {
  padding: 16px 40px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.3);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
}

@media (min-width: 768px) {
  .parties-overview {
    padding: 40px;
  }

  .parties-header h1 {
    font-size: 2.2rem;
  }

  .party-card {
    padding: 24px;
  }
}
</style>

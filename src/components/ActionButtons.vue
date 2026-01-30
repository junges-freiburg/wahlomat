<template>
  <div class="action-buttons-wrapper" :style="buttonStyles">
    <div class="action-buttons">
      <button class="action-btn disagree" @click="$emit('disagree')" :title="texts.disagreeButton">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="key-hint">← A</span>
      </button>

      <button class="action-btn neutral" @click="$emit('neutral')" :title="texts.neutralButton">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span class="key-hint">↓ S</span>
      </button>

      <button class="action-btn agree" @click="$emit('agree')" :title="texts.agreeButton">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span class="key-hint">→ D</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  colors: {
    type: Object,
    required: true
  },
  texts: {
    type: Object,
    required: true
  }
})

defineEmits(['agree', 'disagree', 'neutral'])

const buttonStyles = computed(() => ({
  '--agree-color': props.colors.agree,
  '--disagree-color': props.colors.disagree,
  '--neutral-color': props.colors.neutral
}))
</script>

<style scoped>
.action-buttons-wrapper {
  padding: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
}

.action-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.disagree {
  background: var(--disagree-color);
  color: white;
}

.action-btn.neutral {
  background: var(--neutral-color);
  color: white;
  width: 56px;
  height: 56px;
}

.action-btn.agree {
  background: var(--agree-color);
  color: white;
}

.key-hint {
  display: none;
  position: absolute;
  bottom: -24px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

@media (min-width: 768px) {
  .action-btn {
    width: 72px;
    height: 72px;
  }

  .action-btn.neutral {
    width: 64px;
    height: 64px;
  }

  .action-buttons {
    gap: 30px;
  }

  .key-hint {
    display: block;
  }
}
</style>

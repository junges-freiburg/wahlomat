<template>
  <div
    class="swipe-card"
    :class="{ 'is-weighted': isWeighted }"
    :style="cardStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <div class="card-content">
      <div class="card-header">
        <span class="card-number">{{ texts.positionLabel }} {{ currentIndex + 1 }}/{{ totalCards }}</span>
        <button class="weight-toggle" :class="{ active: isWeighted }" @click.stop="emit('toggle-weight')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5V19"></path>
            <path d="M5 12H19"></path>
          </svg>
          <span>{{ weightButtonLabel }}</span>
          <span v-if="isWeighted" class="weight-badge">x2</span>
        </button>
      </div>

      <div class="card-body">
        <h2 class="these-text">{{ position.these }}</h2>

        <div v-if="showExplanation && position.erklaerung" class="explanation">
          <button class="explanation-toggle" @click.stop="toggleExplanation">
            <span>{{ texts.explanationLabel }}</span>
            <svg
              :class="{ rotated: explanationOpen }"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
          <Transition name="slide">
            <p v-if="explanationOpen" class="explanation-text">
              {{ position.erklaerung }}
            </p>
          </Transition>
        </div>
      </div>

      <div class="swipe-indicator" :class="swipeDirection">
        <span v-if="swipeDirection === 'right'" class="indicator agree">{{ texts.agreeButton }}</span>
        <span v-if="swipeDirection === 'left'" class="indicator disagree">{{ texts.disagreeButton }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  totalCards: {
    type: Number,
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
  showExplanation: {
    type: Boolean,
    default: true
  },
  enableSwipe: {
    type: Boolean,
    default: true
  },
  isWeighted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['swipe', 'toggle-weight'])

const explanationOpen = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)
const startX = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const isAnimating = ref(false)
const didMove = ref(false)

const SWIPE_THRESHOLD = 100
const TAP_THRESHOLD = 12

watch(() => props.position, () => {
  offsetX.value = 0
  offsetY.value = 0
  isAnimating.value = false
  explanationOpen.value = false
  didMove.value = false
})

const swipeDirection = computed(() => {
  if (offsetX.value > 50) return 'right'
  if (offsetX.value < -50) return 'left'
  return ''
})

const cardStyle = computed(() => {
  const rotate = offsetX.value * 0.1
  const opacity = Math.max(0.5, 1 - Math.abs(offsetX.value) / 500)
  return {
    transform: `translateX(${offsetX.value}px) translateY(${offsetY.value}px) rotate(${rotate}deg)`,
    opacity,
    transition: isAnimating.value ? 'transform 0.3s ease, opacity 0.3s ease' : 'none',
    '--card-bg': props.colors.cardBackground,
    '--text-primary': props.colors.textPrimary,
    '--text-secondary': props.colors.textSecondary,
    '--agree-color': props.colors.agree,
    '--disagree-color': props.colors.disagree,
    '--primary-color': props.colors.primary
  }
})

const weightButtonLabel = computed(() => {
  if (props.isWeighted) {
    return props.texts.weightToggleActiveLabel || props.texts.weightToggleLabel || 'Doppelt gewichtet'
  }
  return props.texts.weightToggleLabel || 'Doppelt gewichten'
})

function updateMovementFlag() {
  if (Math.abs(offsetX.value) > TAP_THRESHOLD || Math.abs(offsetY.value) > TAP_THRESHOLD) {
    didMove.value = true
  }
}

function emitNeutralAnswer() {
  didMove.value = false
  offsetX.value = 0
  offsetY.value = 0
  emit('swipe', 0)
}

function normalizeTarget(target) {
  if (!target) return null
  const base = target.nodeType === 3 ? target.parentElement : target
  return base instanceof Element ? base : null
}

function isInteractiveElement(target) {
  const element = normalizeTarget(target)
  if (!element) return false
  return Boolean(element.closest('button, a, input, textarea, select'))
}

function toggleExplanation() {
  explanationOpen.value = !explanationOpen.value
}

function onTouchStart(e) {
  if (!props.enableSwipe) return
  const target = e.touches?.[0]?.target || e.target
  if (isInteractiveElement(target)) return
  isDragging.value = true
  didMove.value = false
  startX.value = e.touches[0].clientX
  startY.value = e.touches[0].clientY
}

function onTouchMove(e) {
  if (!isDragging.value || !props.enableSwipe) return
  offsetX.value = e.touches[0].clientX - startX.value
  offsetY.value = (e.touches[0].clientY - startY.value) * 0.3
  updateMovementFlag()
}

function onTouchEnd() {
  if (!props.enableSwipe) return
  finishSwipe()
}

function onMouseDown(e) {
  if (!props.enableSwipe) return
  if (isInteractiveElement(e.target)) return
  isDragging.value = true
  didMove.value = false
  startX.value = e.clientX
  startY.value = e.clientY

  const onMouseMove = (e) => {
    if (!isDragging.value) return
    offsetX.value = e.clientX - startX.value
    offsetY.value = (e.clientY - startY.value) * 0.3
    updateMovementFlag()
  }

  const onMouseUp = () => {
    finishSwipe()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function finishSwipe() {
  isDragging.value = false

  if (offsetX.value > SWIPE_THRESHOLD) {
    isAnimating.value = true
    offsetX.value = 400
    setTimeout(() => {
      emit('swipe', 1)
    }, 300)
  } else if (offsetX.value < -SWIPE_THRESHOLD) {
    isAnimating.value = true
    offsetX.value = -400
    setTimeout(() => {
      emit('swipe', -1)
    }, 300)
  } else {
    if (!didMove.value) {
      emitNeutralAnswer()
    } else {
      isAnimating.value = true
      offsetX.value = 0
      offsetY.value = 0
      setTimeout(() => {
        isAnimating.value = false
      }, 300)
    }
  }
}

function swipeLeft() {
  isAnimating.value = true
  offsetX.value = -400
  setTimeout(() => {
    emit('swipe', -1)
  }, 300)
}

function swipeRight() {
  isAnimating.value = true
  offsetX.value = 400
  setTimeout(() => {
    emit('swipe', 1)
  }, 300)
}

defineExpose({ swipeLeft, swipeRight })
</script>

<style scoped>
.swipe-card {
  position: absolute;
  width: 100%;
  max-width: 400px;
  min-height: 350px;
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.3s ease;
  will-change: transform;
}

.swipe-card:active {
  cursor: grabbing;
}

.card-content {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-number {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

.weight-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.weight-toggle svg {
  display: block;
}

.weight-toggle.active {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.15);
}

.weight-badge {
  font-weight: 700;
}

.swipe-card.is-weighted {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35), 0 0 0 2px rgba(99, 102, 241, 0.5);
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.these-text {
  font-size: 1.4rem;
  line-height: 1.4;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 20px;
}

.explanation {
  margin-top: auto;
}

.explanation-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
}

.explanation-toggle svg {
  transition: transform 0.3s ease;
}

.explanation-toggle svg.rotated {
  transform: rotate(180deg);
}

.explanation-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.swipe-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.swipe-indicator.right {
  right: -10px;
}

.swipe-indicator.left {
  left: -10px;
}

.indicator {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
}

.indicator.agree {
  background: var(--agree-color);
  color: white;
}

.indicator.disagree {
  background: var(--disagree-color);
  color: white;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 200px;
}

@media (min-width: 768px) {
  .swipe-card {
    min-height: 400px;
  }

  .these-text {
    font-size: 1.6rem;
  }
}
</style>

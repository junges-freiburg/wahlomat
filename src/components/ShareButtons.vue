<template>
  <div class="share-section" :style="shareStyles">
    <h3>{{ texts.shareTitle }}</h3>

    <div class="share-buttons">
      <button class="universal-share" @click="shareUniversal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 12h12" />
          <path d="M12 6l6 6-6 6" />
        </svg>
        <span>{{ texts.shareButtonLabel || 'Jetzt teilen' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  shareUrl: {
    type: String,
    required: true
  },
  shareText: {
    type: String,
    required: true
  },
  hashtags: {
    type: String,
    default: ''
  },
  topResult: {
    type: Object,
    default: null
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

const shareStyles = computed(() => ({
  '--primary-color': props.colors.primary,
  '--text-primary': props.colors.textPrimary,
  '--text-secondary': props.colors.textSecondary,
  '--card-bg': props.colors.cardBackground
}))

const fullShareText = computed(() => {
  if (props.topResult) {
    return `${props.shareText} Mein Top-Match: ${props.topResult.partei.name} (${Math.round(props.topResult.percentage)}%)`
  }
  return props.shareText
})

async function shareUniversal() {
  const payload = {
    title: 'Wahlomat',
    text: fullShareText.value,
    url: props.shareUrl
  }

  if (navigator.share) {
    try {
      await navigator.share(payload)
      return
    } catch (err) {
      if (err?.name === 'AbortError') {
        return
      }
    }
  }

  const shareUrl = `mailto:?subject=${encodeURIComponent(payload.title)}&body=${encodeURIComponent(`${payload.text}\n${payload.url}`)}`
  window.open(shareUrl, '_blank')
}
</script>

<style scoped>
.share-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.share-section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 20px;
  font-weight: 600;
}

.share-buttons {
  display: flex;
  justify-content: center;
}

.universal-share {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: none;
  border-radius: 999px;
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--primary-color), var(--card-bg));
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.universal-share:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.universal-share svg {
  stroke: currentColor;
}
</style>

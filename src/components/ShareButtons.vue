<template>
  <div class="share-section" :style="shareStyles">
    <h3>{{ texts.shareTitle }}</h3>

    <div class="share-buttons">
      <button
        class="universal-share"
        :class="{ 'is-loading': isGenerating }"
        :disabled="isGenerating"
        @click="shareUniversal"
      >
        <span v-if="isGenerating" class="spinner"></span>
        <svg
          v-else
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M6 12h12" />
          <path d="M12 6l6 6-6 6" />
        </svg>
        <span>{{ primaryLabel }}</span>
      </button>

      <button
        v-if="downloadUrl"
        class="download-share"
        type="button"
        @click="downloadSharepic"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v12" />
          <path d="M7 13l5 5 5-5" />
          <path d="M5 19h14" />
        </svg>
        <span>{{ texts.shareDownloadButton || 'Sharepic speichern' }}</span>
      </button>
    </div>

    <p v-if="errorMessage" class="share-error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { generateShareImage } from '../composables/useShareImage'

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
  },
  shareConfig: {
    type: Object,
    default: () => ({})
  },
  appTitle: {
    type: String,
    default: ''
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

const isGenerating = ref(false)
const downloadUrl = ref('')
const downloadFileName = ref('match-card.png')
const errorMessage = ref('')
const shareFile = ref(null)

const primaryLabel = computed(() => {
  if (isGenerating.value) {
    return props.texts.shareImageGenerating || 'Sharepic wird erstellt...'
  }
  return props.texts.shareButtonLabel || 'Jetzt teilen'
})

function revokeDownloadUrl() {
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value)
    downloadUrl.value = ''
  }
}

onBeforeUnmount(() => {
  revokeDownloadUrl()
})

watch(
  () => props.topResult?.partei?.id,
  () => {
    shareFile.value = null
    revokeDownloadUrl()
  }
)

async function ensureShareImage() {
  if (!props.topResult) return null
  if (shareFile.value && downloadUrl.value) {
    return { file: shareFile.value }
  }
  const { blob, fileName } = await generateShareImage({
    topResult: props.topResult,
    shareConfig: props.shareConfig,
    colors: props.colors,
    texts: props.texts,
    appTitle: props.appTitle
  })
  shareFile.value = new File([blob], fileName, { type: 'image/png' })
  revokeDownloadUrl()
  downloadUrl.value = URL.createObjectURL(blob)
  downloadFileName.value = fileName
  return { file: shareFile.value }
}

function downloadSharepic() {
  if (!downloadUrl.value) return
  const link = document.createElement('a')
  link.href = downloadUrl.value
  link.download = downloadFileName.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function shareUniversal() {
  if (isGenerating.value) return
  errorMessage.value = ''
  let files = []

  if (props.topResult) {
    try {
      isGenerating.value = true
      const generated = await ensureShareImage()
      if (generated?.file) {
        files = [generated.file]
      }
    } catch (err) {
      console.error('Sharepic generation failed', err)
      errorMessage.value = props.texts.shareImageError || 'Sharepic konnte nicht erstellt werden.'
    } finally {
      isGenerating.value = false
    }
  }

  const payload = {
    title: props.appTitle || 'Dein Match',
    text: fullShareText.value,
    url: props.shareUrl
  }

  if (files.length && navigator.canShare?.({ files })) {
    try {
      await navigator.share({ ...payload, files })
      return
    } catch (err) {
      if (err?.name === 'AbortError') {
        return
      }
      console.warn('navigator.share with files failed', err)
    }
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

  if (downloadUrl.value) {
    downloadSharepic()
    return
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
  flex-wrap: wrap;
  gap: 16px;
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

.universal-share:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.universal-share.is-loading {
  padding-left: 22px;
  padding-right: 22px;
}

.universal-share svg {
  stroke: currentColor;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 999px;
  animation: spin 1s linear infinite;
}

.download-share {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.download-share:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

.share-error {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #f87171;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

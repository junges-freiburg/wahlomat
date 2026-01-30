<template>
  <div class="share-section" :style="shareStyles">
    <h3>{{ texts.shareTitle }}</h3>

    <div class="share-buttons">
      <button class="share-btn facebook" @click="shareFacebook" title="Auf Facebook teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      <button class="share-btn whatsapp" @click="shareWhatsApp" title="Per WhatsApp teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      <button class="share-btn telegram" @click="shareTelegram" title="Per Telegram teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      </button>

      <button class="share-btn signal" @click="shareSignal" title="Über Signal teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.302.65 4.45 1.777 6.273L.184 22.46a1 1 0 0 0 1.356 1.356l4.188-1.593A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm5.707 14.293a1 1 0 0 1-1.414 1.414l-1.586-1.586V17a1 1 0 0 1-2 0v-2.879l-1.586 1.586a1 1 0 0 1-1.414-1.414L10.586 12 8.707 10.121a1 1 0 0 1 1.414-1.414L12 11.586l1.879-1.879a1 1 0 0 1 1.414 1.414L13.414 12z"/>
        </svg>
      </button>

      <button class="share-btn threema" @click="shareThreema" title="Über Threema teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.486 2 2 6.065 2 10.854c0 2.52 1.234 4.8 3.217 6.414L4 22l5.273-2.527c.889.197 1.818.315 2.727.315 5.514 0 10-4.065 10-8.934C22 6.065 17.514 2 12 2zm-4 9a1 1 0 1 1 .001-1.999A1 1 0 0 1 8 11zm4 0a1 1 0 1 1 .001-1.999A1 1 0 0 1 12 11zm4 0a1 1 0 1 1 .001-1.999A1 1 0 0 1 16 11z"/>
        </svg>
      </button>

      <button class="share-btn instagram" @click="shareInstagram" title="Auf Instagram teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 2c-2.757 0-5 2.243-5 5v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-5 2a5 5 0 1 0 .001 10.001A5 5 0 0 0 11 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 11 9z"/>
        </svg>
      </button>

      <button class="share-btn mastodon" @click="shareMastodon" title="Auf Mastodon teilen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.43 7.86c-.29-2.1-2.18-3.77-4.44-4.15A33.25 33.25 0 0 0 12 3.29c-1.19.01-2.38.07-3.56.17-2.26.38-4.15 2.05-4.44 4.15-.27 1.96-.29 3.92.08 5.85.41 2.1 1.48 3.91 3.08 5.05 1.72 1.27 3.43 1.74 5.8 1.8 2.38-.06 4.08-.53 5.8-1.8 1.6-1.14 2.67-2.95 3.08-5.05.37-1.93.35-3.89.08-5.85zM17.5 15.5h-1.8V9.89c0-1.45-1.9-1.5-1.9.2v3.18h-1.8V10.1c0-1.7-1.9-1.65-1.9-.2v5.6H8.3V8.62c0-1.45 1.15-2.6 2.6-2.6 1.2 0 1.95.55 2.4 1.35.45-.8 1.2-1.35 2.4-1.35 1.45 0 2.6 1.15 2.6 2.6V15.5z"/>
        </svg>
      </button>

      <button class="share-btn copy" @click="copyLink" :title="texts.copyLinkButton">
        <svg v-if="!copied" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </button>
    </div>

    <p v-if="copied" class="copied-message">{{ texts.linkCopied }}</p>
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

const copied = ref(false)

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

const shareMessageWithLink = computed(() => `${fullShareText.value} ${props.shareUrl}`.trim())

function shareFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.shareUrl)}&quote=${encodeURIComponent(fullShareText.value)}`
  window.open(url, '_blank', 'width=600,height=400')
}

function shareWhatsApp() {
  const url = `https://wa.me/?text=${encodeURIComponent(shareMessageWithLink.value)}`
  window.open(url, '_blank')
}

function shareTelegram() {
  const url = `https://t.me/share/url?url=${encodeURIComponent(props.shareUrl)}&text=${encodeURIComponent(fullShareText.value)}`
  window.open(url, '_blank')
}

function shareSignal() {
  const url = `https://signal.me/#text=${encodeURIComponent(shareMessageWithLink.value)}`
  window.open(url, '_blank')
}

function shareThreema() {
  const url = `https://share.threema.ch/share?text=${encodeURIComponent(shareMessageWithLink.value)}`
  window.open(url, '_blank')
}

async function shareInstagram() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Wahlomat',
        text: fullShareText.value,
        url: props.shareUrl
      })
      return
    } catch (err) {
      // user cancelled share sheet, fall through to copy
    }
  }
  copyLink()
}

function shareMastodon() {
  const url = `https://mastodonshare.com/?text=${encodeURIComponent(fullShareText.value)}&url=${encodeURIComponent(props.shareUrl)}`
  window.open(url, '_blank', 'width=600,height=600')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.shareUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.shareUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
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
  gap: 12px;
  flex-wrap: wrap;
}

.share-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: white;
}

.share-btn:hover {
  transform: translateY(-2px);
}

.share-btn.facebook {
  background: #1877f2;
}

.share-btn.whatsapp {
  background: #25d366;
}

.share-btn.telegram {
  background: #0088cc;
}

.share-btn.signal {
  background: #3a76f0;
}

.share-btn.threema {
  background: #262626;
}

.share-btn.threema svg {
  color: #3fe669;
}

.share-btn.instagram {
  background: linear-gradient(45deg, #f58529, #feda77, #dd2a7b, #8134af, #515bd4);
}

.share-btn.mastodon {
  background: #6364ff;
}

.share-btn.copy {
  background: var(--card-bg);
  color: var(--text-primary);
}

.share-btn.copy:hover {
  background: var(--primary-color);
}

.copied-message {
  margin-top: 12px;
  font-size: 14px;
  color: #22c55e;
}
</style>

<template>
  <div v-if="hasLinks" class="footer-links">
    <a v-if="footer.privacyPolicy?.url" :href="footer.privacyPolicy.url" target="_blank" rel="noopener">
      {{ footer.privacyPolicy.label || 'Datenschutz' }}
    </a>
    <span v-if="footer.privacyPolicy?.url && footer.imprint?.url" class="separator">·</span>
    <a v-if="footer.imprint?.url" :href="footer.imprint.url" target="_blank" rel="noopener">
      {{ footer.imprint.label || 'Impressum' }}
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  footer: { type: Object, default: () => ({}) }
})

const hasLinks = computed(() =>
  props.footer?.privacyPolicy?.url || props.footer?.imprint?.url
)
</script>

<style scoped>
.footer-links {
  width: 100%;
  max-width: 400px;
  margin: 40px auto 20px auto;

  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

.footer-links a {
  pointer-events: auto;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: rgba(255, 255, 255, 0.75);
}

.separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
}
</style>

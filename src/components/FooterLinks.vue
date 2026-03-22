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
  margin: 8px auto 0 auto;

  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

.footer-links a {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: rgba(255, 255, 255, 0.9);
}

.separator {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
}
</style>

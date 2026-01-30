import { ref } from 'vue'

const config = ref(null)
const loading = ref(true)
const error = ref(null)

export async function loadConfig() {
  if (config.value) return config.value

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}config.json`)
    config.value = await response.json()
    loading.value = false
    return config.value
  } catch (e) {
    error.value = e
    loading.value = false
    throw e
  }
}

export function useConfig() {
  return {
    config,
    loading,
    error,
    loadConfig
  }
}

export function getColor(colorName) {
  return config.value?.colors?.[colorName] || '#ffffff'
}

export function getText(textKey) {
  return config.value?.texts?.[textKey] || textKey
}

export function getSetting(settingKey) {
  return config.value?.settings?.[settingKey]
}

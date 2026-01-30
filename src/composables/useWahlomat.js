import { ref, computed } from 'vue'

const parteien = ref([])
const positionen = ref([])
const userAnswers = ref({})
const currentIndex = ref(0)
const isLoading = ref(true)
const error = ref(null)
const weightedPositions = ref(new Set())

export function useWahlomat() {
  async function loadJSON(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }

  async function loadData() {
    try {
      isLoading.value = true
      error.value = null
      const [parteienData, positionenData] = await Promise.all([
        loadJSON('./data/parteien.json'),
        loadJSON('./data/positionen.json')
      ])

      parteien.value = parteienData
      positionen.value = positionenData
      weightedPositions.value = new Set()
      isLoading.value = false
    } catch (e) {
      error.value = e
      isLoading.value = false
      throw e
    }
  }

  const currentPosition = computed(() => positionen.value[currentIndex.value])

  const hasMorePositions = computed(() => currentIndex.value < positionen.value.length)

  const progress = computed(() => ({
    current: Object.keys(userAnswers.value).length,
    total: positionen.value.length
  }))

  function toggleWeight(positionId) {
    if (!positionId) return
    const updated = new Set(weightedPositions.value)
    if (updated.has(positionId)) {
      updated.delete(positionId)
    } else {
      updated.add(positionId)
    }
    weightedPositions.value = updated
  }

  function isPositionWeighted(positionId) {
    if (!positionId) return false
    return weightedPositions.value.has(positionId)
  }

  function getWeight(positionId) {
    return weightedPositions.value.has(positionId) ? 2 : 1
  }

  function answerPosition(answer) {
    if (!currentPosition.value) return

    userAnswers.value[currentPosition.value.id] = answer
    currentIndex.value++
  }

  function calculateResults() {
    return parteien.value.map(partei => {
      let totalPoints = 0
      let maxPoints = 0
      let agrees = 0
      let disagrees = 0
      let neutrals = 0
      const positions = []

      positionen.value.forEach(position => {
        const userAnswer = userAnswers.value[position.id]
        if (userAnswer === undefined) return

        const partyAnswer = position.positionen[partei.id]
        const weight = getWeight(position.id)
        maxPoints += 2 * weight
        let pointsForPosition = 0

        if (userAnswer === partyAnswer) {
          pointsForPosition = 2
          if (userAnswer === 1) agrees++
          else if (userAnswer === -1) disagrees++
          else neutrals++
        } else if (userAnswer === 0 || partyAnswer === 0) {
          pointsForPosition = 1
          neutrals++
        } else {
          if (userAnswer === 1 || userAnswer === -1) {
            if (partyAnswer === 1) disagrees++
            else if (partyAnswer === -1) agrees++
          }
        }

        totalPoints += pointsForPosition * weight

        positions.push({
          id: position.id,
          these: position.these,
          userAnswer,
          partyAnswer,
          partyExplanation: position.erklaerungen[partei.id],
          weight
        })
      })

      const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0

      return {
        partei,
        percentage,
        agrees,
        disagrees,
        neutrals,
        positions
      }
    })
  }

  function reset() {
    userAnswers.value = {}
    currentIndex.value = 0
    weightedPositions.value = new Set()
  }

  return {
    parteien,
    positionen,
    userAnswers,
    currentIndex,
    isLoading,
    error,
    currentPosition,
    hasMorePositions,
    progress,
    loadData,
    answerPosition,
    calculateResults,
    toggleWeight,
    isPositionWeighted,
    reset
  }
}

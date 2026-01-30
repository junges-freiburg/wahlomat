import { ref, computed } from 'vue'
import { loadCSV, parsePositionen, parseParteien } from './useCSV'

const parteien = ref([])
const positionen = ref([])
const userAnswers = ref({})
const currentIndex = ref(0)
const isLoading = ref(true)
const error = ref(null)

export function useWahlomat() {
  async function loadData() {
    try {
      isLoading.value = true
      const baseUrl = import.meta.env.BASE_URL
      const [parteienData, positionenData] = await Promise.all([
        loadCSV(`${baseUrl}data/parteien.csv`),
        loadCSV(`${baseUrl}data/positionen.csv`)
      ])

      parteien.value = parseParteien(parteienData)
      positionen.value = parsePositionen(positionenData, parteien.value)
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
        maxPoints += 2

        if (userAnswer === partyAnswer) {
          totalPoints += 2
          if (userAnswer === 1) agrees++
          else if (userAnswer === -1) disagrees++
          else neutrals++
        } else if (userAnswer === 0 || partyAnswer === 0) {
          totalPoints += 1
          neutrals++
        } else {
          if (userAnswer === 1 || userAnswer === -1) {
            if (partyAnswer === 1) disagrees++
            else if (partyAnswer === -1) agrees++
          }
        }

        positions.push({
          id: position.id,
          these: position.these,
          userAnswer,
          partyAnswer,
          partyExplanation: position.erklaerungen[partei.id]
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
    reset
  }
}

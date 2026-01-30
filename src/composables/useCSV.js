export function parseCSV(csvText, delimiter = ';') {
  const lines = csvText.trim().split('\n')
  if (lines.length === 0) return []

  const headers = lines[0].split(delimiter).map(h => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter)
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || ''
    })
    rows.push(row)
  }

  return rows
}

export async function loadCSV(url) {
  const response = await fetch(url)
  const text = await response.text()
  return parseCSV(text)
}

export function parsePositionen(csvData, parteien) {
  return csvData.map(row => {
    const positionen = {}
    const erklaerungen = {}

    parteien.forEach(partei => {
      const key = `partei_${partei.id}`
      const erkKey = `erklaerung_${partei.id}`
      positionen[partei.id] = parseInt(row[key]) || 0
      erklaerungen[partei.id] = row[erkKey] || ''
    })

    return {
      id: row.id,
      these: row.these,
      erklaerung: row.erklaerung,
      positionen,
      erklaerungen
    }
  })
}

export function parseParteien(csvData) {
  return csvData.map(row => ({
    id: row.id,
    name: row.name,
    kurzname: row.kurzname,
    farbe: row.farbe,
    logo: row.logo,
    beschreibung: row.beschreibung || ''
  }))
}

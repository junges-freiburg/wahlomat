const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350
const SAFE_AREA = 120

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Unable to load share background: ${src}`))
    image.src = src
  })
}

function coverImage(ctx, image) {
  const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT
  const imageRatio = image.width / image.height

  let drawWidth = CANVAS_WIDTH
  let drawHeight = CANVAS_HEIGHT
  let dx = 0
  let dy = 0

  if (imageRatio > canvasRatio) {
    drawHeight = CANVAS_HEIGHT
    drawWidth = drawHeight * imageRatio
    dx = (CANVAS_WIDTH - drawWidth) / 2
  } else {
    drawWidth = CANVAS_WIDTH
    drawHeight = drawWidth / imageRatio
    dy = (CANVAS_HEIGHT - drawHeight) / 2
  }

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight)
}

function fitText(ctx, text, maxWidth, baseSize, weight = 700) {
  let fontSize = baseSize
  while (fontSize >= 36) {
    const font = `${weight} ${fontSize}px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif`
    ctx.font = font
    if (ctx.measureText(text).width <= maxWidth) {
      return { font, size: fontSize }
    }
    fontSize -= 2
  }

  const fallbackFont = `${weight} 36px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif`
  ctx.font = fallbackFont
  return { font: fallbackFont, size: 36 }
}

function drawRoundedRect(ctx, { x, y, width, height, radius }) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

async function drawBackground(ctx, shareConfig, colors) {
  if (shareConfig?.background) {
    try {
      const img = await loadImage(shareConfig.background)
      coverImage(ctx, img)
    } catch (err) {
      console.warn(err.message)
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      const primary = colors?.primary || '#e27b29'
      const background = colors?.background || '#2f2f2f'
      gradient.addColorStop(0, background)
      gradient.addColorStop(1, primary)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      return
    }
  } else {
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const primary = colors?.primary || '#e27b29'
    const secondary = colors?.secondary || '#ffa754'
    gradient.addColorStop(0, primary)
    gradient.addColorStop(1, secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  const overlay = ctx.createLinearGradient(0, SAFE_AREA, 0, CANVAS_HEIGHT - SAFE_AREA)
  overlay.addColorStop(0, 'rgba(47, 47, 47, 0.55)')
  overlay.addColorStop(1, 'rgba(47, 47, 47, 0.2)')
  ctx.fillStyle = overlay
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function drawHearts(ctx) {
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.setLineDash([12, 18])
  ctx.beginPath()
  ctx.arc(260, 400, 140, Math.PI * 0.2, Math.PI * 1.2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(820, 440, 160, Math.PI * 1.1, Math.PI * 2.1)
  ctx.stroke()
  ctx.setLineDash([])
}

function getImgRatio(img, fallbackRatio = 1) {
  const w = img.naturalWidth || img.width || 0
  const h = img.naturalHeight || img.height || 0
  return (w > 0 && h > 0) ? w / h : fallbackRatio
}

async function drawLogos(ctx, logoImg, jfLogoImg, logoSize = 120, jfLogoSize = 120) {
  const gap = 48


  // logo.svg viewBox: 1500 × 1350 → ratio ≈ 1.111
  const mainRatio = getImgRatio(logoImg, 1500 / 1350)
  const mainW = logoSize * mainRatio

  // jflogo.svg viewBox: 2000 × 2000 → ratio = 1
  const jfRatio = getImgRatio(jfLogoImg, 1)
  const jfW = jfLogoSize * jfRatio

  const totalW = mainW + gap + jfW
  const startX = (CANVAS_WIDTH - totalW) / 2
  // vertikale Mitte der verfügbaren Footer-Zone
  const centerY = CANVAS_HEIGHT - SAFE_AREA + SAFE_AREA / 2

  if (logoImg) ctx.drawImage(logoImg, startX, centerY - logoSize / 2, mainW, logoSize)
  if (jfLogoImg) ctx.drawImage(jfLogoImg, startX + mainW + gap, centerY - jfLogoSize / 2, jfW, jfLogoSize)
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''

  words.forEach(word => {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth) {
      if (line) lines.push(line)
      line = word
    } else {
      line = testLine
    }
  })

  if (line) lines.push(line)
  return lines
}

export async function generateShareImage({
  topResult,
  shareConfig,
  colors,
  texts
}) {
  if (!topResult) {
    throw new Error('TOP_RESULT_REQUIRED')
  }

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  const [logoImg, jfLogoImg] = await Promise.all([
    loadImage('/logo.svg').catch(() => null),
    loadImage('/jflogo.svg').catch(() => null)
  ])

  await drawBackground(ctx, shareConfig, colors)
  drawHearts(ctx)

  const partyColor = topResult.partei?.farbe || colors?.primary || '#f472b6'
  const title = shareConfig?.title || "It's a match!"
  const percentageLabel = shareConfig?.percentageLabel || 'Übereinstimmung'

  const partyName = topResult.partei?.name || 'Deine Partei'
  const percentage = Math.round(topResult.percentage)
  const statsTitle = shareConfig?.statsTitle || 'Deine Antworten'

  const stats = {
    agrees: topResult.agrees ?? 0,
    neutrals: topResult.neutrals ?? 0,
    disagrees: topResult.disagrees ?? 0
  }

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  let currentY = SAFE_AREA
  const titleFontSize = 118
  ctx.font = `800 ${titleFontSize}px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif`
  ctx.fillText(title, CANVAS_WIDTH / 2, currentY)
  currentY += titleFontSize + 56

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = "600 56px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(percentageLabel, CANVAS_WIDTH / 2, currentY)
  currentY += 78

  ctx.fillStyle = '#ffffff'
  const percentageFontSize = 200
  ctx.font = `900 ${percentageFontSize}px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif`
  ctx.fillText(`${percentage}%`, CANVAS_WIDTH / 2, currentY)
  currentY += percentageFontSize + 48

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  const fitted = fitText(ctx, partyName, CANVAS_WIDTH - SAFE_AREA * 2, 96, 800)
  ctx.font = fitted.font
  const nameLines = wrapText(ctx, partyName, CANVAS_WIDTH - SAFE_AREA * 2)
  const lineHeight = fitted.size + 12
  nameLines.forEach((line, index) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, currentY + index * lineHeight)
  })
  currentY += nameLines.length * lineHeight + 60

  const cardHeight = 240
  const cardX = SAFE_AREA
  const cardWidth = CANVAS_WIDTH - SAFE_AREA * 2
  const cardY = Math.max(currentY, 820)

  ctx.globalAlpha = 0.92
  ctx.fillStyle = '#0f172a'
  drawRoundedRect(ctx, {
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: cardHeight,
    radius: 36
  })
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.font = "600 44px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(statsTitle, CANVAS_WIDTH / 2, cardY + 32)

  const statsArray = [
    { label: texts.agreeButton || 'Zustimmung', value: stats.agrees, color: colors.agree || '#22c55e' },
    { label: texts.neutralButton || 'Neutral', value: stats.neutrals, color: colors.neutral || '#f59e0b' },
    { label: texts.disagreeButton || 'Ablehnung', value: stats.disagrees, color: colors.disagree || '#ef4444' }
  ]

  const statAreaWidth = cardWidth - 96
  const statWidth = statAreaWidth / statsArray.length
  const statStartX = cardX + 48
  const statY = cardY + 110

  statsArray.forEach((stat, index) => {
    const centerX = statStartX + statWidth * index + statWidth / 2
    ctx.fillStyle = stat.color
    ctx.font = "800 72px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
    ctx.fillText(String(stat.value ?? 0), centerX, statY)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = "500 30px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
    ctx.fillText(stat.label, centerX, statY + 86)
  })

  await drawLogos(ctx, logoImg, jfLogoImg, shareConfig?.logoSize, shareConfig?.jfLogoSize)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(value => {
      if (value) resolve(value)
      else reject(new Error('CANVAS_TO_BLOB_FAILED'))
    }, 'image/png', 0.95)
  })

  return {
    blob,
    fileName: 'match-card.png'
  }
}

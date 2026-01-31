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
  do {
    ctx.font = `${weight} ${fontSize}px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif`
    if (ctx.measureText(text).width <= maxWidth) {
      return ctx.font
    }
    fontSize -= 2
  } while (fontSize >= 36)

  return ctx.font
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
      const primary = colors?.primary || '#8b5cf6'
      const background = colors?.background || '#0f172a'
      gradient.addColorStop(0, background)
      gradient.addColorStop(1, primary)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      return
    }
  } else {
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const primary = colors?.primary || '#8b5cf6'
    const secondary = colors?.secondary || '#6366f1'
    gradient.addColorStop(0, primary)
    gradient.addColorStop(1, secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  const overlay = ctx.createLinearGradient(0, SAFE_AREA, 0, CANVAS_HEIGHT - SAFE_AREA)
  overlay.addColorStop(0, 'rgba(15, 23, 42, 0.55)')
  overlay.addColorStop(1, 'rgba(15, 23, 42, 0.2)')
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

function drawTag(ctx, text, color) {
  const tagPaddingX = 32
  const tagPaddingY = 18
  ctx.font = "600 38px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  const textWidth = ctx.measureText(text).width
  const tagWidth = textWidth + tagPaddingX * 2
  const tagHeight = 68
  const x = (CANVAS_WIDTH - tagWidth) / 2
  const y = 300

  ctx.globalAlpha = 0.9
  ctx.fillStyle = color
  drawRoundedRect(ctx, { x, y, width: tagWidth, height: tagHeight, radius: 999 })
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.fillStyle = '#0f172a'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, CANVAS_WIDTH / 2, y + tagHeight / 2)
}

function drawFooter(ctx, footerText, appTitle) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.font = "600 44px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(appTitle, CANVAS_WIDTH / 2, CANVAS_HEIGHT - SAFE_AREA + 40)

  ctx.font = "400 34px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
  const lines = wrapText(ctx, footerText, CANVAS_WIDTH - SAFE_AREA * 2)
  lines.forEach((line, index) => {
    ctx.fillText(line, CANVAS_WIDTH / 2, CANVAS_HEIGHT - SAFE_AREA + 110 + index * 42)
  })
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
  texts,
  appTitle
}) {
  if (!topResult) {
    throw new Error('TOP_RESULT_REQUIRED')
  }

  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')

  await drawBackground(ctx, shareConfig, colors)
  drawHearts(ctx)

  const partyColor = topResult.partei?.farbe || colors?.primary || '#f472b6'
  const title = shareConfig?.title || "It's a match!"
  const subtitlePrefix = shareConfig?.subtitlePrefix || 'Dein Match'
  const percentageLabel = shareConfig?.percentageLabel || 'Übereinstimmung'
  const footerText = shareConfig?.footerText || texts?.shareText || ''
  const partyName = topResult.partei?.name || 'Deine Partei'
  const partyShort = topResult.partei?.kurzname || ''
  const percentage = Math.round(topResult.percentage)

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = "800 120px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(title, CANVAS_WIDTH / 2, SAFE_AREA)

  drawTag(ctx, `${subtitlePrefix}${partyShort ? ` • ${partyShort}` : ''}`, '#fdf2f8')

  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.font = "600 48px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(percentageLabel, CANVAS_WIDTH / 2, 410)

  ctx.fillStyle = '#ffffff'
  ctx.font = "900 200px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(`${percentage}%`, CANVAS_WIDTH / 2, 460)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = fitText(ctx, partyName, CANVAS_WIDTH - SAFE_AREA * 2, 96, 800)
  ctx.fillText(partyName, CANVAS_WIDTH / 2, 690)

  ctx.globalAlpha = 0.9
  ctx.fillStyle = '#0f172a'
  drawRoundedRect(ctx, {
    x: SAFE_AREA,
    y: 840,
    width: CANVAS_WIDTH - SAFE_AREA * 2,
    height: 180,
    radius: 32
  })
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 1

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
  ctx.font = "500 64px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText('Scoreboard', SAFE_AREA + 48, 920)

  const barWidth = CANVAS_WIDTH - SAFE_AREA * 2 - 96
  const matchWidth = Math.max(barWidth * (topResult.percentage / 100), 80)

  ctx.fillStyle = 'rgba(15, 23, 42, 0.15)'
  drawRoundedRect(ctx, {
    x: SAFE_AREA + 48,
    y: 960,
    width: barWidth,
    height: 34,
    radius: 17
  })
  ctx.fill()

  ctx.fillStyle = partyColor
  drawRoundedRect(ctx, {
    x: SAFE_AREA + 48,
    y: 960,
    width: matchWidth,
    height: 34,
    radius: 17
  })
  ctx.fill()

  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
  ctx.font = "500 50px 'Poppins', 'Montserrat', 'Segoe UI', sans-serif"
  ctx.fillText(`${percentage}%`, CANVAS_WIDTH - SAFE_AREA - 48, 940)

  drawFooter(ctx, footerText, appTitle || 'Dein-Freiburg-Match')

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

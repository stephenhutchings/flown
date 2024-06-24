const qsa = (selector) => [...document.querySelectorAll(selector)]

const scrollTo = (e) => {
  const target = document.querySelector(e.currentTarget.hash)

  if (
    target &&
    e.currentTarget.dataset.noscroll === undefined &&
    e.currentTarget.hash &&
    e.currentTarget.pathname === window.location.pathname &&
    !e.metaKey
  ) {
    e.preventDefault()
    target.scrollIntoView({
      behavior: "smooth",
    })
  }
}

const loadImage = (src) => {
  return new Promise((res) => {
    const img = document.createElement("img")
    img.onload = () => res(img)
    img.src = src
  })
}

const drawImage = (context, img, resize, align, norepeat) => {
  const iw = img.width
  const ih = img.height
  const cw = context.canvas.width
  const ch = context.canvas.height

  let dw = cw
  let dh = ch

  if (resize !== "stretch") {
    let f = 1

    if (resize === "contain") f = Math.min(cw / iw, ch / ih)
    if (resize === "cover") f = Math.max(cw / iw, ch / ih)
    if (resize === "balance") f = (cw / iw + ch / ih) * 0.5

    dw = Math.floor(iw * f)
    dh = Math.floor(ih * f)
  }

  const dx = align === "hoist" ? 0 : (cw - dw) / 2
  const dy = (ch - dh) / 2

  context.drawImage(img, dx, dy, dw, dh)

  if (norepeat) return

  // Repeat horizontal and vertical edges if needed
  if (dw < cw) {
    context.drawImage(img, 0, 0, 1, ih, 0, dy, dx, dh)
    context.drawImage(img, iw - 1, 0, 1, ih, dx + dw, dy, cw - (dw + dx), dh)
  }

  if (dh < ch) {
    context.drawImage(img, 0, 0, iw, 1, dx, 0, dw, dy)
    context.drawImage(img, 0, ih - 1, iw, 1, dx, dh + dy, dw, dy)
  }
}

qsa("a[href*='#']").forEach((a) => a.addEventListener("click", scrollTo))

qsa("[data-component='image-diff'").forEach(async (el) => {
  const canvas = el.querySelector("canvas")
  const difference = el.querySelector(".status-count")

  const a = await loadImage(el.dataset.imageA)
  const b = await loadImage(el.dataset.imageB)

  const context = canvas.getContext("2d", { willReadFrequently: true })
  canvas.width *= window.devicePixelRatio
  canvas.height *= window.devicePixelRatio

  const { width, height } = canvas

  const process = (x, y) => {
    const resize = el.resize ? el.resize.value : "stretch"
    const align = el.align ? el.align.value : "center"
    const contrast = 1.5

    context.clearRect(0, 0, width, height)

    context.globalCompositeOperation = "source-over"
    drawImage(context, a, resize, align, x || y)

    if (x || y) {
      context.filter = "none"
      const f = canvas.width / canvas.offsetWidth
      const s = 3 * f
      const r = 100 * f
      x *= f
      y *= f

      context.save()

      context.beginPath()
      context.moveTo(x + r, y)
      context.arc(x, y - 0.001, r, 0, Math.PI * 2)
      context.closePath()
      context.clip()
      drawImage(context, b, resize, align)
      context.restore()

      context.beginPath()
      context.moveTo(x + r - s / 2, y)
      context.arc(x, y - 0.001, r - s / 2, 0, Math.PI * 2)
      context.closePath()
      context.strokeStyle = "#aaa3"
      context.lineWidth = s
      context.stroke()

      return
    }

    // Increased contrast exaggerates differences in placement
    // and reduces differences in colour.
    context.filter = `contrast(${contrast})`

    context.globalCompositeOperation = "difference"
    drawImage(context, b, resize, align)

    const { data } = context.getImageData(0, 0, width, height)

    context.fillStyle = "white"
    context.globalCompositeOperation = "color"
    context.fillRect(0, 0, width, height)
    context.globalCompositeOperation = "difference"
    context.fillRect(0, 0, width, height)

    context.fillStyle = "#121e25"
    context.globalCompositeOperation = "lighten"
    context.fillRect(0, 0, width, height)

    const d =
      data.reduce((m, a, i) => m + (i % 4 === 3 ? 0 : a / 255)) /
      (data.length * 0.75)

    difference.innerHTML = (d * 100).toFixed(1) + "%"
  }

  el.addEventListener("submit", (e) => {
    e.preventDefault()
  })

  el.addEventListener("input", (e) => {
    process()
  })

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
  })

  canvas.addEventListener("pointermove", (e) => {
    process(e.offsetX, e.offsetY)
  })

  canvas.addEventListener("pointerleave", () => {
    process()
  })

  process()
})

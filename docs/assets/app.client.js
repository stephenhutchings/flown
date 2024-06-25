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
  let dx
  let dy

  if (resize !== "stretch") {
    let f = 1

    if (resize === "contain") f = Math.min(cw / iw, ch / ih)
    if (resize === "cover") f = Math.max(cw / iw, ch / ih)
    if (resize === "balance") f = (cw / iw + ch / ih) * 0.5

    dw = Math.floor(iw * f)
    dh = Math.floor(ih * f)
  }

  dx = (cw - dw) / 2
  dy = (ch - dh) / 2

  if (align === "hoist") dx = 0
  if (align === "fly") dx = cw - dw

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

qsa("[data-component='replace']").forEach((a) =>
  a.addEventListener("click", () => {
    const content = a.dataset.replace
    const parent = a.parentNode
    a.remove()
    parent.innerHTML = content
  })
)

const easeInOut = (t, p = 5) =>
  t <= 0.5 ? Math.pow(t * 2, p) / 2 : 1 - Math.pow(2 - t * 2, p) / 2

qsa("[data-component='image-diff'").forEach(async (el) => {
  const difference = el.querySelector(".status-count")
  const dcanvas = el.querySelector("canvas.difference")
  const icanvas = el.querySelector("canvas.inspector")

  const a = await loadImage(el.dataset.imageA)
  const b = await loadImage(el.dataset.imageB)

  const dcontext = dcanvas.getContext("2d", { willReadFrequently: true })
  const icontext = icanvas.getContext("2d", { willReadFrequently: true })

  dcanvas.width *= window.devicePixelRatio
  dcanvas.height *= window.devicePixelRatio

  icanvas.width = dcanvas.width
  icanvas.height = dcanvas.height

  const { width, height } = dcanvas
  const weights = [0.299, 0.587, 0.114]

  const process = (ctx, x, y) => {
    const resize = el.resize ? el.resize.value : "stretch"
    const align = el.align ? el.align.value : "center"

    ctx.clearRect(0, 0, width, height)

    ctx.globalCompositeOperation = "source-over"
    drawImage(ctx, a, resize, align, x || y)

    if (x || y) {
      ctx.filter = "none"
      const f = dcanvas.width / dcanvas.offsetWidth
      const s = 3 * f
      const r = 100 * f
      x *= f
      y *= f

      ctx.save()

      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.arc(x, y - 0.001, r, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      drawImage(ctx, b, resize, align)
      ctx.restore()

      ctx.beginPath()
      ctx.moveTo(x + r - s / 2, y)
      ctx.arc(x, y - 0.001, r - s / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.strokeStyle = "#aaa3"
      ctx.lineWidth = s
      ctx.stroke()

      return
    }

    ctx.globalCompositeOperation = "difference"
    drawImage(ctx, b, resize, align)

    const { data } = ctx.getImageData(0, 0, width, height)

    ctx.fillStyle = "white"
    ctx.globalCompositeOperation = "color"
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = "difference"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#121e25"
    ctx.globalCompositeOperation = "lighten"
    ctx.fillRect(0, 0, width, height)

    const d =
      data.reduce(
        (m, a, i) =>
          m + (i % 4 === 3 ? 0 : easeInOut(a / 255, 1.25) * weights[i % 4])
      ) /
      (data.length * 0.25)

    difference.innerHTML = (d * 100).toFixed(1) + "%"
  }

  el.addEventListener("submit", (e) => {
    e.preventDefault()
  })

  el.addEventListener("input", () => {
    process(dcontext)
  })

  icanvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
  })

  icanvas.addEventListener("pointerenter", (e) => {
    el.classList.add("inspect")
    process(icontext, e.offsetX, e.offsetY)
  })

  icanvas.addEventListener("pointermove", (e) => {
    process(icontext, e.offsetX, e.offsetY)
  })

  icanvas.addEventListener("pointerleave", (e) => {
    el.classList.remove("inspect")
  })

  process(dcontext)
})

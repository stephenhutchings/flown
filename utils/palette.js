import fs from "node:fs/promises"

import Color from "color"
import quant from "@lokesh.dhakar/quantize"

import { colors } from "./flags.js"
import { byChroma, byHue, byLightness, byRainbow } from "./color.js"
import pretty from "./pretty.js"

const cellSize = 20

const wrap = (w, h, body) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}">${body}</svg>`
}

const render = (colors, filename) => {
  const rCount = colors.length > 40 ? 20 : 1
  const cCount = Math.floor(colors.length / rCount)
  const length = rCount * cCount

  if (length < colors.length) {
    console.log(
      `Trimming ${colors.length - length}/${
        colors.length
      } colors to create grid`
    )
    colors = colors.slice(0, length)
  }

  // Chunk into rows
  const rows = colors.slice(0, length).reduce(
    (m, e) => {
      if (m.at(-1).length < cCount) {
        m.at(-1).push(e)
      } else m.push([e])

      return m
    },
    [[]]
  )

  if (rows.length > 1) rows.forEach((row) => row.sort(byLightness))

  const svg = wrap(
    cCount * cellSize,
    rCount * cellSize,
    rows
      .map((colors, j) =>
        colors
          .map(
            (clr, i) =>
              `<rect 
          height="${cellSize}"
          width="${cellSize}"
          x="${i * cellSize}"
          y="${j * cellSize}"
          fill="${clr}" />`
          )
          .join("")
      )
      .join("")
  )

  fs.writeFile(filename, pretty(svg))
}

const generatePalette = (colors) => {
  const palette = [...colors].sort(byChroma)

  const lowChroma = palette.splice(0, colors.length * 0.1)
  const midChroma = palette.splice(0, colors.length * 0.2)

  midChroma.sort(byHue).reverse()

  palette.sort(byHue)

  palette.unshift(...lowChroma, ...midChroma)

  render(palette, `src/palette/all.svg`)
}

const generateSamples = () => {
  const sizes = [10, 12, 15, 16, 18, 20, 24, 32, 100]

  sizes.forEach((size) => {
    const palette = quant(
      colors.map((hex) => Color(hex).color),
      size
    )
      .palette()
      .map((arr) => Color(arr).hex())
      .sort(byRainbow)

    render(palette, `src/palette/${size}.svg`)
  })
}

generatePalette(colors)
generateSamples()

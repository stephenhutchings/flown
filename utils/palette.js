import fs from "node:fs/promises"
import path from "node:path"

import { optimize } from "svgo"
import Color from "color"
import quant from "@lokesh.dhakar/quantize"
import { closestLab, rgbaToLab } from "color-diff"

const cell = 10

const pretty = (svg) =>
  optimize(svg, {
    js2svg: {
      indent: 2,
      pretty: true,
    },
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeUnknownsAndDefaults: false,
          },
        },
      },
      "convertStyleToAttrs",
      "removeOffCanvasPaths",
      "reusePaths",
      {
        name: "removeAttrs",
        params: {
          attrs: "(version|enable-background|xml.space|baseProfile|overflow)",
        },
      },
    ],
  }).data

const wrap = (w, h, body) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${w} ${h}">${body}</svg>`
}

// Match hex codes and some named colors
// TODO: Match all CSS colors
const rx = /(gold|green|olive|purple|red|white|#[a-f0-9]{3}|#[a-f0-9]{6})\b/gi

const src = "src/clean"

const files = (await fs.readdir(src, { withFileTypes: true }))
  .map((file) => path.join(src, file.name))
  .filter((file) => path.extname(file) === ".svg")

const svgs = await Promise.all(files.map((svg) => fs.readFile(svg, "utf8")))

const colors = svgs
  .reduce((memo, svg) => {
    svg.match(rx)?.forEach((color) => {
      color = Color(color).rgb().array().join()
      if (!memo.includes(color)) memo.push(color)
    })

    return memo
  }, [])
  .map((str) => str.split(",").map((v) => +v))

const byHue = (a, b) => {
  // Shifting by 60° helps to group reds
  const ha = (Color(a).hsl().color[0] + 60) % 360
  const hb = (Color(b).hsl().color[0] + 60) % 360
  return ha - hb
}

const byShade = (a, b) => {
  const ha = Color(a).hsl().color[2]
  const hb = Color(b).hsl().color[2]
  return ha - hb
}

const renderPalette = () => {
  const rows = 20
  const cols = Math.floor(colors.length / rows)

  const length = rows * cols

  colors.sort(byHue)

  console.log(
    `Trimming ${colors.length - length}/${colors.length} colors to create grid`
  )

  // Chunk into rows
  const shades = colors.slice(0, length).reduce(
    (m, e) => {
      if (m.at(-1).length < cols) {
        m.at(-1).push(e)
      } else m.push([e])

      return m
    },
    [[]]
  )

  shades.forEach((colors) => colors.sort(byShade))

  const svg = wrap(
    cols * cell,
    rows * cell,
    shades
      .map((colors, j) =>
        colors
          .map(
            (clr, i) =>
              `<rect 
          height="${cell}"
          width="${cell}"
          x="${i * cell}"
          y="${j * cell}"
          fill="${Color(clr).hex()}" />`
          )
          .join("")
      )
      .join("")
  )

  fs.writeFile(`src/palette/all.svg`, pretty(svg))
}

const generatePaletteSamples = () => {
  const sizes = [10, 12, 15, 16, 18, 20, 24, 32, 100]

  sizes.forEach((size) => {
    const palette = quant(colors, size)
      .palette()
      .map((arr) => Color(arr).hex())
      .sort(byHue)

    const svg = wrap(
      size * cell,
      cell,
      palette
        .map(
          (clr, i) =>
            `<rect 
          height="${cell}"
          width="${cell}"
          x="${i * cell}"
          fill="${clr}" />`
        )
        .join("")
    )

    fs.writeFile(`src/palette/${size}.svg`, pretty(svg))
  })
}

const transformFlags = async () => {
  const custom = await fs.readFile("src/palette/custom-24.svg", "utf8")

  const map = (hex) => {
    const [r, g, b] = Color(hex).color
    const lab = rgbaToLab({ r, g, b })

    // In Lab colour space, "b" moves from blue to green, and violet to red
    // These distinctions are down-weighted when differentiating primaries
    // For example, orange-red difference is emphasised over that of pink-red
    lab.b *= 0.9

    return { ...lab, hex }
  }
  const palette = custom.match(rx).map(map)

  const frequency = {}

  svgs.forEach((svg, i) => {
    const res = svg.replace(rx, (c) => {
      c = closestLab(map(c), palette).hex

      frequency[c] ??= 0
      frequency[c]++

      return c
    })

    fs.writeFile(`src/recolored/${path.basename(files[i])}`, pretty(res))
  })

  console.log(frequency)
}

generatePaletteSamples()
renderPalette()
transformFlags()

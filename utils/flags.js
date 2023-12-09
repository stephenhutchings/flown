import fs from "node:fs/promises"
import path from "node:path"

import Color from "color"

import { matchColor } from "./color.js"

const src = "src/flags/redrawn"

export const files = (await fs.readdir(src, { withFileTypes: true }))
  .map((file) => path.join(src, file.name))
  .filter((file) => path.extname(file) === ".svg")

export const svgs = await Promise.all(
  files.map((svg) => fs.readFile(svg, "utf8"))
)

export const colors = svgs.reduce((memo, svg) => {
  svg.match(matchColor)?.forEach((color) => {
    color = Color(color).hex()
    if (!memo.includes(color)) memo.push(color)
  })

  return memo
}, [])

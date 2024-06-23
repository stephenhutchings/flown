import fs from "node:fs/promises"
import path from "node:path"

import Color from "color"
import { closestLab, rgbaToLab } from "color-diff"

import { matchColor } from "./color.js"
import { svgs, files } from "./flags.js"
import pretty from "./pretty.js"
import isValid from "./is-valid.js"

const PALETTE_SRC = "src/palette/custom-32.svg"

const transformFlags = async () => {
  const custom = await fs.readFile(PALETTE_SRC, "utf8")
  const flags = await fs
    .readFile("utils/flags.json", "utf8")
    .then((d) => JSON.parse(d))

  const map = (hex, id) => {
    const [r, g, b] = Color(hex).color
    const lab = rgbaToLab({ r, g, b })

    // In Lab colour space, "b" moves from blue to green, and violet to red
    // These distinctions are down-weighted when differentiating primaries
    // For example, orange-red difference is emphasised over that of pink-red
    lab.b *= 0.85
    lab.L *= 1.1

    if (r > 240 && g < 15 && b < 15) {
      lab.L *= 0.8
    }

    return { ...lab, id, hex, list: [], url: `/colors/${hex.slice(1)}/` }
  }

  const frequency = {}
  const palette = custom.match(matchColor).map(map)

  for (let i = 0; i < svgs.length; i++) {
    const slug = path.basename(files[i], ".svg")
    const data = flags.find((f) => f.slug === slug)
    const index = flags.indexOf(data)

    const res = svgs[i].replace(matchColor, (c) => {
      c = closestLab(map(c), palette)

      if (index >= 0 && !c.list.includes(index)) c.list.push(index)

      frequency[c.hex] ??= 0
      frequency[c.hex]++

      return c.hex
    })

    const output = pretty(res, false)

    fs.writeFile(`src/flags/recolored/${slug}.svg`, output, "utf8")

    if (!data) continue

    const source = await fs.readFile(`src/flags/source/${slug}.svg`, "utf8")

    data.colors = output
      .match(matchColor)
      .reduce((memo, hex) => (memo.includes(hex) ? memo : memo.concat(hex)), [])
      .map((hex) => palette.findIndex((c) => c.hex === hex))
      .sort((a, b) => a - b)

    data.size ??= {}
    data.size.source = source.length
    data.size.output = output.length
    data.size.compression = +(
      (100 * data.size.output) /
      data.size.source
    ).toFixed(1)

    const [valid, errors] = isValid(output)

    data.elementCount = output.slice(1).match(/<\w+ /g).length
    data.isValid = valid

    if (errors.length) data.errors = errors
    else delete data.errors
  }

  fs.writeFile("utils/flags.json", JSON.stringify(flags, null, 2))
  fs.writeFile("utils/palette.json", JSON.stringify(palette, null, 2))

  console.log(frequency)
}

transformFlags()

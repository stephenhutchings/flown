// Copies and optimizes files from the Wiki directory to the clean directory

import fs from "node:fs/promises"
import path from "node:path"

import { optimize } from "svgo"

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

const src = "src/flags/wiki/svg"

const files = (await fs.readdir(src, { withFileTypes: true }))
  .map((file) => path.join(src, file.name))
  .filter((file) => path.extname(file) === ".svg")

const svgs = await Promise.all(files.map((svg) => fs.readFile(svg, "utf8")))

const optimizeSource = () => {
  files.forEach((file, i) => {
    fs.writeFile("src/flags/redrawn" + path.basename(file), pretty(svgs[i]))
  })
}

optimizeSource()

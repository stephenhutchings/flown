import fs from "fs"
import highlight from "../../utils/highlight.js"

const flagsJson = fs.readFileSync("./utils/flags.json", "utf8")
const paletteJson = fs.readFileSync("./utils/palette.json", "utf8")

const flags = JSON.parse(flagsJson)
const palette = JSON.parse(paletteJson)

const regionGroups = flags.reduce((memo, flag) => {
  if (!memo[flag.region]) {
    memo[flag.region] = []
  }

  memo[flag.region].push(flag)

  return memo
}, {})

const regions = Object.keys(regionGroups)
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z\-]/g, ""),
    list: regionGroups[name],
  }))

const links = {
  npm: ["NPM", "https://npmjs.com/package/@sings/flown"],
  git: ["GitHub", "https://github.com/stephenhutchings/flown"],
}

export default {
  flags,
  regions,
  palette,
  links,
  filters: {
    highlight,
  },
  errorCodes: {
    todo: "This is a work in progress",
    size: "File size must be less than 10kb",
    stroke: "Strokes are not permitted",
    gradient: "Gradients are not permitted",
    elements: "Only <svg>, <path>, <defs>, <use> and <circle> are permitted",
    unit: "Only allow maximum of one-decimal place",
    ratio: "Standard size and ratio are used, unless square or non-rectangular",
    attribute: "Do not use advanced techniques to apply color",
  },
}

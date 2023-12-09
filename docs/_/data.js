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
}

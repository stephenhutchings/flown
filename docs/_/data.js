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

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z]/g, "")

const regions = Object.keys(regionGroups)
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({
    name,
    slug: slugify(name),
    list: regionGroups[name],
  }))

const links = {
  npm: ["NPM", "https://npmjs.com/package/@sings/flown"],
  git: ["GitHub", "https://github.com/stephenhutchings/flown"],
}

flags.forEach((flag) => {
  if (flag.tags.length === 0) {
    console.warn("No tags for", flag.name.short)
  }

  if (flag.colors.length === 2) flag.tags.push("Two colour")
  if (flag.colors.length === 3) flag.tags.push("Three colour")
  if (flag.colors.length === 4) flag.tags.push("Four colour")
})

const tags = Object.values(
  flags.reduce((memo, flag, i) => {
    flag.tags.forEach((tag) => {
      if (!memo[tag])
        memo[tag] = {
          title: tag,
          slug: slugify(tag),
          list: [],
        }

      memo[tag].list.push(i)
    })

    return memo
  }, {})
).sort((a, b) =>
  a.title.includes(" colour") && !b.title.includes(" colour")
    ? 1
    : !a.title.includes(" colour") && b.title.includes(" colour")
    ? -1
    : a.title.localeCompare(b.title)
)

export default {
  slugify,
  flags,
  regions,
  palette,
  links,
  tagList: tags,
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

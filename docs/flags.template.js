import { readFileSync } from "node:fs"
import flags from "../utils/flags.json"

const sets = [
  [3, 4],
  [4, 5],
  [5, 6],
  [8, 11, 12],
  [9, 10],
  [13, 14],
  [14, 15],
  [15, 16],
  [19, 20, 27],
  [21, 22],
  [22, 23],
  [23, 24],
  [25, 26],
  [29, 31],
]

const isSimilar = (a, b) => {
  return (
    a === b ||
    sets.filter((set) => set.includes(a)).some((set) => set.includes(b))
  )
}

export default {
  // Declare a layout for your product pages
  layout: "/_/layouts/flag",
  slug: "",

  render: ({ flag }) => readFileSync(`./src/flags/recolored/${flag.slug}.svg`),
  pages: flags
    .filter((flag) => flag.slug)
    .map((flag) => {
      const sameColors = flags.filter((other) => {
        return (
          flag.slug !== other.slug &&
          flag.colors.length === other.colors.length &&
          flag.colors.every((a) => other.colors.some((b) => a === b))
        )
      })

      return {
        title: `Flag of ${flag.official || flag.name} – flown`,
        url: `/flags/${flag.slug}/`,
        flag,
        sameColors,

        similarColors: flags.filter((other) => {
          return (
            flag.slug !== other.slug &&
            !sameColors.includes(other) &&
            flag.colors.length === other.colors.length &&
            flag.colors.every((a) => other.colors.some((b) => isSimilar(a, b)))
          )
        }),
      }
    }),
}

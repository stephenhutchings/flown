import { readFileSync } from "node:fs"
import data from "./_/data.js"

// prettier-ignore
const sets = [
  [1, 2],       // grey
  [4, 5],       // tan
  [5, 6],       // brown
  [8, 11, 12],  // orange
  [7, 9, 10],   // yellow/gold
  [13, 14, 15], // red
  [15, 16],     // darkred
  [19, 20, 26], // cyan/aqua/lightblue
  [20, 21],     // lightblue
  [21, 22],     // medblue
  [22, 23],     // darkblue1
  [23, 24],     // darkblue2
  [24, 25],     // darkblue3
  [26, 27],     // turquoise
  [28, 30],     // lightgreen
  [29, 31],     // darkgreen
]

const compareColors = (af, bf, fn) =>
  af.slug !== bf.slug &&
  af.colors.every((a) => bf.colors.some((b) => fn(a, b))) &&
  bf.colors.every((a) => af.colors.some((b) => fn(a, b)))

const isSame = (a, b) => a === b

const isSimilar = (a, b) =>
  a === b ||
  sets.filter((set) => set.includes(a)).some((set) => set.includes(b))

export default {
  // Declare a layout for your product pages
  layout: "/_/layouts/flag",
  slug: "",

  render: ({ flag }) => readFileSync(`./src/flags/recolored/${flag.slug}.svg`),
  pages: data.flags
    .filter((flag) => flag.slug)
    .map((flag) => {
      const sameColors = data.flags.filter((other) =>
        compareColors(flag, other, isSame)
      )

      const similarColors = data.flags.filter(
        (other) =>
          !sameColors.includes(other) && compareColors(flag, other, isSimilar)
      )

      return {
        title: `Flag of ${flag.name.official || flag.name.short} – flown`,
        url: `/flags/${flag.slug}/`,
        flag,
        sameColors,
        similarColors,
      }
    }),
}

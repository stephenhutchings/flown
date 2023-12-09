import { marked } from "marked"
import { markedSmartypants } from "marked-smartypants"

marked.use(markedSmartypants())

export default {
  src: "docs",
  data: "docs/_/data.js",
  watch: ["README.md"],
  watchAndRestart: ["utils/palette.json", "utils/flags.json"],
  copy: [
    {
      src: "docs/assets",
      dist: "dist/assets",
      include: "*.png",
    },
    {
      src: "src/palette",
      dist: "dist/assets/img/palette",
    },
    {
      src: "src/flags/source",
      dist: "dist/assets/img/flags/source",
    },
    {
      src: "src/flags/recolored/",
      dist: "dist/assets/img/flags/recolored",
    },
    {
      src: "src/flags/redrawn",
      dist: "dist/assets/img/flags/redrawn",
    },
  ],
  compilers: {
    pug: {
      options: {
        filters: {
          md: marked,
        },
      },
    },
  },
}

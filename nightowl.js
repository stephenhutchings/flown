import { marked } from "marked"
import { markedSmartypants } from "marked-smartypants"

import posthtml from "posthtml"
import baseUrl from "posthtml-base-url"

marked.use(markedSmartypants())

const transform = process.env.NIGHTOWL_MODE === "build" && [
  (content, filename) => {
    if (filename.endsWith(".html")) {
      return posthtml([
        baseUrl({
          url: "/flown",
          allTags: true,
        }),
      ])
        .process(content)
        .then((result) => result.html)
    } else {
      return content
    }
  },
]

export default {
  src: "docs",
  data: "docs/_/data.js",
  watch: ["README.md"],
  watchAndRestart: ["utils/palette.json", "utils/flags.json"],
  copy: [
    {
      src: "docs/assets",
      dist: "dist/assets",
      include: "**/*.svg",
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
  transform,
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

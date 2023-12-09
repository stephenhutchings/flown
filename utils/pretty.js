import { optimize } from "svgo"

export default (svg, pretty = true) =>
  optimize(svg, {
    js2svg: {
      indent: 2,
      pretty,
    },
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeUnknownsAndDefaults: false,
            moveGroupAttrsToElems: false,
          },
        },
      },
      "convertStyleToAttrs",
      "removeOffCanvasPaths",
      "reusePaths",
      {
        name: "convertPathData",
        params: {
          floatPrecision: 1,
        },
      },
      {
        name: "removeAttrs",
        params: {
          attrs: "(version|enable-background|xml.space|baseProfile|overflow)",
        },
      },
    ],
  }).data

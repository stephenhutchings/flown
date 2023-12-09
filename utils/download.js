import fs from "node:fs"
import path from "node:path"
import fetch from "node-fetch"

import data from "./flags.json" assert { type: "json" }

const keys = ["svg", "png"]
const output = {
  svg: "./src/flags/source",
  png: "./src/flags/wiki/png",
}

keys.forEach(async (key) => {
  const names = []

  await Promise.all(
    data.map(async (item) => {
      const res = await fetch(item[key])

      if (res.status === 200) {
        const ext = path.extname(item[key])
        const name = item.slug
        const file = path.join(output[key], ext.slice(1), name + ext)

        res.body.pipe(fs.createWriteStream(file))

        names.push(name)

        return {}
      } else {
        return { error: res.error, item }
      }
    })
  ).then((res) => {
    const errors = res.filter((f) => f.error)

    console.log(
      `Saved ${res.length - errors.length} of ${res.length} ${key} images`
    )

    if (errors.length) {
      console.log(`Some files could not be downloaded`)
      console.log(errors.map((f) => [f.error.status, f.item.name].join(" - ")))
    }
  })
})

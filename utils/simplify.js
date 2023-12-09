// Simple command line script to process path strings

import simplify from "simplify-js"
import svgpath from "svg-path-commander"

const TOLERANCE = Math.sqrt(2) / 2
const HIGHQUALITY = true
const SUBSAMPLE = 20

const string = process.argv[2]

if (!string) {
  throw Error("No string to process")
}

const sample = (t, p) => {
  t = 1 - t

  const matrix = [
    t * t * t,
    3 * t * t * (1 - t),
    3 * t * (1 - t) * (1 - t),
    (1 - t) * (1 - t) * (1 - t),
  ]

  let x = 0
  let y = 0

  matrix.forEach((m, i) => {
    x += p[i][0] * m
    y += p[i][1] * m
  })

  return [x, y]
}

const path = svgpath.normalizePath(string).reduce((m, cmd, i, arr) => {
  if (cmd[0] === "C") {
    const points = [arr[i - 1].slice(-2)]
    const length = SUBSAMPLE

    points.push([cmd[1], cmd[2]])
    points.push([cmd[3], cmd[4]])
    points.push([cmd[5], cmd[6]])

    return [
      ...m,
      ...Array.from({ length }, (n, i) => {
        const t = (i + 1) / length
        return ["L", ...sample(t, points)]
      }),
    ]
  } else return [...m, cmd]
}, [])

const segments = path
  .reduce((m, cmd) => {
    // Add the first point from the segment
    if (cmd[0] === "Z") {
      m.at(-1).push(m.at(-1)[0])
      return m
    }

    // Add a new segment
    if (cmd[0] === "M") m.push([])

    // Add the next point
    m.at(-1).push({ x: cmd[1], y: cmd[2] })

    return m
  }, [])
  .map((points) => {
    // Simplify, round, and then simplify again
    const pre = simplify(points, TOLERANCE, HIGHQUALITY)
    const rnd = pre.map(({ x, y }) => ({ x: Math.round(x), y: Math.round(y) }))
    return simplify(rnd, TOLERANCE, HIGHQUALITY)
  })

const simp = segments
  .map((line) => line.map((p, i) => [i === 0 ? "M" : "L", p.x, p.y]))
  .flat()

console.log(svgpath.pathToString(simp))

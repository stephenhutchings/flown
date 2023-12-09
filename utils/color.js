import cname from "color-name"
import Color from "color"

// Match hex codes and CSS color names
export const matchColor = new RegExp(
  `(#[a-f0-9]{3}|#[a-f0-9]{6}|${Object.keys(cname).join("|")})\\b`,
  "gi"
)

export const lch = (hex) => {
  const color = Color(hex)
  // Shifting the rotation helps to group reds and pinks
  return [color.luminosity(), color.chroma(), (color.hue() + 60) % 360]
}

export const byRainbow = (a, b) => {
  const [la, ca, ha] = lch(a)
  const [lb, cb, hb] = lch(b)

  const mc = 25

  // Sort low-chroma first...
  if (ca <= mc || cb <= mc) return cb > mc ? -1 : ca > mc ? 1 : 0

  // ...then by lightness for similar hues
  if (Math.abs(ha - hb) < 12) return lb - la

  // ...then by hue
  return hb - ha
}

export const byLightness = (a, b) => {
  return Color(a).l() - Color(b).l()
}

export const byChroma = (a, b) => {
  return Color(a).chroma() - Color(b).chroma()
}

export const byHue = (a, b) => {
  return lch(b)[2] - lch(a)[2]
}

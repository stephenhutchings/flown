export default (svg) => {
  // Flags must be less than 10kb
  if (svg.length > 10000) return false

  // Strokes and gradients are not permitted
  if (/stroke|gradient/.test(svg)) return false

  // Only a limited number of elements may be used
  if (/<(?!\/?(path|svg|g|use|circle|defs)[ >])/g.test(svg)) {
    return false
  }

  // Flags should match the standard proportions,
  // with the exception of for Switzerland and Nepal
  if (!/<svg[^>]+width="(1200|720|591)" height="720"/.test(svg)) return false

  return true
}

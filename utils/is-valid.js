export default (svg) => {
  const res = []

  // Flags must be less than 10kb
  if (svg.length > 10000) {
    res.push("size")
  }

  // Strokes are not permitted
  if (/stroke/.test(svg)) {
    res.push("stroke")
  }

  // Gradients are not permitted
  if (/gradient/.test(svg)) {
    res.push("gradient")
  }

  // Only a limited number of elements may be used
  if (/<(?!\/?(path|svg|g|use|circle|defs)[ >])/.test(svg)) {
    res.push("elements")
  }

  // Only allow maximum of one-decimal place
  if (/<\.\d{2}/.test(svg)) {
    res.push("unit")
  }

  // Do not use advanced techniques to apply color
  if (/fill-rule|blend-mode|opacity/.test(svg)) {
    res.push("attribute")
  }

  // Use standard proportions, barring Switzerland, Vatican and Nepal
  if (!/<svg[^>]+width="(1200|720|591)" height="720"/.test(svg)) {
    res.push("ratio")
  }

  return [res.length === 0, res]
}

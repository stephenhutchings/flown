import data from "./_/data.js"

export default {
  layout: "/_/layouts/color",
  slug: "",

  pages: data.palette.map((p) => ({
    ...p,
    title: `${p.hex} – flown`,
    slug: "",
  })),
}

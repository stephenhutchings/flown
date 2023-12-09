const scrollTo = (e) => {
  const target = document.querySelector(e.currentTarget.hash)

  if (
    target &&
    e.currentTarget.dataset.noscroll === undefined &&
    e.currentTarget.hash &&
    e.currentTarget.pathname === window.location.pathname &&
    !e.metaKey
  ) {
    e.preventDefault()
    target.scrollIntoView({
      behavior: "smooth",
    })
  }
}

Array.from(document.querySelectorAll("a[href*='#']")).forEach((a) =>
  a.addEventListener("click", scrollTo)
)

import prism from "prismjs"
import loadLanguages from "prismjs/components/index.js"

loadLanguages()

const token = (content, type) => `<span class="token ${type}">${content}</span>`

export default (code, language) => {
  if (!prism.languages[language]) {
    return code
  }

  code = prism.highlight(code, prism.languages[language], language)

  if (language === "svg") {
    code = code
      .replace(
        /<span class="token punctuation">"<\/span>([\d\-\. a-z\(\)]+)/gi,
        (w) => w.replace(/\-?\d*\.?\d+/g, (n) => token(n, "number"))
      )
      .replace(/#([\da-f]{6}|[\da-f]{3})/gi, (c) =>
        token(
          `<span class="color" style="background:${c}"></span>` + c,
          "color"
        )
      )
  }

  return code
}

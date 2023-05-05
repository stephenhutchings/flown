import fs from "fs"

const file = fs.readFileSync("./utils/flags.json", "utf8")
const json = JSON.parse(file)

export default {
  flags: json,
}

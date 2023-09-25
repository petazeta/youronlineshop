import {createRequire} from "module"

const require = createRequire(import.meta.url)

export const hosts = new Map(require("./hosts.json"))
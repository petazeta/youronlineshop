import {Node as ProtoNode, Linker as ProtoLinker} from "./nodes.mjs"
import userMixin from "../shared/usermixin.mjs"
import {userModelMixin} from "./usermixin.mjs"
import {safetyMixin} from "./safety.mjs"
import {promises as fs} from "fs"

export function setConstructors(dbGateway) {
  const nodesConstructorsMixin = Sup => class extends Sup {
    static get nodeConstructor(){
      return Node
    }
    static get linkerConstructor(){
      return Linker
    }
    static get userConstructor(){
      return User // never needed at the moment
    }
  }
  const nodeSettingsMixin = Sup => class extends Sup {
    static get dbGateway(){
      return dbGateway
    }
  }
  const Node = nodeSettingsMixin(nodesConstructorsMixin(safetyMixin(ProtoNode)))
  const Linker = nodeSettingsMixin(nodesConstructorsMixin(safetyMixin(ProtoLinker)))
  const User = userModelMixin(userMixin(Node))

  return [Node, Linker, User]
}

// generate mongodb like ids
// *** ponerle un counter
export class IdGenerator {
  constructor() {
    this.counter = parseInt(this.constructor.genRanHex(6), this.constructor.HEX) // used to gen id
    this.IdCounterNext = 1 // to keep account of number of ids
  }
  static genRanHex(size) {
    return [...Array(size)].map(() => this.toHex(Math.random() * this.HEX)).join('')
  }
  static toHex(n) {
    return Math.floor(n).toString(this.HEX)
  }
  static get HEX(){
    return 16
  }
  genId(){
    const unixTimeStampValue = ('0'.repeat(8) + this.constructor.toHex(Date.now() / 1000)).slice(-8)
    const ramdomValue = this.constructor.genRanHex(10)
    const countValue = ('0'.repeat(6) + this.constructor.toHex(this.counter)).slice(-6)

    if (++this.counter > parseInt("FFFFFF"))
      this.counter = 0
    ++this.idCounterNext

    return unixTimeStampValue + ramdomValue + countValue
  }
}

export const filterRow = (row, filterProp) => Object.entries(filterProp).every(([key, value])=>row[key] === value)
export const isDirExist = async path => await fs.access(path).then(()=>true).catch(()=>false) // File or dir exists
export const isDir = async path => (await isDirExist(path))? (await fs.lstat(path)).isDirectory() : false // dir exists
export const createFolder = async path => await isDirExist(path)? path : await fs.mkdir(path)

/*
function filterRow (row, filterProp) {
  for (const propName of Object.keys(filterProp)) {
    if (filterProp[propName] != row[propName])
      return false
  }
  return true
}
*/

export async function importSchema(schemaFilePath){
  const data = JSON.parse(await fs.readFile(schemaFilePath))
  const newTree = []
  for (const [key, value] of Object.entries(data)) {
    const newEntry = stringToCode(value)
    for (const [key, value] of Object.entries(newEntry)) {
      if (typeof value == "object")
        newEntry[key] = stringToCode(value)
    }
    newTree.push([key, newEntry])
  }
  return new Map(newTree)
  // helpers
  function stringToCode(myEntry){
    const newEntry = {}
    for (const [key, value] of Object.entries(myEntry)) {
      let match = /^\$\{(.+)\}$/.exec(value)
      if (match) {
        newEntry[key] = eval(match[1])
        continue
      }
      newEntry[key] = value
    }
    return newEntry
  }
}

export async function importPermissions(permissionsFilePath){
  const data = JSON.parse(await fs.readFile(permissionsFilePath))
  const mapEntitity = new Map()
  for (const entity of data) {
    mapEntitity.set(entity[0], new Map(entity[1]))
  }
  return mapEntitity
}

// it is a facilitie we dont need to use, but can be exectued for exporting mongodb data
export async function exportSchema(schema, schemaFilePath){
  const newTree = []
  const mySchema = Array.isArray(schema)? schema : Array.from(schema) // if schema is Map
  for (const [key, value] of mySchema) {
    const newEntry = typeToString(value)
    for (const [key, value] of Object.entries(newEntry)) {
      if (typeof value == "object")
        newEntry[key] = typeToString(value)
    }
    newTree.push([key, newEntry])
  }
  const jsonString = JSON.stringify(Object.fromEntries(newTree), null, 2)
  if (schemaFilePath)
    await fs.writeFile(schemaFilePath, jsonString)
  else
    return jsonString
  // helpers
  function typeToString(myEntry){
    const newEntry = {}
    for (const [key, value] of Object.entries(myEntry)) {
      if (typeof value == "function")
        newEntry[key] = value.name
      else
        newEntry[key] = value
    }
    return newEntry
  }
}
import {zip} from "../shared/utils.mjs"
import {join as pathJoin, basename, dirname} from "path"
import {promises as fs} from "fs"
import {IdGenerator, filterRow, isDirExist, createFolder} from "./dbutils.mjs"

// Añadir mode "~lax" para que lea columnas que no estan definidas en schema, quiza es en node.mjs
// Esta clase se debe de iniciar con init
export class DbGateway {
  constructor(basePath){
    this.tableList
    this.tableRef
    this.idGenerator = new IdGenerator()
    this.basePath = basePath
    this.cache = new Map()
    this.mode = {directInsert: false, autoId: false, cache: []} // directInsert: not check others positioning, autoId: (always create new id)
  }
  // schema
  async init(myUrl, schema, modeSettings, permissions, collectionMapping) {
    this.schema = schema
    this.permissions = permissions
    const urlObj = new URL(myUrl, "http://localhost")
    this.dataPath = pathJoin(this.basePath, basename(urlObj.pathname))
    await createFolder(this.basePath)
    await createFolder(this.dataPath)
    this.collectionsPath = pathJoin(this.dataPath, "collections")
    await createFolder(this.collectionsPath)
    this.setTableList(collectionMapping)
    this.setMode(modeSettings)
  }

  setMode(modeSettings={}){
    if (modeSettings.cache)
      modeSettings.cache = modeSettings.cache.map(collectionName=>this.tableList.get(collectionName))
    Object.assign(this.mode, modeSettings)
  }
  // Having the tableList allows to have a different set of table names at front-end or in node objects than the actual collection names in database
  // This can be useful if we are using a database that needs some special set of collection names but it is actually a residue from an older database system
  // and it could be in future bypassed
  setTableList(collectionMapping=x=>x) {
    if (!this.tableList) {
      this.tableList = new Map(this.getTables().map(tableName=>[collectionMapping(tableName), tableName]))
      this.tableRef = new Map(this.getTables().map(tableName=>[tableName, collectionMapping(tableName)]))
    }
    return this.tableList
  }

  getTables(){
    return Array.from(this.schema.keys())
  }

  async getDocuments(collectionName){
    if (this.cache.has(collectionName))
      return deepCopy(this.cache.get(collectionName))

    const documents = await this.readDocs(collectionName)
    if (this.mode.cache.includes(collectionName))
      this.cache.set(collectionName, documents)
    return deepCopy(documents)
  }
  // ensures cache performance for writeDoc
  async writeDocuments(collectionName, myRows){
    if (!Array.isArray(myRows))
      myRows = [myRows]
    if (this.mode.cache.includes(collectionName) && !this.cache.get(collectionName))
      await this.getDocuments(collectionName)  // in case documents arent cached we call getDocuments
    for (const myRow of myRows) {
      if (this.cache.get(collectionName))
        this.cache.get(collectionName).push(deepCopy(myRow)) // deepCopy ensures independence of data
      await this.writeDoc(collectionName, myRow)
    }
    return true
  }

  getForeignKeys(tableName) {
    return Object.entries(this.schema.get(tableName))
    .filter(([key, value])=>value?.ref)
    .map(([key, value])=>({name: key, parentTableName: value.ref.toString()}))
  }

  getDataTypes(tableName) {
    return new Map(Object.entries(this.schema.get(tableName))
    .map(([key, value])=>{
      const type = "type" in value? value.type : value
      return [key, type]
    }))
  }
  
  getRelationshipsFromTable(tableName) {
    return Array.from(this.schema).reduce((tot, [childTableName, model])=>{
      if (Object.entries(model).find(([key, value])=>value?.ref===tableName))
        tot.push({childTableName: childTableName, parentTableName: tableName, name: childTableName.toLowerCase()})
      return tot
    }, [])
  }
  // it gets collections related to tableName, returns an array
  getExtraParentsFromTable(tableName) {
    return Object.entries(this.schema.get(tableName))
    .filter(([key, value])=>value?.ref)
    .map(([key, value])=>({childTableName: tableName, parentTableName: value.ref.toString(), name: tableName.toLowerCase()}))
  }

  getTableKeys(tableName) {
    return Object.entries(this.schema.get(tableName))
    .map(([keyName, objType])=>{
      const key = {Field: keyName}
      if (keyName=="id")
        key.Primary = "yes"
      if (typeof objType == "object") {
        if (objType.type)
          key.Type = getType(objType.type)
        if (objType.positionRef) {
          key.Positioning = "yes"
          key.ref = objType.positionRef
        }
        if (objType.default) {
          key.Default = objType.default
        }
        return key
      }
      key.Type = getType(objType)
      return key
    })
    function getType(myType) {
      if (typeof myType != "function")
        return
      return myType.name
    }
  }

  async readDoc(collectionName, thisId){
    if (!collectionName || !thisId)
      return
    const row = JSON.parse(await fs.readFile(pathJoin(this.collectionsPath, collectionName, thisId + ".doc")))
    const primitives = [String, Number]
    const dataTypes = this.getDataTypes(collectionName)
    const typedRow = Object.fromEntries(Object.entries(row).map(([key, value])=>{
      if (value && dataTypes.get(key) && !primitives.includes(dataTypes.get(key))) {
        value = new (dataTypes.get(key))(value)
      }
      return [key, value]
    }))
    return typedRow
  }
  async readDocs(collectionName) {
    const documents = []
    const baseDir = pathJoin(this.collectionsPath, collectionName)
    if (await isDirExist(baseDir)) {
      for (const docFile of await fs.readdir(baseDir)) {
        let data = JSON.parse(await fs.readFile(pathJoin(baseDir, docFile)))
        documents.push(data)
      }
    }
    return documents
  }
  async writeDoc(collectionName, myRow){
    if (!collectionName || !myRow)
      return
    await createFolder(pathJoin(this.collectionsPath, collectionName))
    return await fs.writeFile(pathJoin(this.collectionsPath, collectionName, myRow.id + ".doc"), JSON.stringify(myRow))
  }
  async removeDoc(collectionName, thisId){
    return await fs.unlink(pathJoin(this.collectionsPath, collectionName, thisId + ".doc"))
  }

  async elementsFromTable(data, filterProp={}, limit=[], count=false) {
    const tableName = typeof data == "string"? data : data.props.childTableName
    const result = (await this.getDocuments(this.tableList.get(tableName)))
    .filter(row=>filterRow(row, filterProp))
    .slice(limit[0], limit[1])
    if (count) {
      return {total: result.length, data: null}
    }
    return {total: result.length, data: result}
  }

  async getRoot(foreignKey, data) {
    return (await this.getDocuments(this.tableList.get(data.props.childTableName))).find(row=>!row[foreignKey])
  }

  async getPartner(foreignKey, data, childId) {
    return await this.readDoc(this.tableList.get(data.props.parentTableName), (await this.readDoc(this.tableList.get(data.props.childTableName), childId))[foreignKey])
  }
  // foreigncolumnnames = array
  async getChildren(foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[], count=false) {
    // positioncolumnname not implemented
    Object.assign(filterProp, {[foreigncolumnnames[0]] : data.partner.props.id })
    if (foreigncolumnnames.length > 1 && extraParents) {
      Array.from(zip(foreigncolumnnames.slice(1), extraParents)).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), filterProp)
    }
    const result = (await this.getDocuments(this.tableList.get(data.props.childTableName)))
    .filter(row=>filterRow(row, filterProp))
    .slice(limit[0], limit[1])
    if (count) {
      return {total: result.length, data: null}
    }
    return {total: result.length, data: result}
  }

  async getMyProps(collectionName, thisId) {
    if (this.cache.has(collectionName))
      return (await this.getDocuments(collectionName)).find(row=>row.id==thisId)
    else
      return await this.readDoc(collectionName, thisId)
  }

  async createNew(collectionName, props={}) {
    const defaults = Object.fromEntries(Object.entries(this.schema.get(collectionName))
    .filter(([propName, propType])=>!propName in props || props[propName]===undefined)
    .filter(([propName, propType])=>"default" in propType)
    .map(([propName, propType])=>{
      const dataTypes = this.getDataTypes(collectionName)
      const primitives = [String, Number]
      let defaultValue = typeof propType.default == "function"?
        propType.default() : propType.default
      if (defaultValue && dataTypes.get(propName) && !primitives.includes(dataTypes.get(propName)))
        defaultValue = new (dataTypes.get(propName))(defaultValue)
      return [propName, defaultValue]
    }))
    const myProps = Object.assign(defaults, props)
    if (!myProps.id)
      myProps.id = this.idGenerator.genId()
    await this.writeDocuments(collectionName, myProps) // writeDocuments updates cache
    return deepCopy(myProps)
  }

  // return the inserted id or throw an error
  async insertChild(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) {
    const myProps = {...thisChild.props} //copy properties to not modify original element
    //add link relationships column properties
    let myforeigncolumnname
    if (foreigncolumnnames.length > 0 && data.partner?.props.id) {
      myforeigncolumnname = foreigncolumnnames[0]
      myProps[myforeigncolumnname] = data.partner.props.id
    }
    if (positioncolumnname && !myProps[positioncolumnname]) {
      // Insert to last position order by default
      myProps[positioncolumnname] = (await this.getDocuments(this.tableList.get(data.props.childTableName)))
      .filter(row=>myforeigncolumnname ? row[myforeigncolumnname]===data.partner.props.id : true)
      .reduce((cc, row)=>row[positioncolumnname] > cc ? row[positioncolumnname] : cc, 0) + 1
    }
    if (extraParents) {
      Array.from(zip(foreigncolumnnames.slice(1), extraParents)).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner?.props.id}), myProps)
    }
    //Now we add a value for the props that are null and cannot be null
    if (data.childTableKeysInfo) {
      data.childTableKeysInfo.filter(keyInfo=>keyInfo["Null"]=="NO" && !keyInfo["Default"] && keyInfo["Extra"]!="auto_increment").forEach(keyInfo=>{
        if (myProps[keyInfo["name"]]===null) {
          if (keyInfo["Type"]=="integer") {
            myProps[keyInfo["name"]] = 0
            return
          }
          myProps[keyInfo["name"]] = ""
        }
      })
    }
    if (this.mode.autoId && myProps.id)
      delete myProps.id //let it give the id
    thisChild.props = await this.createNew(this.tableList.get(data.props.childTableName), myProps)

    if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
      if (myforeigncolumnname)
        this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partner.props.id)
      else
        this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id)
    }
    return thisChild.props
  }
  // *** siblings order is not updated, no positioncolumnname is used ??
  async setChildLink(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) {
    const updateProp = {[foreigncolumnnames[0]]: data.partner.props.id}
    if (extraParents && foreigncolumnnames.length > 1) {
      Array.from(zip(foreigncolumnnames.slice(1), extraParents)).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), updateProp)
    }
    const myRow = (await this.getDocuments(this.tableList.get(data.props.childTableName))).find(row=>row.id===thisChild.props.id)
    await this.updateMe(this.tableList.get(data.props.childTableName), thisChild.props.id,  updateProp)
  }

  async deleteChildLink(collectionName, foreigncolumnname, childId) {
    const myProps = await this.getMyProps(collectionName, childId)
    myProps[foreigncolumnname] = null
    await this.getMyProps(collectionName, childId, myProps)
  }

  async deleteMe(collectionName, thisId) {
    if (this.cache.has(collectionName))
      this.cache.set(collectionName, this.cache.get(collectionName).filter(rec=>rec.id!=thisId))
    return await this.removeDoc(collectionName, thisId)
  }

  async updateMe(collectionName, thisId,  props) {
    const tableKeys = this.getTableKeys(collectionName).map(key=>key.Field)
    const dataProps = this.mode?.lax? props : Object.fromEntries(Object.keys(props).filter(key=>tableKeys.includes(key)).map(key=>[key, props[key]]))
    let myRow
    if (this.cache.has(collectionName)) {
      myRow = this.cache.get(collectionName).find(rec=>rec.id==thisId)
      Object.assign(myRow, dataProps)
    }
    if (!myRow) {
      myRow = await this.readDoc(collectionName, thisId)
      Object.assign(myRow, dataProps)
    }
    await this.writeDoc(collectionName, myRow)
    return myRow
  }

  async setSiblingsOrderOnUpdate(collectionName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) {
    if (this.mode.directInsert)
      return
    const siblingRow = (await this.getDocuments(collectionName)).find(row=>row[foreigncolumnname] === foreignId && row.id !== thisId && row[positioncolumnname] === newOrder)
    siblingRow[positioncolumnname] = oldOrder
    await this.writeDoc(collectionName, siblingRow)
  }

  async setSiblingsOrderOnDelete(collectionName, positioncolumnname, thisId, foreigncolumnname, foreignId) {
    if (this.mode.directInsert)
      return
    const collection = await this.getDocuments(collectionName)
    const actualPosition = collection.find(row=>row.id===thisId)[positioncolumnname]
    for (const row of collection
    .filter(row=>foreigncolumnname ? row[foreigncolumnname]===foreignId : true)
    .filter(row=>row[positioncolumnname] > actualPosition)) {
      row[positioncolumnname]--
      await this.writeDoc(collectionName, row)
    }
  }

  async setSiblingsOrderOnInsert(collectionName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) {
    if (this.mode.directInsert)
      return
    for (const row of (await this.getDocuments(collectionName)).filter(row=>foreigncolumnname ? row[foreigncolumnname]===foreignId : true)
    .filter(row=>row.id != thisId)
    .filter(row=>row[positioncolumnname] >= actualPosition)) {
      row[positioncolumnname]++
      await this.writeDoc(collectionName, row)
    }
  }
}
// value can be an object or an array of objects
function deepCopy(value) {
  if (!value)
    return value
  if (Array.isArray(value)) {
    const result = []
    for (const myRow of value) {
      result.push({...myRow})
    }
    return result
  }
  return {...value}
}
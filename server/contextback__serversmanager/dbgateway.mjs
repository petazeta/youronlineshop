import {zip} from "../../shared/utils.mjs"
import {getDbSchema} from "./dbschema.mjs"
import {join as pathJoin} from "path"
import {Services} from "../services.mjs"


// Esta clase se debe de iniciar con connect
export class ServiceDbGateway {
  constructor(contexts){
    this.contexts = contexts
    this.tableList
    this.tableRef
    this.model
    this.tables
    this.model = getDbSchema()
    this.setTableList()
    this.tables = makeTables(contexts)
  }

  setTableList() {
    if (!this.tableList) {
      this.tableList = new Map(this.getTables().map(tableName=>["TABLE_" + tableName.toUpperCase(), tableName]))
      this.tableRef = new Map(this.getTables().map(tableName=>[tableName, "TABLE_" + tableName.toUpperCase()]))
    }
    return this.tableList
  }

  getTables(){
    return Array.from(this.model.keys())
  }

  getForeignKeys(tableName) {
    return Object.entries(this.model.get(tableName)).filter(([key, value])=>value?.ref)
    .map(([key, value])=>({name: key, parentTableName: value.ref.toString()}))
  }
  
  getRelationshipsFromTable(tableName) {
    return Array.from(this.model).reduce((tot, [childTableName, model])=>{
      if (Object.entries(model).find(([key, value])=>value?.ref===tableName))
        tot.push({childTableName: childTableName, parentTableName: tableName, name: childTableName.toLowerCase()})
      return tot
    }, [])
  }
  // it gets collections related to tableName, returns an array
  getExtraParentsFromTable(tableName) {
    return Object.entries(this.model.get(tableName))
    .filter(([key, value])=>value?.ref)
    .map(([key, value])=>({childTableName: tableName, parentTableName: value.ref.toString(), name: tableName.toLowerCase()}))
  }

  getTableKeys(tableName) {
    return Object.entries(this.model.get(tableName))
    .map(([keyName, keyProps])=>{
      const key = {Field: keyName, Type: "text"}
      if (keyName=="id")
        key.Primary = "yes"
      const objType = keyProps
      if (typeof objType == "function") {
        if (objType.name=="Number")
          key.Type = "integer"
        return key
      }
      if (typeof objType == "object") {
        if (objType.type) {
          if (objType.type.name=="Number")
            key.Type = "integer"
        }
        if (objType.positionRef) {
          key.Positioning = "yes"
          key.ref = objType.positionRef
        }
        return key
      }
    })
  }

  elementsFromTable(data, filterProp={}, limit=[]) {
    const result = this.tables.get(this.tableList.get(data.props.childTableName))
    .filter(row=>filterRow(row, filterProp))
    .slice(limit[0], limit[1])
    return {total: result.length, data: result}
  }

  getRoot(foreignKey, data) {
    return this.tables.get(this.tableList.get(data.props.childTableName)).find(row=>!row[foreignKey])
  }

  getPartner(foreignKey, data, childId) {
  // query encontramos child, de el populate parent
    const result = this.tables.get(this.tableList.get(data.props.childTableName))
    .find(row=>row.id==childId)
    if (result && result[foreignKey]) {
      return result[foreignKey]
    }
  }
  // foreigncolumnnames = array
  getChildren(foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[], count=false) {
    // positioncolumnname not implemented
    Object.assign(filterProp, {[foreigncolumnnames[0]] : data.partner.props.id })
    if (foreigncolumnnames.length > 1 && extraParents) {
      Array.from(zip(foreigncolumnnames.slice(1), extraParents)).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), filterProp)
    }
    const result = this.tables.get(this.tableList.get(data.props.childTableName))
    .filter(row=>filterRow(row, filterProp))
    .slice(limit[0], limit[1])
    if (count) {
      return {total: result.length, data: null}
    }
    return {total: result.length, data: result}
  }

  getMyProps(tableName, thisId) {
    return this.tables.get(tableName).find(row=>row.id==thisId)
  }

  async createNew(tableName, props={}) {
    if (tableName!="Services")
      throw new Error("Error tableName create New service")
    //console.log(contexts.get(this.tables.get("Contexts").find(row=>row.id==props.parentContexts)?.name))
    const serviceContext = this.contexts.get(this.tables.get("Contexts").find(row=>row.id==props.parentContexts)?.name)
    const tableKeys = this.getTableKeys(tableName).map(key=>key.Field)
    const dataProps = Object.fromEntries(Object.keys(props).filter(key=>tableKeys.includes(key)).map(key=>[key, props[key]]))
    await serviceContext.services.insertService(dataProps)
    // Now we insert the table row
    const position = this.tables.get(tableName).push(props)
    this.tables.get(tableName)[position - 1].id = position
    return position
  }

  // return the inserted id or throw an error
  async insertChild(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) {
    console.log(this.tables)
    const myProps = {...thisChild.props} //copy properties to not modify original element
    //add link relationships column properties
    let myforeigncolumnname
    if (foreigncolumnnames.length > 0 && data.partner?.props.id) {
      myforeigncolumnname = foreigncolumnnames[0]
      myProps[myforeigncolumnname] = data.partner.props.id
    }
    if (positioncolumnname && !myProps[positioncolumnname]) {
      // Insert to last position order by default
      myProps[positioncolumnname] = this.tables.get(this.tableList.get(data.props.childTableName))
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
    if (myProps.id)
      delete myProps.id //let it give the id
    thisChild.props.id = await this.createNew(this.tableList.get(data.props.childTableName), myProps)

    if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
      if (myforeigncolumnname)
        this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partner.props.id)
      else
        this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id)
    }
    console.log(this.tables)
    return thisChild.props.id
  }
  // *** siblings order is not updated, no positioncolumnname is used
  async setChildLink(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) {
    const updateProp = {[foreigncolumnnames[0]]: data.partner.props.id}
    if (extraParents && foreigncolumnnames.length > 1) {
      Array.from(zip(foreigncolumnnames.slice(1), extraParents)).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), updateProp)
    }
    const myRow = this.tables.get(this.tableList.get(data.props.childTableName)).find(row=>row.id===thisChild.props.id)
    await this.updateMe(data.props.childTableName, thisChild.props.id,  updateProp)
  }

  async deleteChildLink(tableName, foreigncolumnname, childId) {
    // return await this.dbLink.model(tableName).findByIdAndUpdate(childId, {[foreigncolumnname]: null});
  }

  async deleteMe(tableName, thisId) {
    let rowIndex
    const myRow = this.tables.get(this.tableList.get(data.props.childTableName)).find(([row, i])=>{
      if (row.id===thisId) {
        rowIndex = i
        return true
      }
    })
    const serviceContext = this.contexts.get(this.tables.get("Contexts").find(row=>row.id==myRow.parentContexts)?.name)
    this.tables.get(tableName).splice(rowIndex, 1)
    await serviceContext.removeService(myRow.positionContexts)
  }

  async updateMe(tableName, thisId,  props) {
    const tableKeys = this.getTableKeys(tableName).map(key=>key.Field)
    const dataProps = Object.fromEntries(Object.keys(props).filter(key=>tableKeys.includes(key)).map(key=>[key, props[key]]))
    const myRow = this.tables.get(tableName).find(row=>row.id===thisId)
    Object.assign(myRow, dataProps)
    const serviceContext = this.contexts.get(this.tables.get("Contexts").find(row=>row.id==props.parentContexts)?.name)
    await serviceContext.services.updateService(myRow)
  }

  async setSiblingsOrderOnUpdate(tableName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) {
    const siblingRow = this.tables.get(tableName).find(row=>row[foreigncolumnname] === foreignId && row.id !== thisId && row[positioncolumnname] === newOrder)
    siblingRow[positioncolumnname] = oldOrder
    const serviceContext = this.contexts.get(this.tables.get("Contexts").find(row=>row.id==siblingRow.parentContexts)?.name)
    await serviceContext.services.updateService(siblingRow)
  }

  setSiblingsOrderOnDelete(tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) {
    const actualPosition = this.tables.get(tableName).find(row=>row.id===thisId)[positioncolumnname]
    this.tables.get(tableName)
    .filter(row=>foreigncolumnname ? row[foreigncolumnname]===foreignId : true)
    .filter(row=>row[positioncolumnname]>actualPosition)
    .forEach(row=>row[positioncolumnname]--)
  }

  setSiblingsOrderOnInsert(tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) {
    console.log("setting Sibblings", tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId)
    this.tables.get(tableName)
    .filter(row=>foreigncolumnname ? row[foreigncolumnname]===foreignId : true)
    .filter(row=>row[positioncolumnname] >= actualPosition)
    .forEach(row=>row[positioncolumnname]++)
  }
}

// Helpers

const filterRow = (row, filterProp) =>{
    for (const propName of Object.keys(filterProp)) {
      if (filterProp[propName] != row[propName])
        return false
    }
    return true
  }
function makeTables(contexts){
  return new Map([
    [
      "Contexts",
      [
        {id: 1, name: "root"},
        ...Array.from(contexts).map(([contextName, contextValue], contextIndex)=>({name: contextName, folderName: contextValue.folderName, parentContexts: 1, positionContexts: contextIndex + 1, id: contextIndex + 1 + 1}))
      ]
    ],
    [
      "Services",
      Array.from(contexts)
      .reduce((tot, [contextName, contextValue], contextIndex)=>tot.concat(contextValue.services.serviceList.map((service, serviceIndex)=>{
        const result = Object.fromEntries([...service].filter(([key, value])=>key.search(/^_/)!==0)) // [...service] equivalent to Array.from(service). service is a Map
        result.id = contextIndex + serviceIndex + 1
        result.parentContexts = contextIndex + 1 + 1 // The first one is the root => + 2
        result.positionContexts = serviceIndex + 1
        return result
      })), [])
    ],
  ])
}
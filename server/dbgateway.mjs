// Parece que con mongoose no es necesario pasar a ObjectId el id cuyo formato es string
import mongoose from "mongoose";
import {zip} from "../shared/utils.mjs"


// Esta clase se debe de iniciar con connect
export class SiteDbGateway {
  constructor(){
    this.tableList
    this.tableRef
    this.dbLink
  }

  // La creación de conexión mediante mongoose se puede hacer con createConnection y con connect.
  // CreateConnection permite establecer diferentes conexiones mientras que connect solo se refiere a la conexión por defecto
  // Nosotros establecemos diferentes conexiones para permitir el uso de este módulo por aplicaciones independientes
  async connect(cfgUrl, setDbSchema) {
    if (this.dbLink)
      return this.dbLink
    mongoose.set("strictQuery", false)
    this.dbLink=mongoose.createConnection(cfgUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    //this.dbLink=mongoose.connection;
    if (setDbSchema)
      setDbSchema(this.dbLink)
    this.setTableList()
    return new Promise((resolve, reject) => {
      this.dbLink.on("error", err => {      
        console.log("db connect error: ", err)
        this.dbLink = false
        reject(err.stack)
      });
      this.dbLink.once("open", ()=>resolve(this.dbLink))
    })
  }

  setTableList() {
    if (!this.tableList) {
      this.tableList = new Map(this.getTables().map(tableName=>["TABLE_" + tableName.toUpperCase(), tableName]))
      this.tableRef = new Map(this.getTables().map(tableName=>[tableName, "TABLE_" + tableName.toUpperCase()]))
    }
    return this.tableList
  }

  getTables(){
    return Array.from(Object.keys(this.dbLink.models))
  }

  getForeignKeys(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree)
    .filter(([key, value])=>value?.ref)
    .map(([key, value])=>({name: key, parentTableName: value.ref.toString()}))
  }

  getRelationshipsFromTable(tableName) {
    return Object.entries(this.dbLink.models).reduce((tot, [childTableName, model])=>{
      if (Object.entries(model.schema.tree).find(([key, value])=>value?.ref===tableName))
        tot.push({childTableName: childTableName, parentTableName: tableName, name: childTableName.toLowerCase()});
      return tot
    }, [])
  }
  // it gets collections related to tableName, returns an array
  getExtraParentsFromTable(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree)
    .filter(([key, value])=>value?.ref)
    .map(([key, value])=>({childTableName: tableName, parentTableName: value.ref.toString(), name: tableName.toLowerCase()}))
  }

  getTableKeys(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree)
    .filter(([keyName, keyProps])=>!["_id", "__v"].includes(keyName))
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

  async elementsFromTable(data, filterProp={}, limit=[]) {
    let offset, max;
    if (limit.length == 2) {
      offset = limit[0];
      max = limit[1] - limit[0]
    }
    let query = this.dbLink.model(this.tableList.get(data.props.childTableName)).find(filterProp)
    if (max)
      query = query.limit(max)
    if (offset)
      query = query.skip(offset)
    const result = (await query.exec()).map(mo=>mo.toJSON())
    return {total: result.length, data: result}
  }

  async getRoot(foreignKey, data) {
    return (await this.dbLink.model(this.tableList.get(data.props.childTableName)).findOne({$or: [{[foreignKey] : null}, {[foreignKey] : {$exists: false}}]}))?.toJSON()
  }

  async getPartner(foreignKey, data, childId) {
  // query encontramos child, de el populate parent
    const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).findOne({_id: childId}).populate(foreignKey) // *** better change for findOne for findById
    if (result && result[foreignKey]) {
      return result[foreignKey].toJSON();
    }
  }

  async getChildren(foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[], count=false) {
    Object.assign(filterProp, {[foreigncolumnnames[0]] : data.partner.props.id });
    if (foreigncolumnnames.length > 1 && extraParents) {
      zip(foreigncolumnnames.slice(1), extraParents).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), filterProp)
    }
    let query = this.dbLink.model(this.tableList.get(data.props.childTableName)).find(filterProp)
    if (positioncolumnname) {
       query.sort({[positioncolumnname] : 1})
    }
    if (limit.length == 2) {
      let offset=limit[0];
      let max=limit[1] - limit[0];
      if (max) query=query.limit(max);
      if (offset) query=query.skip(offset);
    }
    if (count) {
      const result = await query.countDocuments().exec() // count(true) => with limit
      return {total: result, data: null};
    }
    const result = (await query.exec()).map(mo=>mo.toJSON());
    return {total: result.length, data: result};
  }

  async getMyProps(tableName, thisId) {
    return await this.dbLink.model(tableName).findById(thisId)
  }

  async createNew(tableName, props={}) {
    return (await this.dbLink.model(tableName).create(props))?._id
  }

  // return the inserted id or throw an error
  // extraParents: ordered in the same way as foregincolumnnames
  async insertChild(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) {
    const myProps={...thisChild.props} //copy properties to not modify original element
    //add link relationships column properties
    let myforeigncolumnname
    if (foreigncolumnnames.length > 0 && data.partner?.props.id) {
      myforeigncolumnname=foreigncolumnnames[0]
      myProps[myforeigncolumnname]=data.partner.props.id;
    }
    if (positioncolumnname && !myProps[positioncolumnname]) {
      // Insert to last position order by default
      let positionRq = {}
      if (myforeigncolumnname)
        positionRq={[myforeigncolumnname] : data.partner.props.id}
      const result = await this.dbLink.model(this.tableList.get(data.props.childTableName))
      .findOne(positionRq, {[positioncolumnname]: 1, _id:0})
      .sort({[positioncolumnname]:-1})
      if (!result || !result[positioncolumnname]) myProps[positioncolumnname]=1
      else myProps[positioncolumnname]=result[positioncolumnname] + 1
    }
    if (extraParents) {
      // it assumes extraParents are ordered
      zip(foreigncolumnnames.slice(1), extraParents).reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner?.props.id}), myProps), myProps
    }
    if (myProps.id) delete myProps.id //let it give the id
    thisChild.props.id = await this.createNew(this.tableList.get(data.props.childTableName), myProps);
    //We have to update sort_order of the siblings 
    if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
      if (myforeigncolumnname)
        await this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partner.props.id)
      else
        await this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id)
    }
    return thisChild.props.id;
  }
  // *** it seems that positioncolumnname is not used and siblings order are not updated
  async setChildLink(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) {
    const updateProp = {[foreigncolumnnames[0]]: data.partner.props.id};
    if (extraParents && foreigncolumnnames.length > 1) {
      foreigncolumnnames.slice(1), extraParents.reduce((tot, [key, value])=>Object.assign(tot, {[key]: value.partner.props.id}), updateProp)
    }
    return await this.dbLink.model(this.tableList.get(data.props.childTableName)).findByIdAndUpdate(thisChild.props.id, updateProp)
  }

  async deleteChildLink(tableName, foreigncolumnname, childId) {
    return await this.dbLink.model(tableName).findByIdAndUpdate(childId, {[foreigncolumnname]: null});
  }

  async deleteMe(tableName, thisId) {
    return await this.dbLink.model(tableName).findByIdAndDelete(thisId);
  }
  // it doesnt take in account if the update is about the position for updating siblings. That is managed by by Node object.
  async updateMe(tableName, thisId,  props) {
    await this.dbLink.model(tableName).findByIdAndUpdate(thisId, props)
    return props
  }

  async setSiblingsOrderOnUpdate(tableName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) {
    await this.dbLink.model(tableName).findOneAndUpdate({ [foreigncolumnname]: foreignId, _id: {$ne: thisId}, [positioncolumnname]: newOrder},  {[positioncolumnname]: oldOrder});
    return 1;
  }

  async setSiblingsOrderOnDelete(tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) {
    debugger
    const actualPosition = (await this.dbLink.model(tableName).findById(thisId, positioncolumnname)).toObject()[positioncolumnname]
    let findQuery = this.dbLink.model(tableName).find({ [positioncolumnname]: { $gt: actualPosition } })
    if (foreigncolumnname) findQuery=findQuery.find({ [foreigncolumnname]: foreignId })
    const result = await findQuery.exec()
    for (const elm of result) {
      elm[positioncolumnname]--
      await elm.save()
    }
    return result.length
  }

  async setSiblingsOrderOnInsert(tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) {
    let findQuery= this.dbLink.model(tableName).find({ [positioncolumnname]: { $gte: actualPosition} , _id: {$ne: thisId} })
    if (foreigncolumnname) findQuery = findQuery.find({ [foreigncolumnname]: foreignId })
    const result = await findQuery.exec()
    for (const elm of result) {
      elm[positioncolumnname]++
      await elm.save()
    }
    return result.length
  }
}

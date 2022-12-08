import mongoose from 'mongoose';
import {setDbSchema} from './dbschema.mjs';

export default class SiteDbGateway {
  constructor(){
    this.tableList;
    this.tableRef;
    this.dbLink;
  }

  async connect(cfgUrl) {
    if (this.dbLink) return this.dbLink;
    mongoose.connect(cfgUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.dbLink=mongoose.connection;
    setDbSchema();
    return new Promise((resolve, reject) => {
      this.dbLink.on("error", err => {      
        console.log("db connect error: ", err);
        this.dbLink=false;
        reject(err.stack);
      });
      this.dbLink.once("open", ()=>resolve(this.dbLink));     
    });
  }

  setTableList() {
    if (!this.tableList) {
      this.tableList=new Map(this.getTables().map(tableName=>['TABLE_' + tableName.toUpperCase(), tableName]));
      this.tableRef=new Map(this.getTables().map(tableName=>[tableName, 'TABLE_' + tableName.toUpperCase()]));
    }
    return this.tableList;
  }

  getTables(){
    return Array.from(Object.keys(this.dbLink.models))
  }

  getForeignKeys(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree).filter(([key, value])=>value?.ref)
    .map(([key, value])=>({name: key, parentTableName: value.ref.toString()}));
  }

  getRelationshipsFromTable(tableName) {
    return Object.entries(this.dbLink.models).reduce((tot, [childTableName, model])=>{
      if (Object.entries(model.schema.tree).find(([key, value])=>value?.ref===tableName))
        tot.push({childTableName: childTableName, parentTableName: tableName, name: childTableName.toLowerCase()});
      return tot;
    }, []);
  }

  getExtraParentsFromTable(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree).filter(([key, value])=>value?.ref)
    .map(([key, value])=>({childTableName: tableName, parentTableName: value.ref.toString(), name: tableName.toLowerCase()}));
  }

  async setSiblingsOrderOnUpdate(tableName, positioncolumnname, thisId, newOrder, oldOrder, foreigncolumnname, foreignId) {
    await this.dbLink.model(tableName).findOneAndUpdate({ [foreigncolumnname]: { $eq: foreignId }, _id: {$ne: thisId}, [positioncolumnname]: newOrder},  {[positioncolumnname]: oldOrder});
    return 1;
  }

  async setSiblingsOrderOnDelete(tableName, positioncolumnname, thisId, foreigncolumnname, foreignId) {
    const actualPosition = (await this.dbLink.model(tableName).findById(thisId, positioncolumnname)).toObject()[positioncolumnname];
    let findQuery= this.dbLink.model(tableName).find({ [positioncolumnname]: { $gt: actualPosition } });
    if (foreigncolumnname) findQuery=findQuery.find({ [foreigncolumnname]: { $eq: foreignId } });
    const result =await findQuery.exec();
    for (const elm of result) {
      elm[positioncolumnname]--;
      await elm.save();
    }
    return result.length;
  }

  async setSiblingsOrderOnInsert(tableName, positioncolumnname, actualPosition, thisId, foreigncolumnname, foreignId) {
    let findQuery= this.dbLink.model(tableName).find({ [positioncolumnname]: { $gte: actualPosition} , _id: {$ne: thisId} });
    if (foreigncolumnname) findQuery=findQuery.find({ [foreigncolumnname]: { $eq: foreignId } });
    const result =await findQuery.exec();
    for (const elm of result) {
      elm[positioncolumnname]++;
      await elm.save();
    }
    return result.length;
  }

  getTableKeys(tableName) {
    return Object.entries(this.dbLink.model(tableName).schema.tree)
    .filter(([keyName, keyProps])=>!["_id", "__v"].includes(keyName))
    .map(([keyName, keyProps])=>{
      const key={Field: keyName, Type: "text"};
      if (keyName=='id') key.Primary="yes";
      const objType = keyProps;
      if (typeof objType == 'function') {
        if (objType.name=="Number") key.Type="integer";
        return key;
      }
      if (typeof objType == 'object') {
        if (objType.type) {
          if (objType.name=="Number") key.Type="integer";
        }
        if (objType.positionRef) {
          key.Positioning="yes";
          key.ref=objType.positionRef;
        }
        return key;
      }
    });
  }

  async createNew(tableName) {
    const result=await this.dbLink.model(tableName).create({});
    return result._id;
  }

  async elementsFromTable(data, filterProp={}, limit=[]) {
    let offset, max;
    if (limit.length == 2) {
      offset=limit[0];
      max=limit[1] - limit[0];
    }
    let query = this.dbLink.model(this.tableList.get(data.props.childTableName)).find(filterProp);
    if (max) query=query.limit(max);
    if (offset) query=query.skip(offset);
    const result = (await query.exec()).map(mo=>mo.toJSON());
    return {total: Object.entries(result).length, data: result};
  }

  // it returns an array of one element, of nothing found an empty array
  async getRoot(foreignKey, data) {
    const myReturn=[];
    const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).findOne({$or: [{[foreignKey] : null}, {[foreignKey] : {$exists: false}}]});
    if (result) return result.toJSON();
  }

  async getPartner(foreignKey, data, childId) {
  // query encontramos child, de el populate parent
    const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).findOne({_id: childId}).populate(foreignKey);
    if (result && result[foreignKey]) {
      return result[foreignKey].toJSON();
    }
  }

  async getChildren(foreigncolumnnames, positioncolumnname, data, extraParents=null, filterProp={}, limit=[], count=false) {
    let query = this.dbLink.model(this.tableList.get(data.props.childTableName)).find(Object.assign(filterProp, {[foreigncolumnnames[0]] : { $eq: data.partner.props.id } }));
    for (let i=1; i<foreigncolumnnames.length; i++) {
      query = query.find({[foreigncolumnnames[i]]: {$eq: extraParents[i-1].partner.props.id}});
    }
    if (positioncolumnname) {
       query = query.sort({[positioncolumnname] : 1})
    }
    if (limit.length == 2) {
      let offset=limit[0];
      let max=limit[1] - limit[0];
      if (max) query=query.limit(max);
      if (offset) query=query.skip(offset);
    }
    if (count) {
      const result = await query.count().exec(); // count(true) => with limit
      return {total: result, data: null};
    }
    const result = (await query.exec()).map(mo=>mo.toJSON());
    return {total: result.length, data: result};
  }

  // return the inserted id or throw an error
  async insertChild(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents, updateSiblingsOrder) {
    const myProps={...thisChild.props}; //copy properties to not modify original element
    //add link relationships column properties
    let myforeigncolumnname;
    if (foreigncolumnnames.length > 0 && data.partner?.props.id) {
      myforeigncolumnname=foreigncolumnnames[0];
      myProps[myforeigncolumnname]=data.partner.props.id;
    }
    if (positioncolumnname && !myProps[positioncolumnname]) {
      // Insert to last position order by default
      let positionRq={}
      if (myforeigncolumnname) positionRq={[myforeigncolumnname] : data.partner.props.id}
      const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).findOne(positionRq, {[positioncolumnname]: 1, _id:0}).sort({[positioncolumnname]:-1});
      if (!result || !result[positioncolumnname]) myProps[positioncolumnname]=1;
      else myProps[positioncolumnname]=result[positioncolumnname] + 1;
    }
    if (extraParents) {
      for (let i=1; i<foreigncolumnnames.length; i++) {
        if (extraParents[i-1].partner.props.id) myProps[foreigncolumnnames[i]]=extraParents[i-1].partner.props.id;
      }
    }
    //Now we add a value for the props that are null and cannot be null
    if (data.childTableKeysInfo && data.sysChildTableKeys) {
      /*
      for (const key in data.childTableKeys) {
        let value=data.childTableKeys[key];
        if (data.childTableKeysInfo[key]["Null"]=='NO' && !data.childTableKeysInfo[key]["Default"] && data.childTableKeysInfo[key].Extra!='auto_increment'){
          if (!Object.keys(myProps).includes(value) || myProps[value]===null) {
            if (data.childTableKeysInfo[key].Type.includes('int') || data.childTableKeysInfo[key].Type.includes('decimal')) {
              myProps[value]=0;
            }
            else {
              myProps[value]='';
            }
          }
        }
      }
      */

      data.childTableKeys.filter((key, i)=>data.childTableKeysInfo[i]["Null"]=='NO' && !data.childTableKeysInfo[i]["Default"] && data.childTableKeysInfo[i].Extra!='auto_increment').forEach((key, i)=>{
        if (Object.keys(myProps).includes(key) && myProps[key]!==null) return;
        if (data.childTableKeysInfo[i].Type.includes('int') || data.childTableKeysInfo[i].Type.includes('decimal')) {
          myProps[key]=0;
          return;
        }
        myProps[key]='';
      });

    }
    if (myProps.id) delete myProps.id; //let it give the id
    if (Object.keys(myProps).length==0) {
      thisChild.props.id = await this.createNew(this.tableList.get(data.props.childTableName));
    }
    else {
      const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).create(myProps);
      thisChild.props.id=result._id;
    }
    //We have to update sort_order of the siblings 
    if (updateSiblingsOrder && positioncolumnname && myProps[positioncolumnname]) {
      if (myforeigncolumnname) await this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id, myforeigncolumnname, data.partner.props.id);
      else await this.setSiblingsOrderOnInsert(this.tableList.get(data.props.childTableName), positioncolumnname, myProps[positioncolumnname], thisChild.props.id);
    }
    return thisChild.props.id;
  }

  async setChildLink(foreigncolumnnames, positioncolumnname, data, thisChild, extraParents) {
    const updateProps = {[foreigncolumnnames[0]]: data.partner.props.id};
    if (extraParents) {
      for (let i=1; i<foreigncolumnnames.length; i++) {
        Object.assing(updateProps, {[foreigncolumnnames[i]]: extraParents[i-1].partner.props.id});
      }
    }
    const result = await this.dbLink.model(this.tableList.get(data.props.childTableName)).findByIdAndUpdate(thisChild.props.id, updateProps);
    return result;
  }

  async deleteChildLink(tableName, foreigncolumnname, childId) {
    return await this.dbLink.model(tableName).findByIdAndUpdate(childId, {[foreigncolumnname]: null});
  }

  async getMyProps(tableName, thisId) {
    return await this.dbLink.model(tableName).findById(thisId);
  }

  async deleteMe(tableName, thisId) {
    return await this.dbLink.model(tableName).findByIdAndDelete(thisId);
  }

  async updateMe(tableName, thisId,  proparray) {
    return await this.dbLink.model(tableName).findByIdAndUpdate(thisId, proparray);
  }

  async resetDb(importJsonFilePath) {
    const fs = await import('fs');
    const {unpacking, arrayUnpacking} = await import('../../shared/utils.mjs');
    const {impData} = await import('../../server/utils.mjs');
    let data=fs.readFileSync(importJsonFilePath, 'utf8');
    data=JSON.parse(data);
    const {Node, Linker, nodeFromDataSource} = await import('./nodes.mjs');
    const langsRoot=new Node().load(unpacking(data.languages));
    const langs=langsRoot.getRelationship();
    await langsRoot.dbInsertMyTree();
    const newLangs=langs.children;
    const usersMo=new Linker().load(unpacking(data.tree.shift()));
    await usersMo.dbInsertMyTree();
    await impData(newLangs, "pageelementsdata", nodeFromDataSource(unpacking(data.tree.shift())));
    await impData(newLangs, "siteelementsdata", nodeFromDataSource(unpacking(data.tree.shift())));
    await impData(newLangs, "itemcategoriesdata", nodeFromDataSource(unpacking(data.tree.shift())));
    await impData(newLangs, "shippingtypesdata", nodeFromDataSource(unpacking(data.tree.shift())));
    await impData(newLangs, "paymenttypesdata", nodeFromDataSource(unpacking(data.tree.shift())));
    return true;
  }
}
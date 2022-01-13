import {Node, NodeMale, NodeFemale} from './nodesback.js'; 
import TABLES from './admintableslist.js';
import ADMINUSERS from './adminusertypes.js';

//Safety check functions
function getTableName(myNode){
  if (typeof myNode=="string") return myNode;
  if (Node.detectGender(myNode)=="female") {
    return myNode.props.childtablename;
  }
  else {
    return myNode.parentNode.props.childtablename;
  }
}
function getUserType(user){
  if (user.parentNode && user.parentNode.partnerNode) return user.parentNode.partnerNode.props.type;
}
function isConfidentialTable(tableName){
  if (TABLES.privateTables.includes(tableName)) return true;
}
function isForbidenTable(tableName){
  if (TABLES.forbidenTables.includes(tableName)) return true;
}
function isCatalogTable(tableName){
  if (TABLES.catalogTables.includes(tableName)) return true;
}
function isItemTable(tableName){
  if (TABLES.itemTables.includes(tableName)) return true;
}
function isAdmin(user){
  const userType=getUserType(user);
  if (userType && ADMINUSERS.includes(userType)) return true;
}
async function isOwner(myNode, userId) {
  //user relationship case
  if (Node.detectGender(myNode)=="female") {
    if (myNode.props.parenttablename=="TABLE_USERS" &&
      myNode.partnerNode && myNode.partnerNode.props.id==userId) {
        return true;
    }
  }
  else {
    //user case
    if (myNode.parentNode.childtablename=="TABLE_USERS" &&
      myNode.props.id==userId) {
        return true;
    }
  }
  //User Descendants case
  //make clone
  const nodeCopy=Node.detectGender(myNode)=="female"? new NodeFemale() : new NodeMale();
  nodeCopy.load(myNode);
  await nodeCopy.dbLoadMyTreeUp();
  let myUser=nodeCopy.getrootnode("TABLE_USERS");
  if (myUser && myUser.props.id==userId) return true;
}

export async function isAllowedToRead(user, myNode){
  if (!isConfidentialTable(getTableName(myNode))) return true;
  else {
    if (isAdmin(user)) return true;
    else if (await isOwner(myNode, user.props.id)) return true;
  }
}
export async function isAllowedToInsert(user, myNode){
  if (isAdmin(user)) return true;
  if (!isConfidentialTable(getTableName(myNode)) ) {
    if (getUserType(user)=="prodcut seller" &&
    isItemTable(getTableName(myNode))
    && await isOwner(myNode, user.props.id)) {
      return true;
    }
  }
  else if (isConfidentialTable(getTableName(myNode)) && user.props.id) return true;
}

export async function isAllowedToModify(user, myNode){
  if (isAdmin(user)) return true;
  if (!isConfidentialTable(getTableName(myNode)) ) {
    if (getUserType(user)=="prodcut seller" &&
    isItemTable(getTableName(myNode))
    && await isOwner(myNode, user.props.id)) {
      return true;
    }
  }
  else if (await isOwner(myNode, user.props.id)) return true;
}
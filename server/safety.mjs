import {Node as ProtoNode, Linker as ProtoLinker} from './nodes.mjs'; 
import TABLES from './admintableslist.mjs';
import ADMINUSERS from './adminusertypes.mjs';

const nodesConstructorsMixin = Sup => class extends Sup {
  static get nodeConstructor(){
    return Node
  }
  static get linkerConstructor(){
    return Linker
  }
}

const Node = nodesConstructorsMixin(ProtoNode)
const Linker = nodesConstructorsMixin(ProtoLinker)

//Safety check functions
function getTableName(myNode){
  if (typeof myNode=="string") return myNode;
  if (Node.detectLinker(myNode)) return myNode.props.childTableName;
  return myNode.parent.props.childTableName;
}
function getUserType(user){
  if (user.parent && user.parent.partner) return user.parent.partner.props.type;
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
  if (myNode.props.id==userId && myNode.parent.childTableName=="TABLE_USERS") return true;
  function isOwnerCore(pointer) {
    while (pointer) {
      if (pointer.props.parentTableName=="TABLE_USERS" && pointer.partner?.props.id==userId) return true;
      pointer=pointer.getAscendent();
    }
  }
  myNode=Node.clone(myNode);
  if (isOwnerCore(myNode)) return true;
  await myNode.dbLoadMyTreeUp();
  if (isOwnerCore(myNode)) return true;
}

export async function isAllowedToRead(user, myNode){
  if (!isConfidentialTable(getTableName(myNode))) return true;
  if (isAdmin(user)) return true;
  if (await isOwner(myNode, user.props.id)) return true;
}
export async function isAllowedToInsert(user, myNode){
  if (isAdmin(user)) return true;
  if (!isConfidentialTable(getTableName(myNode)) && getUserType(user)=="prodcut seller" && isItemTable(getTableName(myNode)) && await isOwner(myNode, user.props.id)) return true;
  if (isConfidentialTable(getTableName(myNode)) && user.props.id) return true;
}

export async function isAllowedToModify(user, myNode){
  if (getUserType(user)=='system administrator') return true; // For changing users password
  if (!myNode) return false;
  if (isAdmin(user)) return true;
  if (!isConfidentialTable(getTableName(myNode)) && getUserType(user)=="prodcut seller" && isItemTable(getTableName(myNode)) && await isOwner(myNode, user.props.id)) return true;
  if (isConfidentialTable(getTableName(myNode)) && (await isOwner(myNode, user.props.id))) return true;
}

export function isAllowedToUpdateCatalogImage(user){
  if (isAdmin(user)) return true;
}
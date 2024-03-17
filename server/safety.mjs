// It sets user permissions to access database
// Admin user has permission for almost any database operation
// For no admin users the permsion depends on if user owns data
// ADVISE!! The safety checking level is sometimes shalow (It doesn't double check database for data correctness), it trust the data sent, so it is up to the module consumer to check that the data (myNode and user) is actually correct
// myNode arg doesn't need to be from Node class

import {BasicNode} from "../shared/linker.mjs"
import {TABLES} from './admintableslist.mjs'
import {ADMINUSERS} from './adminusertypes.mjs'

export async function isAllowedToRead(user, myNode){
  if (!isConfidentialTable(getTableName(myNode)))
    return true
  if (isAdmin(user))
    return true
  if (await isOwner(user.constructor.nodeConstructor.clone(myNode), user.props.id)) // by cloning we also add Node class
    return true
}
export async function isAllowedToInsert(user, myNode){
  if (isAdmin(user))
    return true
  // *** this should be checked to ensure user id correspond to some user
  if (isConfidentialTable(getTableName(myNode)) && user.props.id) // orders can be created by direct insert for users
    return true
}
export async function isAllowedToModify(user, myNode){
  if (getUserType(user)=='system administrator')
    return true // For changing users password
  if (!myNode)
    return false
  if (isAdmin(user))
    return true
  if (isConfidentialTable(getTableName(myNode)) && (await isOwner(user.nodeConstructor.clone(myNode), user.props.id)))
    return true
}
export function isAllowedToUpdateCatalogImage(user){
  if (isAdmin(user))
    return true
}
// -- helpers --
function getTableName(myNode){
  if (typeof myNode=="string")
    return myNode
  if (BasicNode.detectLinker(myNode))
    return myNode.props.childTableName
  return Array.isArray(myNode.parent)? myNode.parent[0].props.childTableName : myNode.parent.props.childTableName
}
function getUserType(user){
  if (user.parent && user.parent.partner)
    return user.parent.partner.props.type
}
function isConfidentialTable(tableName){
  if (TABLES.privateTables.includes(tableName))
    return true
}
function isForbidenTable(tableName){
  if (TABLES.forbidenTables.includes(tableName))
    return true
}
function isCatalogTable(tableName){
  if (TABLES.catalogTables.includes(tableName))
    return true
}
function isItemTable(tableName){
  if (TABLES.itemTables.includes(tableName))
    return true
}
function isOrderTable(tableName){
  if (TABLES.orderTables.includes(tableName))
    return true
}
function isAdmin(user){
  if (ADMINUSERS.includes(getUserType(user)))
    return true
}
// myNode should be Node instance (It should have model features)
// It modifies the original myNode
async function isOwner(myNode, userId) {
  if (BasicNode.detectLinker(myNode)) {
    if (myNode.props.parentTableName=="TABLE_USERS" && myNode.partner.props.id==userId)
      return true
    myNode = myNode.partner
  }
  if (myNode.props.id==userId && myNode.parent?.childTableName=="TABLE_USERS")
    return true
  if (isOwnerCore(myNode))
    return true
  await myNode.dbLoadMyTreeUp()
  if (isOwnerCore(myNode))
    return true
  function isOwnerCore(pointer) {
    while (pointer) {
      if (pointer.parent?.props.parentTableName=="TABLE_USERS" && pointer.parent?.partner?.props.id==userId)
        return true
      if (Array.isArray(pointer.parent))
        pointer = pointer.parent[0]?.partner
      else
        pointer = pointer.parent?.partner
    }
  }
}
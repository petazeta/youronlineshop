// It sets user permissions to access database
// Admin user has permission for almost any database operation
// For no admin users the permsion depends on if user owns data
// ADVISE!! The safety checking level is sometimes shalow (It doesn't double check database for data correctness), it trust the data sent, so it is up to the module consumer to check that the data (myNode and user) is actually correct
// myNode arg doesn't need to be from Node class

export const safetyMixin=Sup => class extends Sup {
  static async isAllowedToRead(user, myNode){
  if (!this.isConfidentialTable(this.getTableName(myNode)))
    return true
  if (this.isAdmin(user))
    return true
  if (await this.isOwner(user.constructor.nodeConstructor.clone(myNode), user.props.id)) // by cloning we also add Node class
    return true
  }
  static async isAllowedToInsert(user, myNode){
    if (this.isAdmin(user))
      return true
    // *** this should be checked to ensure user id correspond to some user
    if (this.isConfidentialTable(this.getTableName(myNode)) && user.props.id) // orders can be created by direct insert for users
      return true
  }
  static async isAllowedToModify(user, myNode){
    if (this.getUserType(user)=='system administrator')
      return true // For changing users password
    if (!myNode)
      return false
    if (this.isAdmin(user))
      return true
    if (this.isConfidentialTable(this.getTableName(myNode)) && (await this.isOwner(user.nodeConstructor.clone(myNode), user.props.id)))
      return true
  }
  static isAllowedToUpdateCatalogImage(user){
    if (this.isAdmin(user))
      return true
  }
  // helpers
  static isConfidentialTable(tableName){
    return this.dbGateway.permissions.get("collections_types").get("privateTables").includes(tableName)
  }
  static isForbidenTable(tableName){
    return this.dbGateway.permissions.get("collections_types").get("forbidenTables").includes(tableName)
  }
  static isAdmin(user){
    return this.dbGateway.permissions.get("users_types").get("admins").includes(this.getUserType(user))
  }
  static getTableName(myNode){
    if (typeof myNode=="string")
      return myNode
    if (this.detectLinker(myNode)) // it has basicnode prototype
      return myNode.props.childTableName
    return Array.isArray(myNode.parent)? myNode.parent[0].props.childTableName : myNode.parent.props.childTableName
  }
  static getUserType(user){
    // I think users can not have multiple parents *** check it
    return user.parent?.partner?.props.type
  }
  // myNode should be Node instance (It should have model features)
  // It modifies the original myNode
  static async isOwner(myNode, userId) {
    if (this.detectLinker(myNode)) {
      if (myNode.props.parentTableName==this.dbGateway.permissions.get("users_collections").get("users") && myNode.partner.props.id==userId)
        return true
      myNode = myNode.partner
    }
    if (myNode.props.id==userId && myNode.parent?.props.childTableName==this.dbGateway.permissions.get("users_collections").get("users"))
      return true
    if (isOwnerCore(myNode, this.dbGateway.permissions))
      return true
    await myNode.dbLoadMyTreeUp()
    if (isOwnerCore(myNode, this.dbGateway.permissions))
      return true
    function isOwnerCore(pointer, permissions) {
      while (pointer) {
        const pointerParent = Array.isArray(pointer.parent)? pointer.parent[0] : pointer.parent
        if (pointerParent?.props.parentTableName==permissions.get("users_collections").get("users") && pointerParent?.partner?.props.id==userId)
          return true
        pointer = pointerParent?.partner
      }
    }
  }
}
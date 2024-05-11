export const webUserMixin = Sup => class extends Sup {
  async initUser(){
    // It loads the user type data for customer type
    const userType = (await new this.constructor.linkerConstructor("UsersTypes")
      .loadRequest('get all my children', {filterProps: {type: 'customer'}}))
      .getChild()
    await userType.loadRequest('get my relationships', {filterProps: {childTableName: 'Users'}})
    userType.getRelationship('users').addChild(this)
    return this
  }
  async resetData() {
    super.resetData()
    await this.initUser()
  }
  async loginSaved(){
    if (window.localStorage.getItem("user_name") && typeof this.props.id=="undefined") {
      return await this.login(window.localStorage.getItem("user_name"), window.localStorage.getItem("user_password"));
    }
  }
}
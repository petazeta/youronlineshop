const webUserMixin=Sup => class extends Sup {
  async initUser(){
    // It loads the user type data for customer type
    const typesMother=new this.constructor.linkerConstructor("TABLE_USERSTYPES")
    const userType=(await typesMother.loadRequest('get all my children')).getChild({type: 'customer'})
    await userType.loadRequest('get my relationships')
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

export default webUserMixin
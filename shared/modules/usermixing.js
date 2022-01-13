const UserMixing=Sup => class extends Sup {

  isUserType(utype){
    if (this.getUserType()==utype) {
      return true;
    }
    else return false;
  }

  isAdmin(){
    // Admin of anytype
    if (this.isWebAdmin() || this.isProductAdmin() || this.isSystemAdmin() || this.isOrdersAdmin()) {
      return true;
    }
    return false;
  }

  isWebAdmin(){
    return this.isUserType("web administrator");
  }

  isOrdersAdmin(){
    return this.isUserType("orders administrator");
  }

  isProductAdmin(){
    return this.isUserType("product administrator");
  }

  isProductSeller(){
    return this.isUserType("product seller");
  }

  isSystemAdmin(){
    return this.isUserType("system administrator");
  }

  isCustomer(){
    return this.isUserType("customer");
  }

  getUserType(){
    if (this.parentNode && this.parentNode.partnerNode) return this.parentNode.partnerNode.props.type;
  }
}

export default UserMixing;
// Este archivo es muy especifico para yos, mirar de ponerlo en yos y hacer otro general
const userMixin = Sup => class extends Sup {
  isUserType(uType){
    return this.getUserType()==uType;
  }

  isAdmin(){
    // Admin of anytype
    return this.isWebAdmin() || this.isProductAdmin() || this.isSystemAdmin() || this.isOrdersAdmin(); 
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
    return this.parent?.partner?.props.type;
  }
}

export default userMixin;
function Alert() {
  NodeMale.call(this);
}
Alert.prototype=Object.create(NodeMale.prototype);
Alert.prototype.constructor=Alert;


Alert.prototype.showalert=function() {
  var alertcontainer=document.createElement("div");
  document.body.appendChild(alertcontainer);
  this.myContainer=alertcontainer;
  this.refreshView();
};
Alert.prototype.hidealert=function() {
  var remove=function(element){
    element.parentElement.removeChild(element);
  };
  var myContainer=this.myContainer;
  if (this.properties.timeout>0) {
    window.setTimeout(function(){remove(myContainer);},this.properties.timeout);
  }
  else remove(myContainer);
};
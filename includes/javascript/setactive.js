NodeMale.prototype.setActive=function() {
  this.parentNode.activeChildren=this;
  var myPointer=this.getrootnode();
  myPointer.activeNode=this;
  var i= this.parentNode.children.length;
  while(i--) {
    this.parentNode.children[i].selected=false;
    var doms=this.parentNode.children[i].getMyDomNodes();
    if (doms.length>0) {
      setUnselected.call(doms[0]);
    }
  }
  this.selected=true;
  var doms=this.getMyDomNodes()
  if (doms) {
    setSelected.call(doms[0]);
  }
};
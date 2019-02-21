<template>
  <div>
    <a href=""></a>
    <script>
      thisNode.writeProperty(thisElement, "quantity");
      thisElement.addEventListener("click", function(ev){
	ev.preventDefault();
	mycart.additem(thisNode,-thisNode.properties.quantity);
	mycart.refreshcartbox();
      });
      thisElement.onmouseover=function(){
	this.textContent="X";
	this.style.fontWeight="bold";
      };
      thisElement.onmouseout=function(){
	thisNode.writeProperty(this, "quantity");
	this.style.fontWeight="normal";
      };
    </script>
    <a title="+ Info" href="javascript:"></a>
    <script>thisNode.writeProperty(thisElement, "name");</script>
    <span></span>
    <script>thisNode.writeProperty(thisElement, "price");</script>
    <span></span>
    <script>
      var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
      currency.writeProperty(thisElement);
    </script>
  </div>
</template>
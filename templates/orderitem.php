<template>
  <div style="display:grid; grid-template-columns:1fr 4fr 1fr;"></div>
  <script>
    thisNode.addEventListener("changeProperty", function(propertyname){
      if (propertyname=="quantity" || propertyname=="price") {
	thisNode.parentNode.partnerNode.refreshView();
      }
    }, "reCaluculate");
    thisNode.showLabel=false;
    if (thisNode.parentNode.partnerNode.properties.status==0) { //editable only when order is not archived
      thisNode.editable=["quantity"];
    }
    thisNode.appendProperties(thisElement,"templates/singlefield.php",function(){
      var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
      thisElement.lastElementChild.querySelector("span").parentElement.appendChild(document.createTextNode(currency));
    });
  </script>
</template>
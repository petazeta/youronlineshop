<template></template>
<script>
  thisNode.addEventListener("changeProperty", function(propertyname){
    if (propertyname=="quantity" || propertyname=="price") {
      thisNode.parentNode.partnerNode.refreshView();
    }
  }, "reCaluculate");
  var myVirtualContainer=thisElement.content;
  var currentItemOrder=thisElement.parentElement.querySelectorAll("[data-property=price] span").length;
  thisNode.appendProperties(myVirtualContainer,"templates/singlefield.php").then(function(){
    var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
    myVirtualContainer.querySelectorAll("[data-property=price] span")[currentItemOrder].parentElement.appendChild(document.createTextNode(currency));
    thisElement.parentElement.appendChild(myVirtualContainer);
  });
</script>
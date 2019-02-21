<template>
  <template>
    <table style="width:100%">
      <tr>
	<td>
	</td>
      </tr>
    </table>
  </template>
  <div></div>
  <script>
    thisNode.addEventListener("changeProperty", function(propertyname){
      if (propertyname=="quantity" || propertyname=="price") {
	thisNode.parentNode.refreshView();
      }
    }, "reCaluculate");
    thisNode.showLabel=false;
    if (thisNode.parentNode.partnerNode.properties.status==0) { //editable only when order is not archived
      thisNode.editable=["quantity"];
    }
    thisNode.appendProperties(thisElement,"includes/templates/singlefield.php",function(){
      var currency=domelementsrootmother.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild().properties.value;
      thisElement.lastElementChild.querySelector("span").parentElement.appendChild(document.createTextNode(currency));
      thisElement.appendChild(DomMethods.intoColumns(getTpContent(thisElement.previousElementSibling).querySelector("table").cloneNode(true), thisElement, 0));
      thisElement.querySelector("table").rows[0].cells[0].style.width="2em";
      thisElement.querySelector("table").rows[0].cells[2].style.width="7em";
      //Price formating
      thisElement.querySelector("table").rows[0].cells[2].firstElementChild.style.textAlign="right";
      thisElement.querySelector("table").rows[0].cells[2].firstElementChild.firstElementChild.querySelector("span").parentElement.style.display="inline";
    });
    //We must remove now the 
  </script>
</template>
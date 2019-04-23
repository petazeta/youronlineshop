<template>
  <template>
    <table class="formtable">
      <tr>
	<td></td>
      </tr>
    </table>
  </template>
  <div style="margin-bottom: 1em;"></div>
  <script>
  var shippingtypesrootmother=new NodeFemale();
  shippingtypesrootmother.properties.childtablename="TABLE_SHIPPINGTYPES";
  shippingtypesrootmother.properties.parenttablename="TABLE_SHIPPINGTYPES";
  shippingtypesrootmother.loadfromhttp({action:"load root"}, function(){
    var shippingtypesroot=this.getChild();
    shippingtypesroot.loadfromhttp({action: "load my tree", deepLevel: 3, language: webuser.extra.language.properties.id}, function() {
      var shippingtypesMother=this.getRelationship();
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(shippingtypesMother, 1, 0, "id");
      //new node comes with datarelationship attached
      newNode.addRelationship(shippingtypesMother.partnerNode.getRelationship("shippingtypes").cloneNode(0, 0));
      newNode.addRelationship(shippingtypesMother.partnerNode.getRelationship("shippingtypesdata").cloneNode(0, 0));
      newNode.getRelationship("shippingtypesdata").addChild(new NodeMale());
      shippingtypesMother.newNode=newNode;
      shippingtypesMother.addEventListener("refreshChildrenView", function(){
	//to set the result in a one column table
	thisElement.appendChild(DomMethods.intoColumns(getTpContent(thisElement.previousElementSibling).querySelector("table").cloneNode(true), thisElement, 1));
      }, "1column");
      shippingtypesMother.appendThis(thisElement, "templates/admnlisteners.php", function() {
	this.refreshChildrenView(thisElement,  "templates/shippingtype.php");
      });
    });
  });
  </script>
</template>

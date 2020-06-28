<template>
  <table style="margin: 1em auto;" class="formtable">
    <tbody></tbody>
    <script>
    var shippingtypesrootmother=new NodeFemale();
    shippingtypesrootmother.properties.childtablename="TABLE_SHIPPINGTYPES";
    shippingtypesrootmother.properties.parenttablename="TABLE_SHIPPINGTYPES";
    shippingtypesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
      return new Promise((resolve, reject) => {
        resolve(myNode.getChild());
      });
    })
    .then((myNode)=>{
      myNode.loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
        var shippingtypesMother=myNode.getRelationship();
        var newNode=new NodeMale();
        newNode.parentNode=new NodeFemale();
        newNode.parentNode.load(shippingtypesMother, 1, 0, "id");
        //new node comes with datarelationship attached
        newNode.addRelationship(shippingtypesMother.partnerNode.getRelationship("shippingtypes").cloneNode(0, 0));
        newNode.addRelationship(shippingtypesMother.partnerNode.getRelationship("shippingtypesdata").cloneNode(0, 0));
        newNode.getRelationship("shippingtypesdata").addChild(new NodeMale());
        shippingtypesMother.newNode=newNode;
        shippingtypesMother.appendThis(thisElement, "templates/admnlisteners.php").then(function(myNode) {
          myNode.refreshChildrenView(thisElement,  "templates/shippingtype.php");
        });
      });
    });
    </script>
  </table>
</template>

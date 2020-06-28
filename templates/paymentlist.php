<template>
  <table style="margin: 1em auto;" class="formtable">
    <tbody></tbody>
    <script>
    var paymenttypesrootmother=new NodeFemale();
    paymenttypesrootmother.properties.childtablename="TABLE_PAYMENTTYPES";
    paymenttypesrootmother.properties.parenttablename="TABLE_PAYMENTTYPES";
    paymenttypesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
      return new Promise((resolve, reject) => {
        resolve(myNode.getChild());
      });
    })
    .then(function(myNode){
      myNode.loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
        var paymenttypesMother=myNode.getRelationship();
        var newNode=new NodeMale();
        newNode.parentNode=new NodeFemale();
        newNode.parentNode.load(paymenttypesMother, 1, 0, "id");
        //new node comes with datarelationship attached
        newNode.addRelationship(paymenttypesMother.partnerNode.getRelationship("paymenttypes").cloneNode(0, 0));
        newNode.addRelationship(paymenttypesMother.partnerNode.getRelationship("paymenttypesdata").cloneNode(0, 0));
        newNode.getRelationship("paymenttypesdata").addChild(new NodeMale());
        paymenttypesMother.newNode=newNode;
        paymenttypesMother.appendThis(thisElement, "templates/admnlisteners.php").then(function(myNode) {
          myNode.refreshChildrenView(thisElement,  "templates/paymenttype.php");
        });
      });
    });
    </script>
  </table>
</template>

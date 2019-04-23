<template>
  <template>
    <table class="formtable"><tr><td></td></tr></table>
  </template>
  <div style="margin-bottom: 1em;"></div>
  <script>
  var paymenttypesrootmother=new NodeFemale();
  paymenttypesrootmother.properties.childtablename="TABLE_PAYMENTTYPES";
  paymenttypesrootmother.properties.parenttablename="TABLE_PAYMENTTYPES";
  paymenttypesrootmother.loadfromhttp({action:"load root"}, function(){
    var paymenttypesroot=this.getChild();
    paymenttypesroot.loadfromhttp({action: "load my tree", deepLevel: 3, language: webuser.extra.language.properties.id}, function() {
      var paymenttypesMother=this.getRelationship();
      var newNode=new NodeMale();
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(paymenttypesMother, 1, 0, "id");
      //new node comes with datarelationship attached
      newNode.addRelationship(paymenttypesMother.partnerNode.getRelationship("paymenttypes").cloneNode(0, 0));
      newNode.addRelationship(paymenttypesMother.partnerNode.getRelationship("paymenttypesdata").cloneNode(0, 0));
      newNode.getRelationship("paymenttypesdata").addChild(new NodeMale());
      paymenttypesMother.newNode=newNode;
      paymenttypesMother.addEventListener("refreshChildrenView", function(){
        //to set the result in a one column table
        thisElement.appendChild(DomMethods.intoColumns(getTpContent(thisElement.previousElementSibling).querySelector("table").cloneNode(true), thisElement, 1));
      }, "1column");
      paymenttypesMother.appendThis(thisElement, "templates/admnlisteners.php", function() {
        this.refreshChildrenView(thisElement,  "templates/paymenttype.php");
      });
    });
  });
  </script>
</template>

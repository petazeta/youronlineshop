<div id="paymentcontainer" class="boxframe"></div>
<script>
var paymenttypesrootmother=new NodeFemale();
paymenttypesrootmother.properties.childtablename="TABLE_PAYMENTTYPES";
paymenttypesrootmother.properties.parenttablename="TABLE_PAYMENTTYPES";
paymenttypesrootmother.loadfromhttp({action:"load root"}).then(function(myNode){
  myNode.getChild().loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
    if (myNode.getRelationship().children.length==1 && webuser.isCustomer()) {
      //We skip is there is no choice
      (new Node()).refreshView(document.getElementById("centralcontent"),"templates/checkout5.php");
      return;
    }
    DomMethods.adminListeners({thisParent: myNode.getRelationship()});
    myNode.getRelationship().refreshChildrenView(thisElement,  "templates/paymenttype.php");
  });
});
</script>
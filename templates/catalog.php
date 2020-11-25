<!--
-->
<div class="loader">
  <div class="elementloader"></div>
  <script>
    DomMethods.setSizeFromStyle(thisElement);
  </script>
</div>
<div class="productlistgrid"></div>
<script>
  var parameters={action:"load my tree", language: webuser.extra.language.properties.id};
  if (webuser.isProductSeller()) {
    var thisNodeData= [thisNode.toRequestData({action: "load my children"}), webuser.getRelationship("items").toRequestData({action: "load my children"})];
    parameters={action:"load children", language: webuser.extra.language.properties.id, reqnodes: thisNodeData}; 
  }
  thisNode.children=[]; //first we remove the previous children (because load insert the new data but doesn't remove previous)
  thisNode.loadfromhttp(parameters).then(function(){
    //var itemDataRel=new NodeFemale();
    //itemDataRel.properties.childtablename="TABLE_ITEMSDATA";
    //itemDataRel.properties.parenttablename="TABLE_ITEMS";
    //itemDataRel.loadfromhttp({action:"load this relationship"}).then(function(myNode) {
    
      DomMethods.adminListeners({thisParent: thisNode, showIf: () => webuser.isProductAdmin() || webuser.isProductSeller() || webuser.isWebAdmin()});
      //in case is seller we still need to load the entire tree
      if (webuser.isProductSeller()) {
        var myChildNodes=[];
        var myActions=[];
        for (var i=0; i<thisNode.children.length; i++) {
          myChildNodes.push(thisNode.children[i].toRequestData({"action": "load my tree"}));
          myActions.push({action:"load my tree", language: webuser.extra.language.properties.id});
          //thisNode.children[i].loadfromhttp(, function(){});
        }
        var loadelement=new Node();
        loadelement.loadfromhttp({"parameters": myActions, "nodes": myChildNodes}).then(function(myNode){
          for (var i=0; i<thisNode.children.length; i++) {
            thisNode.children[i].load(myNode.nodelist[i]);
          }
          thisNode.refreshChildrenView(thisElement, "templates/itemlistpicture.php");
        });
      }
      else{
        thisNode.refreshChildrenView(thisElement, "templates/itemlistpicture.php");
      }
      //if adding the item we have to set the item seller
      /*
      thisNode.addEventListener("addNewNode", function(newItemNode) {
        if (webuser.getRelationship("items")) {
          //we make a clone of the node to let the actual rel without changes
          var newItemClone=newItemNode.cloneNode();
          newItemClone.sort_order=null;
          webuser.getRelationship("items").addChild(newItemClone);
          newItemClone.loadfromhttp({action:"add my link"});
        }
      }, "setseller");  
      */
      
    //});
  });
</script>
<template>
  <div class="loader">
    <img src="css/images/loader-2.gif">
  </div>
  <div class="productlistgrid"></div>
  <script>
    var parameters={action:"load my tree", language: webuser.extra.language.properties.id};
    if (webuser.isProductAdmin()) {
      thisNode.editable=true;
    }
    if (webuser.isProductSeller()) {
      thisNode.editable=true;
      var thisNodeData= [thisNode.toRequestData({action: "load my children"}), webuser.getRelationship("items").toRequestData({action: "load my children"})];
      parameters={action:"load children", language: webuser.extra.language.properties.id, reqnodes: thisNodeData};      
    }
    thisNode.loadfromhttp(parameters, function(){
      var newNode=new NodeMale(); //new Item
      newNode.parentNode=new NodeFemale();
      newNode.parentNode.load(thisNode, 1, 0, "id");
      //new node comes with datarelationship attached
      var itemDataRel=new NodeFemale();
      itemDataRel.properties.childtablename="TABLE_ITEMSDATA";
      itemDataRel.properties.parenttablename="TABLE_ITEMS";
      itemDataRel.loadfromhttp({action:"load this relationship"}, function() {
        newNode.addRelationship(this);
        newNode.getRelationship("itemsdata").addChild(new NodeMale());
        thisNode.newNode=newNode;
        thisNode.appendThis(thisElement, "templates/admnlisteners.php");
        if (webuser.isProductSeller()) {
          var myChildNodes=[];
          var myActions=[];
          for (var i=0; i<thisNode.children.length; i++) {
            myChildNodes.push(thisNode.children[i].toRequestData({"action": "load my tree"}));
            myActions.push({action:"load my tree", language: webuser.extra.language.properties.id});
            //thisNode.children[i].loadfromhttp(, function(){});
          }
          var loadelement=new Node();
          loadelement.loadfromhttp({"parameters": myActions, "nodes": myChildNodes}, function(){
            for (var i=0; i<thisNode.children.length; i++) {
              thisNode.children[i].load(this.nodelist[i]);
            }
            thisNode.refreshChildrenView(thisElement, "templates/itemlistpicture.php");
          });
        }
        else{
          thisNode.refreshChildrenView(thisElement, "templates/itemlistpicture.php");
        }
        //if adding the item we have to set the item seller
        thisNode.addEventListener("addNewNode", function(newItemNode) {
          if (webuser.getRelationship("items")) {
            //we make a clone of the node to let the actual rel without changes
            var newItemClone=newItemNode.cloneNode();
            newItemClone.sort_order=null;
            webuser.getRelationship("items").addChild(newItemClone);
            newItemClone.loadfromhttp({action:"add my link", user_id: webuser.properties.id});
          }
        }, "setseller");  
      });
    });
  </script>
</template>

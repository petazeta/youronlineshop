<template>
  <div>
    <span data-note="relative position container for admn buttons" style="z-index:1">
      <a href="javascript:" data-button="true" data-hbutton="true" class="subcategory"></a>
      <script>
        var prevUrl='?category=' + thisNode.parentNode.partnerNode.properties.id;
        var url= prevUrl + '&subcategory=' + thisNode.properties.id;
        thisElement.href=url;
        thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}, function(){
          this.getChild().writeProperty(thisElement);
          var launcher = new Node();
          launcher.thisNode = this.getChild();
          launcher.editElement = thisElement;
          launcher.btposition="btmiddleleft";
          launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
          var admnlauncher=new Node();
          admnlauncher.thisNode=thisNode;
          admnlauncher.editElement = thisElement;
          admnlauncher.btposition="btmiddleright";
          admnlauncher.elementsListPos="vertical";
          admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
          admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
          admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
          admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
        });
        thisNode.addEventListener("deleteNode", function(nodedeleted){
          //Remove the productscontainer content
          if (this.parentNode.children.length==0) {
            this.getRelationship("items").childContainer.innerHTML="";
          }
        });
        thisNode.getRelationship("items").addEventListener("refreshChildrenView", function() {
          if (this.childContainer.parentElement) var myLoader=this.childContainer.parentElement.querySelector(".loader");
          if (myLoader) myLoader.style.display="none";
          
          //products container set to visible
          //thisNode.getRelationship("items").getMyDomNodes()[0].parentElement.style.visibility="visible";
        }, "removeLoader");
        thisElement.addEventListener("click", function(event) {
          event.preventDefault();
          DomMethods.setActive(thisNode);
          thisNode.getRelationship("items").refreshView(document.getElementById("centralcontent"),"templates/catalog.php");
          //it doesn't record state when: go back (dont state twice the same url)
          if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
        });
      </script>
    </span>
  </div>
</template>

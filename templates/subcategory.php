<template>
  <div>
    <span data-note="relative position container for admn buttons" style="z-index:1">
      <a href="javascript:" data-button="true" data-hbutton="true" class="subcategory"></a>
      <script>
        var prevUrl='?category=' + thisNode.parentNode.partnerNode.properties.id;
        var url= prevUrl + '&subcategory=' + thisNode.properties.id;
        thisElement.href=url;
        thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}).then((myNode) => {
          myNode.getChild().writeProperty(thisElement);
          var launcher = new Node();
          launcher.thisNode = myNode.getChild();
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
          //We grab state on mouse click
          if (event.isTrusted) {
            //it doesn't record state when: go back (dont state twice the same url)
            if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
          }
        });
        
        //Now we click the subcategory selected at the parameters send by the url
        if (window.location.search) {
          var regex = /subcategory=(\d+)/;
          var catIdMatch=window.location.search.match(regex);
          if (catIdMatch) {
            if (catIdMatch[1]==thisNode.properties.id) {
              thisElement.click();
            }
          }
        }
        else {
          //Now we click some menu at page start (if no url)
          if (Config.startSubcatNum) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
            var startCat=thisNode.parentNode.children[Config.startSubcatNum-1];
            if (startCat==thisNode) {
              thisElement.click();
            }
          }
        }
      </script>
    </span>
  </div>
</template>

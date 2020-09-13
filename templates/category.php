<template>
  <div class="boxlist">
    <div>
      <div class="loader" style="visibility:hidden">
        <img src="css/images/loader-2.gif">
      </div>
      <span data-note="relative position container for admn buttons" style="z-index:1">
        <a href="javascript:" class="category" data-button="true" data-hbutton="true"></a>
        <script>
          var url='?category=' + thisNode.properties.id;
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
            //Now we add the listener
            thisNode.getRelationship().addEventListener("refreshChildrenView", function(){
              //remove loader if exists
              if (thisElement.parentElement.parentElement) var myLoader=thisElement.parentElement.parentElement.querySelector(".loader");
              if (myLoader) myLoader.style.visibility="hidden";
              //subcategories container set to visible
              thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer").style.display="block";
            }, "subcat");
          });
          function showsubcategories() {
            return new Promise((resolve, reject) => {
              //view loader
              thisElement.parentElement.parentElement.querySelector(".loader").style.visibility="visible";
              thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer").style.display="none";
              thisNode.getRelationship().children=[]; //first we remove the previous children (because load insert the new data but doesn't remove previous)
              thisNode.getRelationship().loadfromhttp({action:"load my tree", deepLevel: 2}).then((myNode) => {
                //deepLevel=2 => It load relationship (level is also for female)
                myNode.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
                myNode.newNode.parentNode=new NodeFemale(); //the parentNode is not the same
                myNode.newNode.parentNode.load(myNode, 1, 0, null, "id");
                myNode.appendThis(thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer"), "templates/admnlisteners.php");
                //we show subcategories (and click some subcategory)
                myNode.refreshChildrenView(thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer"),"templates/subcategory.php").then(resolve());
              });
            });
          };
        
          thisElement.addEventListener("click", function(event){
            event.preventDefault();
            DomMethods.setActive(thisNode);
            document.getElementById("centralcontent").innerHTML="";//We remove central content (To avoid keep content that could be confusing)
            var url='?category=' + thisNode.properties.id;
            showsubcategories();
            //We just grab history when efective clicking
            if (event.isTrusted) {
              //it doesn't record state when: go back (dont state twice the same url)
              if (!(history.state && history.state.url==url)) history.pushState({url:url}, null, url);
            }
          });
          if (Config.showsubcategory_On) {
            showsubcategories();
          }
          //Now we click the category selected at the parameters send by the url
          if (window.location.search) {
            var regex = /category=(\d+)/;
            var catIdMatch=window.location.search.match(regex);
            if (catIdMatch) {
              if (catIdMatch[1]==thisNode.properties.id) {
                thisElement.click();
              }
            }
          }
          else {
            //Now we click some menu at page start (if no url)
            if (Config.startCatNum) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
              var startCat=thisNode.parentNode.children[Config.startCatNum-1];
              if (startCat==thisNode) {
                thisElement.click();
              }
            }
          }
        </script>
      </span>
    </div>
    <div class="subcategorycontainer" style="display:none;"></div>
  </div>
</template>

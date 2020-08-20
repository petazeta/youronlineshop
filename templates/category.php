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
          //This function is to auto-click some subcategory in same special situations
          function makeclick(myNode) {
            //Now would click at the subcategory if there is a path in url
            if (myNode.children.length > 0) {
              if (window.location.search) {
                var regex = new RegExp('category=' + thisNode.properties.id + '&subcategory=(\\d+)');
                if (window.location.search.match(regex)) var id = window.location.search.match(regex)[1];
                if (id) {
                  var link=document.querySelector("a[href='?category=" + thisNode.properties.id + "&subcategory=" + id + "']");
                  if (link) {
                    link.click();
                    return; //Finish here
                  }
                }
              }
              //If not we would click at first subcategory
              if (!id) {
                var button=null;
                myNode.getChild().getMyDomNodes().every(function(domNode){
                  button=domNode.querySelector("[data-button]");
                  if (button) return false;
                });
                if (button) button.click();
              }
            }
            else {
              // If there is no subcategories we can set up the category state
              if (!(history.state && history.state.url==url)) { //to not repeat state
                history.pushState({url:url}, null, url);
              }
            }
          };
          function showsubcategories(listener) {
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
              myNode.refreshChildrenView(thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer"),"templates/subcategory.php").then(listener);
            });
          };
        
          thisElement.addEventListener("click", function(event){
            event.preventDefault();
            DomMethods.setActive(thisNode);
            document.getElementById("centralcontent").innerHTML="";//We remove central content (To avoid keep content that could be confusing)
            if (!Config.showsubcategory_On) {
              showsubcategories(makeclick);
            }
            else {
              makeclick(thisNode.getRelationship());
            }
          });
          
          if (Config.showsubcategory_On) {
            showsubcategories();
          }
        </script>
      </span>
    </div>
    <div class="subcategorycontainer" style="display:none;"></div>
  </div>
</template>

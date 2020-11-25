<!--
-->
<div class="boxlist">
  <div>
    <div class="loader" style="visibility:hidden">
      <div class="elementloader"></div>
      <script>
        DomMethods.setSizeFromStyle(thisElement);
      </script>
    </div>
    <span style="position:relative; z-index:1">
      <div data-id="admnbuts" class="btmiddleright">
        <div class="admnbtsgrid"></div>
      </div>
      <div data-id="butedit" class="btmiddleleft"></div>
      <a href="javascript:" class="category" data-button="true" data-hbutton="true"></a>
      <script>
        var url='?category=' + thisNode.properties.id;
        thisElement.href=url;
        thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}).then((myNode) => {
          myNode.getChild().writeProperty(thisElement);
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
            thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
            thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
            thisNode.parentNode.getNewNode().then((newNode) => {
              //newNode.getRelationship({name: "itemcategoriesdata"}).addChild(new NodeMale());
              newNode.sort_order=thisNode.sort_order + 1;
              thisNode.parentNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
            });
          }
        });
        function showsubcategories() {
          var subcLoader=thisElement.parentElement.parentElement.parentElement.querySelector(".loader");
          var subcContainer=thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer");
          //view loader
          subcLoader.style.visibility="visible";
          subcContainer.style.display="none";
          thisNode.getRelationship().children=[]; //first we remove the previous children (because load insert the new data but doesn't remove previous)
          thisNode.getRelationship().loadfromhttp({action:"load my tree", deepLevel: 2}).then((myNode) => {
            //deepLevel=2 => It load relationship (level is also for female)
            //myNode.newNode=thisNode.parentNode.getNewNode(); // we duplicate it so newNode can be reused
            //myNode.newNode.parentNode=new NodeFemale(); //the parentNode is not the same
            //myNode.newNode.parentNode.load(myNode, 1, 0, null, "id");
            DomMethods.adminListeners({thisParent: myNode});
            //myNode.appendThis(thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer"), "templates/admnlisteners.php");
            //we show subcategories (and click some subcategory)
            myNode.refreshChildrenView(thisElement.parentElement.parentElement.parentElement.querySelector(".subcategorycontainer"),"templates/subcategory.php").then(function(){
              //remove loader if exists
              if (subcLoader) subcLoader.style.visibility="hidden";
              //subcategories container set to visible
              subcContainer.style.display="block";
            });
          });
        };
      
        thisElement.addEventListener("click", function(event){
          event.preventDefault();
          if (this.isContentEditable==true) {return false;} // The event should not be executed at contentiditable state
          if (Config.showsubcategory_On) return false;
          DomMethods.setActive(thisNode);
          document.getElementById("centralcontent").innerHTML="";//We remove central content (To avoid keep content that could be confusing)
          var url='?category=' + thisNode.properties.id;
          showsubcategories();
          //We just grab history when efective clicking
          if (event.isTrusted) {
            //it doesn't record state when: go back (dont state twice the same url)
            if (!(history.state && history.state.url==url)) {
              history.pushState({url:url}, null, url);
            }
            //Update the state bar
            //thisNode.refreshView(document.getElementById("statecontainer"), "templates/statebar.php");
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
<div>
  <span data-note="relative position container for admn buttons" style="z-index:1; position: relative;">
    <div data-id="admnbuts" class="btmiddleright">
      <div class="admnbtsgrid"></div>
    </div>
    <div data-id="butedit" class="btmiddleleft"></div>
    <a href="javascript:" data-button="true" data-hbutton="true" class="subcategory"></a>
    <script>
      var prevUrl='?category=' + thisNode.parentNode.partnerNode.properties.id;
      var url= prevUrl + '&subcategory=' + thisNode.properties.id;
      thisElement.href=url;
      thisNode.getRelationship({name: "itemcategoriesdata"}).loadfromhttp({action: "load my children", language: webuser.extra.language.properties.id}).then((myNode) => {
        myNode.getChild().writeProperty(thisElement);
        if (webuser.isWebAdmin() || webuser.isProductAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
          thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
          thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
          thisNode.parentNode.getNewNode().then((newNode) => {
            //newNode.loadasc(thisNode, 2, "id");
            //newNode.getRelationship({name: "itemcategoriesdata"}).addChild(new NodeMale());
            newNode.sort_order=thisNode.sort_order + 1;
            thisNode.parentNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
            //thisNode.appendThis(thisElement.parentElement, "templates/addadmnbuts.php", {editElement: thisElement, btposition: "btmiddleright", elementsListPos: "vertical", newNode: newNode});
          });
        }
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
        if (this.isContentEditable==true) {return false;} // The event should not be executed at contentiditable state
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
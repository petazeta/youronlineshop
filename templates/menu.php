<span class="menu" data-hbutton="true" style="position:relative;">
  <div data-id="butedit" class="btbottomcenter" style="visibility:hidden;"></div>
  <div data-id="admnbuts" class="bttopcenter" style="visibility:hidden;">
    <div class="admnbtsgrid">
      <div></div><div></div><div></div>
    </div>
  </div>
  <a data-button="true" class="menu" href="javascript:"></a>
  <script>
    var url='?menu=' + thisNode.properties.id;
    thisElement.href=url;
    //function to show the openclosebutton
    function showOpenButton() {
      (new Node()).appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "templates/butopen.php").then(
        () => DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector("[data-id=containeropen]").querySelector("[data-id=openclose]"), parent: thisElement}));
    }
    if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
    thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children", language: webuser.extra.language.properties.id}).then(function(myNode){
      myNode.getChild().writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        myNode.getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        thisNode.refreshView(thisElement.parentElement.querySelector('.admnbtsgrid').children[0], "templates/butchpos.php");
        thisNode.refreshView(thisElement.parentElement.querySelector('.admnbtsgrid').children[1], "templates/butdelete.php");
        thisNode.parentNode.getNewNode().then((newNode) => {
          newNode.sort_order=thisNode.sort_order + 1;
          thisNode.parentNode.refreshView(thisElement.parentElement.querySelector('.admnbtsgrid').children[2], "templates/butaddnewnode.php", {newNode: newNode});
        });
        //newNode.getRelationship({name: "domelementsdata"}).addChild(new NodeMale());
      }
    });
    thisNode.getRelationship("domelements").addEventListener("refreshChildrenView", function() {
      if (this.childContainer.parentElement) var myLoader=this.childContainer.parentElement.querySelector('.loader');
      if (myLoader) myLoader.style.display="none";
      //products container set to visible
      //thisNode.getRelationship("domelements").getMyDomNodes()[0].parentElement.style.visibility="visible";
    }, "removeLoader");
    thisElement.addEventListener('click', function(event){
      event.preventDefault();
      if (this.isContentEditable==true) {return false;} // The event should not be executed at contentiditable state
      DomMethods.setActive(thisNode);
      thisNode.refreshView(document.getElementById("centralcontent"), "templates/doc.php");
      if (event.isTrusted) {
        if (!(history.state && history.state.url==url)) { //to not repeat state
          history.pushState({url:url}, null, url);
        }
      }
    });
    //we add the edit
    if (webuser.isWebAdmin()) {
      showOpenButton();
    }
    //Lets add the log event
    webuser.addEventListener("log",
      function() {
        if (!this.isWebAdmin()) {
          //to remove the openbutton when logs after webadmin
          var containerOpen=thisElement.parentElement.querySelector("[data-id=containeropen]");
          if (containerOpen) {
            containerOpen.innerHTML="";
          }
        }
        else {
          showOpenButton();
        }
      },
      "openButton", thisNode
    );
    //removing the listener when node is deleted
    thisNode.addEventListener("deleteNode", function() {
      webuser.removeEventListener("log", "openButton", thisNode);
    }, "deleteOpenButton");
    
    //Now we click the menu selected at the parameters send by the url
    if (window.location.search) {
      var regex = /menu=(\d+)/;
      var menuIdMatch=window.location.search.match(regex);
      if (menuIdMatch) {
        if (menuIdMatch[1]==thisNode.properties.id) {
          thisElement.click();
        }
      }
    }
    else {
      //Now we click some menu at page start (if no url)
      if (Config.startMenuNum) { //When webadmin is logged we dont click because we have to wait for the login to be effect I think
        var startMenu=thisNode.parentNode.children[Config.startMenuNum-1];
        if (startMenu==thisNode) {
          thisElement.click();
        }
      }
    }
  </script>
  <div class="btmiddleright" data-id="containeropen"></div>
</span>
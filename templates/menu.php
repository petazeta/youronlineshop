<template>
  <span class="menu" data-hbutton="true" data-note="relative position container for admn buttons">
    <a data-button="true" class="menu" href="javascript:"></a>
    <script>
      var url='?menu=' + thisNode.properties.id;
      thisElement.href=url;
      //function to show the openclosebutton
      function showOpenButton() {
        var openlauncher=new Node();
        openlauncher.appendThis(thisElement.parentElement.querySelector("[data-id=containeropen]"), "templates/butopen.php", function(){
          var openclosebutton=thisElement.parentElement.querySelector("[data-id=containeropen]").querySelector("[data-id=openclose]");
          //The on mouse over facility
          openclosebutton.style.opacity=0;
          thisElement.addEventListener("mouseover", function(ev){
            openclosebutton.style.opacity=1;
          });
          thisElement.addEventListener("mouseout", function(ev){
            openclosebutton.style.opacity=0;
          });
          openclosebutton.addEventListener("mouseover", function(ev){
            openclosebutton.style.opacity=1;
          });
          openclosebutton.addEventListener("mouseout", function(ev){
            openclosebutton.style.opacity=0;
          });
        });
      }
      if (thisNode.selected) DomMethods.setActive(thisNode); //restablish the active status after clonning parent rel and when refreshing setSelected
      thisNode.getRelationship("domelementsdata").loadfromhttp({action:"load my children", language: webuser.extra.language.properties.id}).then(function(myNode){
        myNode.getChild().writeProperty(thisElement);
        var launcher = new Node();
        launcher.thisNode = myNode.getChild();
        launcher.editElement = thisElement;
        launcher.btposition="btbottomcenter";
        launcher.visibility="hidden";
        launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
        var admnlauncher=new Node();
        admnlauncher.thisNode=thisNode;
        admnlauncher.editElement = thisElement;
        admnlauncher.visibility="hidden";
        admnlauncher.newNode=thisNode.parentNode.newNode.cloneNode(0, null); // we duplicate it so newNode can be reused
        admnlauncher.newNode.loadasc(thisNode, 2, "id"); //the parent is not the same
        admnlauncher.newNode.sort_order=thisNode.sort_order + 1;
        admnlauncher.appendThis(thisElement.parentElement, "templates/addadmnbuts.php");
      });
      thisNode.getRelationship("domelements").addEventListener("refreshChildrenView", function() {
        if (this.childContainer.parentElement) var myLoader=this.childContainer.parentElement.querySelector('.loader');
        if (myLoader) myLoader.style.display="none";
        //products container set to visible
        //thisNode.getRelationship("domelements").getMyDomNodes()[0].parentElement.style.visibility="visible";
      }, "removeLoader");
      thisElement.addEventListener('click', function(event){
        event.preventDefault();
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
</template>

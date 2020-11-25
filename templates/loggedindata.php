<template>
  <div id="dashboard">
    <div class="msgbox" style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span></span>
      <script>
        var title=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"dashboardtit"}).getRelationship("domelementsdata").getChild();
        title.writeProperty(thisElement);
        //adding the edition pencil
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          title.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
        }
      </script>
      <span></span>
      <script>
        webuser.writeProperty(thisElement, "username");
      </script>
    </div>
    <div></div>
    <script>
      webuser.refreshView(thisElement, "templates/useraddressview.php", {showAddress: false, fieldtype: 'input'});
    </script>
    <div class="dashbuttons">
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var btShowOrd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowOrd"});
          btShowOrd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.onclick=function(){
            (new Node()).refreshView(document.getElementById("centralcontent"), "templates/showorders.php");
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowOrd"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            thisElement.type="hidden";
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var btShowAdd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowAdd"});
          btShowAdd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.onclick=function(){
            (new Node()).refreshView(document.getElementById("centralcontent"), "templates/showaddress.php");
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowAdd"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            thisElement.type="hidden";
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var btChangePwd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btChangePwd"});
          btChangePwd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.onclick=function(){
            (new Node()).refreshView(document.getElementById("centralcontent"), "templates/changepwd.php");
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btChangePwd"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            thisElement.type="hidden";
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
      <div style="position:relative;">
        <div data-id="butedit" class="btmiddleright"></div>
        <button type="button" class="btn" data-id="but"></button>
        <script>
          var logOut=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btLogOut"});
          logOut.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
          thisElement.onclick=function(){
              if (webuser.properties.id) {
                webuser.logoff();
              }
              (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
          }
        </script>
        <input type="hidden" disabled>
        <script>
          var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btLogOut"}).getRelationship("domelementsdata").getChild();
          myNode.writeProperty(thisElement);
          thisElement.onblur=function(){
            thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
            thisElement.type="hidden";
          }
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        </script>
      </div>
    </div>
  </div>
</template>
<script>
  //if cart it is not empty -> redirect to checkout
  if (mycart.getRelationship("cartitem").children.length>0) {
    (new Node()).refreshView(document.getElementById("centralcontent"), 'templates/checkout1.php');
  }
  else {
    (new Node()).refreshView(document.getElementById("centralcontent"), thisElement).then(function(){
      var url='?userarea=1';
      if (history.state && history.state.url==url) {
        return;
      }
      history.pushState({url:url}, null, url);
    });
  }
</script>
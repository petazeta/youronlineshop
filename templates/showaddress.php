<!-- 
This template shows the dashboard user data and user address and allows to save the changes when fieldtyp input.
It uses webuser
-->
<div id="dashboard">
  <div class="msgbox" style="position:relative;">
    <div data-id="butedit" class="btmiddleright"></div>
    <span></span>
    <script>
      var addresstt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"addresstt"});
      addresstt.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
      //adding the edition pencil
      if (webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        addresstt.getRelationship("domelementsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
    </script>
  </div>
  <div></div>
  <script>
    webuser.refreshView(thisElement, "templates/useraddressview.php", {fieldtype: 'input', showAddress: true});
  </script>
  <div class="dashbuttons">
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <button type="button" class="btn" data-id="but"></button>
      <script>
        var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
        bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
        thisElement.onclick=function(){
          (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
        }
      </script>
      <input type="hidden" disabled>
      <script>
        var myNode=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"}).getRelationship("domelementsdata").getChild();
        myNode.writeProperty(thisElement);
        thisElement.onblur=function(){
          thisElement.type="hidden";
          thisElement.parentElement.querySelector('button[data-id=but]').innerHTML=thisElement.value;
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
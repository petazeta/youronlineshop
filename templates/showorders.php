<div style="display:table; margin: 1em auto;">
  <form>
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="new" disabled>
      <script>
        var myNode=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"loggedin"}).getNextChild({"name":"showOrd"}).getNextChild({"name":"new"}).getRelationship({name: "domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          thisElement.type="text";
        }
        thisElement.onblur=function(){
          thisElement.form.elements.ordersStatus[0].innerHTML=thisElement.value;
        }
      </script>
    </div>
    <div style="position:relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <input type="hidden" name="archived" disabled>
      <script>
        var myNode=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"loggedin"}).getNextChild({"name":"showOrd"}).getNextChild({"name":"archived"}).getRelationship({name: "domelementsdata"}).getChild();
        myNode.writeProperty(thisElement);
        if (webuser.isWebAdmin()) {
          DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
          myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          thisElement.type="text";
        }
        thisElement.onblur=function(){
          thisElement.form.elements.ordersStatus[1].innerHTML=thisElement.value;
        }
      </script>
    </div>
    <select name="ordersStatus" class="btn">
      <option value="new"></option>
      <script>
        var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"loggedin"}).getNextChild({"name":"showOrd"}).getNextChild({"name":"new"}).getRelationship({name: "domelementsdata"}).getChild();
        myContent.writeProperty(thisElement);
      </script>
      <option value="archived"></option>
      <script>
        var myContent=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"loggedin"}).getNextChild({"name":"showOrd"}).getNextChild({"name":"archived"}).getRelationship({name: "domelementsdata"}).getChild();
        myContent.writeProperty(thisElement);
      </script>
    </select>
    <script>
      thisElement.onchange=function(){
        (new Node()).refreshView(document.getElementById("ordersContainer"),"templates/userorders.php", {filterorders: thisElement.options[thisElement.selectedIndex].value});
      }
    </script>
  </form>
</div>
<div style="margin-bottom:1em" id="ordersContainer"></div>
<script>
  (new Node()).refreshView(thisElement,"templates/userorders.php");
</script>
<div style="margin:auto; display:table; position:relative;">
  <div data-id="butedit" class="btmiddleright"></div>
  <button type="button" class="btn" data-id="but"></button>
  <script>
    var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
    bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
    thisElement.onclick=function(){
      webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
    };
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
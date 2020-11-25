<div style="position:relative">
  <div data-id="butedit" class="btmiddleright"></div>
  <button type="button" class="btn" data-id="but"></button>
  <script>
    var myNode=thisNode.getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild();
    myNode.writeProperty(thisElement);
    thisElement.onclick=function(){  
      mycart.tocheckout();
    }
  </script>
  <input type="hidden" disabled>
  <script>
    var myNode=thisNode.getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild();
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
    var myNode=thisNode.getNextChild({name: "discardtt"}).getRelationship({name: "domelementsdata"}).getChild();
    myNode.writeProperty(thisElement);
    thisElement.onclick=function(){  
      mycart.getRelationship("cartitem").children=[];
      mycart.refreshcartbox();
    }
  </script>
  <input type="hidden" disabled>
  <script>
    var myNode=thisNode.getNextChild({name: "discardtt"}).getRelationship({name: "domelementsdata"}).getChild();
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
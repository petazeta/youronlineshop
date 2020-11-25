<div class="paragraph" style="position:relative;">
  <div data-id="butedit" class="bttopleftinside"></div>
  <div data-id="butedit" class="bttopleft"></div>
  <div data-id="admnbuts" class="bttopleftinsideafteredit">
    <div class="admnbtsgrid"></div>
  </div>
  <div data-id='paragraph'></div>
  <script>
    thisNode.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
    if (webuser.isWebAdmin()) {
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleftinside]'), parent: thisElement.parentElement});
      thisNode.getRelationship("domelementsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleftinside]'), "templates/butedit.php", {editElement: thisElement});
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
      thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
      thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
      thisNode.parentNode.getNewNode().then((newNode) => {
        //newNode.getRelationship("domelementsdata").addChild(new NodeMale());
        newNode.sort_order=thisNode.sort_order + 1;
        thisNode.parentNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
      });
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleft]'), parent: thisElement.parentElement});
    }
  </script>  
  <input type="hidden" disabled>
  <script>
    var myNode=thisNode.getRelationship("domelementsdata").getChild();
    myNode.writeProperty(thisElement);
    thisElement.onblur=function(){
      thisElement.parentElement.querySelector('div[data-id=paragraph]').innerHTML=thisElement.value;
      thisElement.type="hidden";
    }
    //adding the edition pencil
    if (webuser.isWebAdmin()) {
      myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleft]'), "templates/butedit.php", {editElement: thisElement, image: 'code'});
    }
  </script>
</div>
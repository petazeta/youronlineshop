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
      thisNode.getRelationship("domelementsdata").getChild().appendThis(thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleftinside]'), "templates/butedit.php", {editElement: thisElement, thisAttribute: 'innerHTML', inlineEdition: false});
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=admnbuts]'), parent: thisElement.parentElement});
      thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butchpos.php", {position: 'vertical'});
      thisNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butdelete.php");
      thisNode.parentNode.getNewNode().then((newNode) => {
        //newNode.getRelationship("domelementsdata").addChild(new NodeMale());
        newNode.sort_order=thisNode.sort_order + 1;
        thisNode.parentNode.appendThis(thisElement.parentElement.querySelector('.admnbtsgrid'), "templates/butaddnewnode.php", {newNode: newNode});
      });
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleft]'), parent: thisElement.parentElement});
      thisElement.onblur=function(){
        thisElement.parentElement.querySelector('textarea').value=thisElement.innerHTML;
      }
    }
  </script>  
  <textarea style="display:none;" rows="6" cols="80" disabled></textarea>
  <script>
    var myNode=thisNode.getRelationship("domelementsdata").getChild();
    myNode.writeProperty(thisElement);
    thisElement.onblur=function(){
      thisElement.parentElement.querySelector('div[data-id=paragraph]').innerHTML=thisElement.value;
      thisElement.style.display="none";
    }
    //adding the edition pencil
    if (webuser.isWebAdmin()) {
      myNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleft]'), "templates/butedit.php", {editElement: thisElement, image: 'code', inlineEdition: false})
      .then(()=>{
        thisElement.parentElement.querySelector('[data-id=butedit][class=bttopleft]').querySelector('button[data-id=codebut]').addEventListener('click', ()=>{
          thisElement.style.display="unset";
          thisElement.focus();
        });
      });
    }
  </script>
</div>
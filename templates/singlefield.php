<!--
  It displays the properties of a node (a single property)
  It receives:
   editpropertyname
   (optional) labelNode, noEditLabel
   (optional) labelName
   editable []
   typeInput; default false
--> 
<div class="singlefield">
  <div class="form-group">
    <div style="display:table"></div>
    <script>
      if (thisParams.labelNode) {
        thisParams.labelNode.refreshView(thisElement, "templates/singlelabel.php", {editpropertyname: thisParams.editpropertyname, noEditLabel: thisParams.noEditLabel});
      }
      else if (thisParams.labelName) {
        (new Node).refreshView(thisElement, "templates/singlelabel.php", {labelName: thisParams.labelName});
      }
    </script>
    <div style="display:table; position: relative;">
      <div data-id="butedit" class="btmiddleright"></div>
      <span style="display: none"></span>
      <script>
        if (!thisParams.typeInput) {
          thisElement.style.display="unset";
          thisNode.writeProperty(thisElement, thisParams.editpropertyname);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement, thisProperty : thisParams.editpropertyname});
          }
        }
      </script>
      <input type="hidden" disabled>
      <script>
        if (thisParams.typeInput) {
          thisNode.writeProperty(thisElement, thisParams.editpropertyname);
          //adding the edition pencil
          if (webuser.isWebAdmin()) {
            thisElement.type="text";
            DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
            thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
          }
        }
      </script>
    </div>
  </div>
</div>
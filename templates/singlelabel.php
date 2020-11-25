<!--
  It displays the label from a properties of a node
  It receives:
    labelName if it is not a label node
    editpropertyname . It fits to the domelement name
-->
<div style="display:table; position: relative;">
  <div data-id="butedit" class="btmiddleright"></div>
  <label for="" class="form-label"></label>
  <script>
    if (thisParams.labelName) {
      thisElement.innerHTML=thisParams.labelName;
    }
    else {
      //It displays the label from some element
      var propertyLabelNode=thisNode.getNextChild({name: thisParams.editpropertyname}).getRelationship("domelementsdata").getChild();
      propertyLabelNode.writeProperty(thisElement);
      if (!thisParams.noEditLabel && webuser.isWebAdmin()) {
        DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
        propertyLabelNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
      }
    }
  </script>
</div>
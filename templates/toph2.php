<!--
-->
<div class="adminbuttonscontainer" style="position:relative;">
  <div data-id="butedit" class="btmiddleright"></div>
  <h2></h2>
  <script>
    thisNode.writeProperty(thisElement);
    //adding the edition pencil
    DomMethods.editListeners({thisNode: thisNode, refreshOnLog: true}); //to refresh when is loged in and out
    if (webuser.isWebAdmin()) {
      DomMethods.visibleOnMouseOver({element: thisElement.parentElement.querySelector('[data-id=butedit]'), parent: thisElement.parentElement});
      thisNode.appendThis(thisElement.parentElement.querySelector('[data-id=butedit]'), "templates/butedit.php", {editElement: thisElement});
    }
  </script>
</div>
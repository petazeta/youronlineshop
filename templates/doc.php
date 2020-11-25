<!--
-->
<div class="loader">
  <div class="elementloader"></div>
  <script>
    DomMethods.setSizeFromStyle(thisElement);
  </script>
</div>
<div style="padding-top:1em;"></div>
<script>
  thisNode.getRelationship("domelements").loadfromhttp({action: "load my tree", language: webuser.extra.language.properties.id}).then(function(myNode) {
    DomMethods.adminListeners({thisParent: myNode});
    myNode.refreshChildrenView(thisElement, "templates/paragraph.php");
  });
</script>
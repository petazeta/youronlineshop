<!--
  newStatus
-->
<button type="button" class="buttons">
  <div class="checkimage"></div>
  <script>
    if (thisParams.newStatus==0) {
      thisElement.className="undoimage";
    }
    if (window.getComputedStyle(thisElement).backgroundImage) {
      DomMethods.setSizeFromStyle(thisElement);
    }
  </script>
</button>
<script type="text/javascript">
  thisElement.onclick=function() {
    thisNode.loadfromhttp({action:"edit my properties", properties:{status: thisParams.newStatus}}).then(function(myNode){
      myNode.parentNode.removeChild(myNode);
      //for no children add a eventlistener to refreshChildrenView event
      if (myNode.parentNode.childContainer) myNode.parentNode.refreshChildrenView();
      myNode.parentNode.dispatchEvent("change order status", [myNode]);
      myNode.dispatchEvent("change order status")
    });
    return false;
  }
</script>
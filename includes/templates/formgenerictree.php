<template id="formgenerictreetp"> 
  <form style="display:none" action="dbrequest.php" id="formgenerictree">
    <input type="hidden" name="json" data-js='
      var mydata=new thisNode.constructor;
      mydata.load(thisNode);
      mydata.avoidrecursion();
      mydata.loadasc(thisNode,3);
      thisElement.value=JSON.stringify(mydata);
    '>
    <input type="hidden" name="parameters"/>
  </form>
</template>
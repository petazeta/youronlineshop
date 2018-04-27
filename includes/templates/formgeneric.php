<template id="formgenerictp"> 
   <form style="display:none" action="dbrequest.php" id="formgeneric">
    <input type="hidden" name="json" data-js='
      var mydata=new thisNode.constructor;
      mydata.loadasc(thisNode,2);
      thisElement.value=JSON.stringify(mydata);
    '>
    <input type="hidden" name="parameters"/>
  </form>
</template>
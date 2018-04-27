<template>
  <form action="dbrequest.php" style="display:none">
    <input type="hidden" name="json"/>
    <script>
      var mydata=new NodeMale();
      mydata.properties.id=thisNode.properties.id;
      mydata.parentNode=new NodeFemale();
      mydata.parentNode.loadasc(thisNode.parentNode,1);
      mydata.sort_order=thisNode.sort_order<?php echo $orderchange;?>;
      mydata.properties.oldsort_order=thisNode.sort_order;
      thisElement.value=JSON.stringify(mydata);
    </script>
    <input type="hidden" name="parameters" value='{"action":"edit my sort_order"}'/>
  </form>
</template>
<a style="display:block;height:100%;" href=""></a>
<script>
  //normalize
  var launcher=thisNode;
  var thisNode=launcher.myNode;
  var myForm=thisElement.parentElement.querySelector("template").content.querySelector("form").cloneNode(true);
  thisNode.setView(myForm);
  thisElement.parentElement.appendChild(myForm);
  thisElement.onclick=function() {
    var myresultorder=thisNode.sort_order<?php echo $orderchange;?>;
    if (myresultorder<1 || myresultorder>thisNode.parentNode.children.length) return false;
    thisParent=thisNode.parentNode;
    var myresult=new NodeMale();
    myresult.loadfromhttp(myForm, function(){
      var myelement=new NodeMale();
      thisParent.updateChild(this);
      thisParent.refreshChildrenView();
    });
    return false;
  }
</script>
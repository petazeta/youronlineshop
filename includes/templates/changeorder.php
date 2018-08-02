<template>
  <a style="display:block;height:100%;" href="javascript:void(0)"></a>
  <script>
    //normalize
    var launcher=thisNode;
    var thisNode=launcher.thisNode;
    thisElement.onclick=function() {
      var newSortOrder=thisNode.sort_order<?php echo $orderchange;?>;
      if (newSortOrder < 1 || newSortOrder > thisNode.parentNode.children.length) return false;
      thisNode.loadfromhttp({action:"edit my sort_order", newsort_order: newSortOrder}, function(){
	var updatedChild=new NodeMale();
	updatedChild.properties.id=this.properties.id;
	updatedChild.sort_order=newSortOrder;
	this.parentNode.updateChild(updatedChild); //it will refresh children sort_orders
	this.parentNode.refreshChildrenView();
      });
      return false;
    }
  </script>
</template>
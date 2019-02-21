<template>
  <table class="formtable">
    <tr>
      <td style="pading-bottom:0.5em; border-bottom:1px solid #666;"></td>
      <script>
	var myorderitems=thisNode.getRelationship({name:"cartboxitem"});
	myorderitems.refreshChildrenView(thisElement, "includes/templates/orderitem.php");
      </script>
    </tr>
    <tr>
      <td>
	<div class="form-group" style="text-align:right;padding-right:2.2em">
	  <span class="form-label"></span>
	  <script>
	    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
	    var total=checkout.getNextChild({"name":"order"}).getNextChild({"name":"subtotal"}).getRelationship({name:"domelementsdata"}).getChild();
	    total.writeProperty(thisElement);
	    //adding the edition pencil
	    var launcher = new Node();
	    launcher.thisNode = total;
	    launcher.editElement = thisElement;
	    launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	  </script>
	  <span></span>
	  <script>
	    var myorderitems=thisNode.getRelationship({name:"cartboxitem"});
	    myorderitems.sumTotal=function() {
	      var total=0;
	      var i=this.children.length;
	      while (i--) {
		total=total+this.children[i].properties.quantity * this.children[i].properties.price;
	      }
	      return total;
	    }
	    thisElement.textContent=myorderitems.sumTotal();
	  </script>
	  <span></span>
	  <script>
	    var currency=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"currency"}).getRelationship({name: "domelementsdata"}).getChild();
	    currency.writeProperty(thisElement);
	  </script>
	</div>
      </td>
    </tr>
  </table>
</template>
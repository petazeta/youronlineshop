<template>
  <table class="formtable">
    <tr>
      <td style="pading-bottom:0.5em; border-bottom:1px solid #666;"></td>
      <script>
	thisNode.addEventListener("propertychange", function(propertyname){
	  if (propertyname=="quantity" || propertyname=="price") {
	    thisNode.parentNode.refreshView();
	  }
	});
	thisNode.refreshChildrenView(thisElement, "includes/templates/orderitem.php");
      </script>
    </tr>
    <tr>
      <td>
	<div class="form-group" style="text-align:right;padding-right:2.2em">
	  <span class="form-label">Total</span>
	  <span></span>
	  <script>
	    thisNode.sumTotal=function() {
	      var total=0;
	      var i=this.children.length;
	      while (i--) {
		total=total+this.children[i].properties.quantity * this.children[i].properties.price;
	      }
	      return total;
	    }
	    thisElement.textContent=thisNode.sumTotal();
	  </script>
	  <span> &euro;</span>
	</div>
      </td>
    </tr>
  </table>
</template>
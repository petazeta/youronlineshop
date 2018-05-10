<template>
  <table class="formtable">
    <tr>
      <td style="pading-bottom:0.5em; border-bottom:1px solid #666;">
	<table style="width:100%" class="productlist" data-js='
	  thisNode.refreshChildrenView(thisElement, "includes/templates/orderitem.php");
	'>
	</table>
      </td>
    </tr>
    <tr>
      <td>
	<div class="form-group" style="text-align:right;">
	  <label class="form-label">Total</label>
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
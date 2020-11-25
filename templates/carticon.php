<div class="shoppingcartimage"></div>
<script>
  if (window.getComputedStyle(thisElement).backgroundImage) {
    DomMethods.setSizeFromStyle(thisElement);
  }
</script>
<div></div>
<script>
  thisNode.writeProperty(thisElement);
  document.getElementById("cartcontainer").addEventListener("click", function(ev){
    ev.preventDefault();
    var cartbox=document.getElementById("cartbox");
    DomMethods.switchVisibility(cartbox);
  });
</script>
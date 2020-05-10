<template>
    <img src="images/shoppingcart.svg">
    <div data-note="relative position container for admn buttons">
      <div></div>
      <script>
        thisNode.writeProperty(thisElement);
        document.getElementById("cartcontainer").addEventListener("click", function(ev){
          ev.preventDefault();
          var cartbox=document.getElementById("cartbox");
          var switchVisibility=function(velement){
            if (velement.style.visibility=="hidden") {
              velement.style.visibility="visible";
            }
            else {
              velement.style.visibility="hidden";
            }
          }
          switchVisibility(cartbox);
        });
      </script>
    </div>
</template>
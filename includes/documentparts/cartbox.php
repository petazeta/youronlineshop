<div class="sidebox" id="cartbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
    <div></div>
    <div style="padding-top:0.5em; text-align: center;"></div>
  </div>
</div>
<template>
  <table class="boxlist">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<script>
var mycart=new cart();
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#cartbox .boxtitle"), "includes/templates/cartboxhead.php");
  
  //Preparing cart items containers
  var cartItems=mycart.getRelationship({name:"cartbox"}).getChild().getRelationship({name:"cartboxitem"});
  var cartContainer=document.querySelector("#cartbox .boxbody div");
  cartItems.refreshChildrenView(cartContainer,  "includes/templates/itemlist.php");
  cartItems.addEventListener("refreshChildrenView", function() {
    cartContainer.appendChild(DomMethods.intoColumns(getTpContent(document.getElementById("cartbox").nextElementSibling).querySelector("table").cloneNode(true), cartContainer, 1));
  });
  var cartboxckout=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild()
  cartboxckout.refreshView(document.querySelectorAll("#cartbox .boxbody div")[1], "includes/templates/cartboxckout.php");
});
</script>
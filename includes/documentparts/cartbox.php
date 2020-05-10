<div class="sidebox" id="cartbox" style="visibility:hidden;">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
    <div data-id="itemlistcontainer"></div>
    <div data-id="checkoutcontainer" style="padding-top:0.5em; text-align: center;"></div>
  </div>
</div>
<script>
  var mycart=new cart();
  //Preparing cart items containers
  var cartItems=mycart.getRelationship({name:"cartbox"}).getChild().getRelationship({name:"cartboxitem"});
  var cartContainer=document.querySelector("#cartbox [data-id=itemlistcontainer]");
  cartItems.refreshChildrenView(cartContainer,  "templates/itemlist.php");
  domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
    var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
    cartboxtt.refreshView(document.querySelector("#cartbox .boxtitle"), "templates/cartboxhead.php");
    var cartboxckout=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild()
    cartboxckout.refreshView(document.querySelector("#cartbox [data-id=checkoutcontainer]"), "templates/cartboxckout.php");
  });
</script>

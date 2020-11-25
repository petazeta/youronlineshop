<div class="sidebox" id="cartbox" style="visibility:hidden;">
  <div class="bttopinsideleftinside">
    <button type="button" class="closeimage minibtn transp" style="margin-left:5px; margin-top: 5px; width: 15px; height: 15px;"></button>
  </div>
  <div class="boxtitle">
  </div>
  <div class="boxbody">
    <div data-id="itemlistcontainer"></div>
    <div data-id="checkoutcontainer" class="checkoutcontainer"></div>
  </div>
</div>
<script>
  var mycart;
  domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
    mycart = new cart();
    document.getElementById("cartbox").getElementsByTagName("button")[0].addEventListener("click",  function(){
      document.getElementById("cartbox").style.visibility="hidden";
    });
    //Preparing cart items containers
    var cartItems=mycart.getRelationship({name:"cartbox"}).getChild().getRelationship({name:"cartboxitem"});
    var cartContainer=document.querySelector("#cartbox [data-id=itemlistcontainer]");
    cartItems.refreshChildrenView(cartContainer,  "templates/itemlist.php");
    var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
    cartboxtt.refreshView(document.querySelector("#cartbox .boxtitle"), "templates/cartboxhead.php");
    var cartboxckout=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"});
    cartboxckout.refreshView(document.querySelector("#cartbox [data-id=checkoutcontainer]"), "templates/cartboxckout.php");
    //to refresh the editbuttons when log
    webuser.addEventListener("log", () => {
      cartboxtt.refreshView(document.querySelector("#cartbox .boxtitle"), "templates/cartboxhead.php");
      cartboxckout.refreshView(document.querySelector("#cartbox [data-id=checkoutcontainer]"), "templates/cartboxckout.php");
    }, "cartRefresh");
  });
</script>

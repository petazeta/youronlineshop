<div class="sidebox" id="cartbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
    <div></div>
    <div style="padding-top:0.5em; text-align: center;"></div>
  </div>
</div>

<template id="cartboxheadtp">
  <span>
    <a href="javascript:"></a>
    <script>
      thisNode.writeProperty(thisElement);
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      thisElement.addEventListener("click", function(ev){
	ev.preventDefault();
	mycart.tocheckout();
      });
    </script>
  </span>
</template>
<template>
  <table class="boxlist">
    <tr>
      <td class="boxlist">
      </td>
    </tr>
  </table>
</template>
<template id="itemlisttp">
  <div>
    <a href=""></a>
    <script>
      thisNode.writeProperty(thisElement, "quantity");
      thisElement.addEventListener("click", function(ev){
	ev.preventDefault();
	mycart.additem(thisNode,-thisNode.properties.quantity);
	mycart.refreshcartbox();
      });
      thisElement.onmouseover=function(){
	this.textContent="X";
	this.style.fontWeight="bold";
      };
      thisElement.onmouseout=function(){
	thisNode.writeProperty(this, "quantity");
	this.style.fontWeight="normal";
      };
    </script>
    <a title="+ Info" href="javascript:"></a>
    <script>thisNode.writeProperty(thisElement, "name");</script>
    <span></span>
    <script>thisNode.writeProperty(thisElement, "price");</script>
    <span> €</span>
  </div>
</template>
<template id="cartboxckouttp">
  <span>
    <button class="btn"></button>
    <script>
      thisNode.writeProperty(thisElement);
      var launcher = new Node();
      launcher.thisNode = thisNode;
      launcher.editElement = thisElement;
      launcher.createInput=true;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
      thisElement.onclick=function(){  
	mycart.tocheckout();
      }
    </script>
  </span>
</template>

<script>
var mycart=new cart();
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var cartboxtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "crtbxtt"}).getRelationship({name: "domelementsdata"}).getChild();
  cartboxtt.refreshView(document.querySelector("#cartbox .boxtitle"), document.querySelector("#cartboxheadtp"));
  
  //Preparing cart items containers
  var cartItems=mycart.getRelationship({name:"cartbox"}).getChild().getRelationship({name:"cartboxitem"});
  var cartContainer=document.querySelector("#cartbox .boxbody div");
  cartItems.refreshChildrenView(cartContainer,  document.querySelector("#itemlisttp"));
  cartItems.addEventListener("refreshChildrenView", function() {
    cartContainer.appendChild(DomMethods.intoColumns(getTpContent(document.querySelector("#itemlisttp").previousElementSibling).querySelector("table").cloneNode(true), cartContainer, 1));
  });
  var cartboxckout=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild()
  cartboxckout.refreshView(document.querySelectorAll("#cartbox .boxbody div")[1], document.querySelector("#cartboxckouttp"));
});
</script>
<div class="sidebox" id="cartbox">
  <div class="boxtitle">
  </div>
  <div class="boxbody">
    <div></div>
    <div style="padding-top:0.5em; text-align: center;"></div>
  </div>
</div>

<template id="cartboxheadtp">
  <div class="adminlauncher adminsinglelauncher">
    <a href=""></a>
    <script>
      thisElement.textContent=thisNode.properties.value || emptyValueText;
      thisElement.onclick=function(){  
	mycart.tocheckout();
	return false;
      }
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var admnlauncher=new NodeMale();
	admnlauncher.myNode=thisNode;
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	}];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!webuser.isWebAdmin()) {
	  thisElement.innerHTML="";
	}
	else {
	  addadminbutts();
	}
      });
    </script>
  </div>
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
      thisElement.textContent=thisNode.properties.quantity;
      thisElement.onclick=function(){
	mycart.additem(thisNode,-thisNode.properties.quantity);
	mycart.refreshcartbox();
	return false;
      };
      thisElement.onmouseover=function(){
	this.textContent="X";
	this.style.fontWeight="bold";
      };
      thisElement.onmouseout=function(){
	this.textContent=thisNode.properties.quantity;
	this.style.fontWeight="normal";
      };
    </script>
    <a title="+ Info" href="javascript:void(0)"></a>
    <script>thisElement.textContent=thisNode.properties.name;</script>
    <span></span>
    <script>thisElement.textContent=thisNode.properties.price;</script>
    <span> €</span>
  </div>
</template>
<template id="cartboxckouttp">
  <div class="adminlauncher adminsinglelauncher">
    <a href="" class="btn"></a>
    <script>
      thisElement.textContent=thisNode.properties.value || emptyValueText;
      thisElement.onclick=function(){  
	mycart.tocheckout();
	return false;
      }
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var admnlauncher=new NodeMale();
	admnlauncher.myNode=thisNode;
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {editpropertyname:"value", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	}];
	admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
      }
      if (webuser.isWebAdmin()) {
	addadminbutts();
      }
      webuser.addEventListener("log", function() {
	if (!this.isWebAdmin()) {
	  thisElement.innerHTML='';
	}
	else {
	  addadminbutts();
	}
      });
    </script>
  </div>
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
    cartContainer.appendChild(intoColumns(document.querySelector("#itemlisttp").previousElementSibling.content.querySelector("table").cloneNode(true), cartContainer, 1));
  });
  var cartboxckout=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"cartbox"}).getNextChild({name: "ckouttt"}).getRelationship({name: "domelementsdata"}).getChild()
  cartboxckout.refreshView(document.querySelectorAll("#cartbox .boxbody div")[1], document.querySelector("#cartboxckouttp"));
});
</script>
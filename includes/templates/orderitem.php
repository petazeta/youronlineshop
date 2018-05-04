<template>
  <tr>
    <td>
      <div class="adminsinglelauncher">
	<span title="" href="" data-js='
	  thisElement.textContent=thisNode.properties.quantity;
	'>
	</span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  thisElement.parentElement.style.paddingRight="1em";
	  var launcher=new NodeMale();
	  launcher.editpropertyname="quantity";
	  launcher.editelement=thisElement.parentElement.firstElementChild;
	  launcher.myNode=thisNode;
	  launcher.myContainer=thisElement;
	  launcher.myTp=document.getElementById("butedittp").content;
	  launcher.refreshView();
	  thisNode.addEventListener("propertychange", function(propertyname){
	    if (propertyname=="quantity" || propertyname=="price") {
	      thisNode.parentNode.refreshView();
	    }
	  });
	}
	</script>
      </div>
      </td>
      <td>
      <div class="adminsinglelauncher">
	<span data-js='
	  thisElement.innerHTML=thisNode.properties.name;
	'></span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  thisElement.parentElement.style.paddingRight="1em";
	  var launcher=new NodeMale();
	  launcher.editpropertyname="name";
	  launcher.editelement=thisElement.parentElement.firstElementChild;
	  launcher.myNode=thisNode;
	  launcher.myContainer=thisElement;
	  launcher.myTp=document.getElementById("butedittp").content;
	  launcher.refreshView();
	}
	</script>
      </div>
      </td>
      <td>
      <div class="adminsinglelauncher">
	<span data-js='
	  thisElement.innerHTML=thisNode.properties.price;
	'></span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  var launcher=new NodeMale();
	  launcher.editpropertyname="price";
	  launcher.editelement=thisElement.parentElement.firstElementChild;
	  launcher.myNode=thisNode;
	  launcher.myContainer=thisElement;
	  launcher.myTp=document.getElementById("butedittp").content;
	  launcher.refreshView();
	}
	</script>
	<span> &euro;</span>
      </div>
      
    </td>
  </tr>
</template>
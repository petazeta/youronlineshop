<template>
  <tr>
    <td>
      <div class="adminlauncher adminsinglelauncher">
	<span title="" href="" data-js='
	  thisElement.textContent=thisNode.properties.quantity;
	'>
	</span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  thisElement.parentElement.style.paddingRight="1em";
	  var admnlauncher=new NodeMale();
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[{
	    template: document.getElementById("butedittp"),
	    args: {editpropertyname:"quantity", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	  }];
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
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
      <div class="adminlauncher adminsinglelauncher">
	<span data-js='
	  thisElement.innerHTML=thisNode.properties.name;
	'></span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  thisElement.parentElement.style.paddingRight="1em";
	  var admnlauncher=new NodeMale();
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[{
	    template: document.getElementById("butedittp"),
	    args: {editpropertyname:"name", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	  }];
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	}
	</script>
      </div>
      </td>
      <td>
      <div class="adminlauncher adminsinglelauncher">
	<span data-js='
	  thisElement.innerHTML=thisNode.properties.price;
	'></span>
	<div class="btrightedit"></div>
	<script>
	if (webuser.getUserType()=="orders administrator") {
	  var admnlauncher=new NodeMale();
	  admnlauncher.myNode=thisNode;
	  admnlauncher.buttons=[{
	    template: document.getElementById("butedittp"),
	    args: {editpropertyname:"price", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
	  }];
	  admnlauncher.refreshView(thisElement, document.getElementById("admnbutstp"));
	}
	</script>
	<span> &euro;</span>
      </div>
      
    </td>
  </tr>
</template>
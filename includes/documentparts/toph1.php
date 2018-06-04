<div></div>
<template>
  <div class="adminlauncher adminsinglelauncher">
    <h1></h1>
    <script>
      thisElement.textContent=thisNode.properties.value || emptyValue;
      if (thisNode.properties.value) document.title=thisNode.properties.value;
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
domelementsrootmother.addEventListener(["loadLabels1", "changeLanguage"], function(){
  this.children[0].getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headtitle"}).getRelationship({name: "domelementsdata"}).children[0].refreshView(document.querySelector("#topheadtitle div"), document.querySelector("#topheadtitle template"));
});
</script>
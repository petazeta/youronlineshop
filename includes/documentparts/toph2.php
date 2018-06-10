<div></div>
<template>
  <div class="adminlauncher adminsinglelauncher">
    <h2></h2>
    <script>
      thisElement.textContent=thisNode.properties.value || emptyValueText;
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var admnlauncher=new NodeMale();
	admnlauncher.buttons=[{
	  template: document.getElementById("butedittp"),
	  args: {thisNode: thisNode, editpropertyname:"innerHTML", allowedHTML:false, editelement:thisElement.parentElement.firstElementChild}
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
domelementsrootmother.addEventListener(["loadLabels", "changeLanguage"], function(){
  var headtt=this.getChild().getNextChild({name: "labels"}).getNextChild({"name":"top"}).getNextChild({"name":"headsubtitle"});
  headtt.getRelationship({name: "domelementsdata"}).getChild().refreshView(document.querySelector("#topheadsubtitle div"), document.querySelector("#topheadsubtitle template"));
});
</script>
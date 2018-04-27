<div></div>
<template>
  <div class="adminsinglelauncher">
    <h1></h1>
    <script>
      thisElement.textContent=thisNode.properties.innerHTML || websectionsroot.getRelationship({name: "websections_domelements"}).getChild({name: "emptyvallabel"}).properties.innerHTML;
      if (thisNode.properties.innerHTML) document.title=thisNode.properties.innerHTML;
    </script>
    <div class="btrightedit"></div>
    <script>
      var addadminbutts=function(){
	var launcher=new NodeMale();
	launcher.editpropertyname="innerHTML";
	launcher.editelement=thisElement.parentElement.firstElementChild;
	launcher.myNode=thisNode;
	launcher.myContainer=thisElement;
	launcher.myTp=document.getElementById("butedittp").content;
	launcher.refreshView();
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
webuser.addEventListener("loadses", function(){
  var topsection=websectionsroot.getRelationship({"name":"websections"}).getChild({"name":"top"});
  var headtt=topsection.getRelationship({"name":"websections_domelements"}).getChild({"name":"headtitle"});
  headtt.refreshView(document.querySelector("#topheadtitle div"), document.querySelector("#topheadtitle template"));
});
</script>
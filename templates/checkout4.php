<template>
  <!-- we show order made and give the option to go to the user area-->
  <template>
    <div class="msgbox">
      <span></span>
      <script>
	var title=thisNode.getNextChild({"name":"chkt4add"}).getRelationship({name:"domelementsdata"}).getChild();
	title.writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = title;
	launcher.editElement = thisElement;
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
      </script>
    </div>
    <div></div>
    <script>
      //We show the order
      webuser.getRelationship({name:"orders"}).getChild().refreshView(thisElement, "templates/order.php");
    </script>
    <div style="margin:1em auto; display:table;">
      <button class="btn"></button>
      <script>
	var bckloginlabel=thisNode.getNextChild({"name":"chkt4userarea"}).getRelationship({name:"domelementsdata"}).getChild();
	bckloginlabel.writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = bckloginlabel;
	launcher.editElement = thisElement;
	launcher.createInput = true;
	launcher.visibility="visible";
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	thisElement.onclick=function(){
	  webuser.refreshView(document.getElementById("centralcontent"), "templates/loggedindata.php");
	};
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    var checkout=domelementsroot.getNextChild({name: "labels"}).getNextChild({"name":"middle"}).getNextChild({"name":"checkout"});
    checkout.refreshView(thisElement,thisElement.previousElementSibling);
  </script>
</template>
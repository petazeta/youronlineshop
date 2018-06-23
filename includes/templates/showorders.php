<template>
  <div style="width:100%; text-align:center; padding:1em 0">
    <form>
      <select class="btn">
	<option value="new"></option>
	<script>
	  var unarchivedtt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"unarchived"});
	  unarchivedtt.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	</script>
	<option value="archived"></option>
	<script>
	  var archivedtt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"archived"});
	  archivedtt.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	</script>
      </select>
      <script>
	thisElement.onchange=function(){
	  var container=closesttagname.call(this,"DIV").nextElementSibling;
	  var launcher=new Node();
	  launcher.filterorders=thisElement.options[thisElement.selectedIndex].value;
	  launcher.refreshView(container,"includes/templates/userorders.php");
	}
      </script>
	<input type="hidden" id="textinput">
	<script>
	  var unarchivedtt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"unarchived"});
	  unarchivedtt.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	  //adding the edition pencil
	  var launcher = new Node();
	  launcher.thisNode = unarchivedtt.getRelationship("domelementsdata").getChild();
	  launcher.editElement = thisElement;
	  launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	</script>
    </form>
  </div>
  <div style="margin-bottom:1em"></div>
  <script>
    var launcher=new Node();
    launcher.filterorders="new";
    launcher.refreshView(thisElement,"includes/templates/userorders.php");
  </script>
  <div style="margin:auto; display:table;">
  <button class="btn"></button>
  <script>
    var bckloginlabel=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"backToLoginLb"});
    bckloginlabel.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
    //adding the edition pencil
    var launcher = new Node();
    launcher.thisNode = bckloginlabel.getRelationship("domelementsdata").getChild();
    launcher.editElement = thisElement;
    launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    thisElement.onclick=function(){
      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
    };
  </script>
  </div>
</template>
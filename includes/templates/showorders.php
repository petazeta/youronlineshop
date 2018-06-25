<template>
  <div style="display:table; margin: 1em auto;">
    <form>
      <select name="ordersStatus" class="btn">
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
	  var container=document.getElementById("ordersContainer");
	  var launcher=new Node();
	  launcher.filterorders=thisElement.options[thisElement.selectedIndex].value;
	  launcher.refreshView(container,"includes/templates/userorders.php");
	}
      </script>
    </form>
    <script>
      var unarchivedtt=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"unarchived"});
      //adding the edition pencil
      var launcher = new Node();
      launcher.thisNode = unarchivedtt.getRelationship("domelementsdata").getChild();
      launcher.editElement=thisElement.elements.ordersStatus.options[0];
      launcher.createInput=true;
      launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    </script>
  </div>
  <div style="margin-bottom:1em" id="ordersContainer"></div>
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
    launcher.createInput = true;
    launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
    thisElement.onclick=function(){
      webuser.refreshView(document.getElementById("centralcontent"), "includes/templates/loggedindata.php");
    };
  </script>
  </div>
</template>
<template>
  <template>
    <div style="padding-bottom: 1em; text-align:center">
      <div class="msgbox"></div>
      <script>
	webuser.writeProperty(thisElement, "username");
      </script>
    </div>
    <template id="userdatatp">
      <table class="formtable">
	<tr>
	  <td>
	  </td>
	</tr>
      </table>
    </template>
    <div></div>
    <script>
      var datarel=webuser.getRelationship("usersdata");
      function showdata(){
	datarel.getChild().editable=true;
	datarel.getChild().refreshPropertiesView(thisElement,"includes/templates/singlefield.php", function(){
	  thisElement.appendChild(DomMethods.intoColumns(getTpContent(document.getElementById("userdatatp")).querySelector("table").cloneNode(true), thisElement, 2));
	});
      }
      if (datarel.children.length==0) {
	datarel.loadfromhttp({action: "load my children", user_id: webuser.properties.id}, showdata)
      }
      else showdata();
    </script>
    <div style="margin:auto; display:table; margin-bottom: 1em;">
      <button class="btn"></button>
      <script>
	var btShowOrd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowOrd"});
	btShowOrd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = btShowOrd.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.createInput=true;
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	thisElement.onclick=function(){
	  (new Node()).refreshView(document.getElementById("centralcontent"), "includes/templates/showorders.php");
	}
      </script>
    </div>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
	var btShowAdd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowAdd"});
	btShowAdd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = btShowAdd.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.createInput=true;
	launcher.appendThis(thisElement.parentElement, "includes/templates/addbutedit.php");
	thisElement.onclick=function(){
	  (new Node()).refreshView(document.getElementById("centralcontent"), "includes/templates/showaddress.php");
	}
      </script>
    </div>
  </template>
  <div></div>
  <script>
    //if cart it is not empty -> redirect to checkout
    if (mycart.getRelationship("cartitem").children.length>0) {
      (new Node()).refreshView(document.getElementById("centralcontent"), 'includes/templates/checkout1.php');
    }
    else {
      (new Node()).refreshView(document.getElementById("centralcontent"), thisElement.parentElement.querySelector("template"));
    }
  </script>
</template>
<template>
  <template>
    <div style="padding-bottom: 1em; text-align:center">
      <div class="msgbox"></div>
      <script>
	webuser.writeProperty(thisElement, "username");
      </script>
    </div>
    <div style="display:grid; grid-template-columns: auto auto; width:40em;" class="formtable"></div>
    <script>
      var datarel=webuser.getRelationship("usersdata");
      function showdata(){
	datarel.getChild().editable=true;
	datarel.getChild().refreshPropertiesView(thisElement,"templates/singlefield.php");
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
	launcher.visibility="visible";
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	thisElement.onclick=function(){
	  (new Node()).refreshView(document.getElementById("centralcontent"), "templates/showorders.php");
	}
      </script>
    </div>
    <div style="margin:auto; display:table; margin-bottom: 1em;">
      <button class="btn"></button>
      <script>
	var btShowAdd=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btShowAdd"});
	btShowAdd.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = btShowAdd.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.createInput=true;
	launcher.visibility="visible";
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	thisElement.onclick=function(){
	  (new Node()).refreshView(document.getElementById("centralcontent"), "templates/showaddress.php");
	}
      </script>
    </div>
    <div style="margin:auto; display:table;">
      <button class="btn"></button>
      <script>
	var logOut=domelementsrootmother.getChild().getNextChild({name:"labels"}).getNextChild({name:"middle"}).getNextChild({name:"loggedin"}).getNextChild({name:"btLogOut"});
	logOut.getRelationship("domelementsdata").getChild().writeProperty(thisElement);
	//adding the edition pencil
	var launcher = new Node();
	launcher.thisNode = logOut.getRelationship("domelementsdata").getChild();
	launcher.editElement = thisElement;
	launcher.createInput=true;
	launcher.visibility="visible";
	launcher.appendThis(thisElement.parentElement, "templates/addbutedit.php");
	thisElement.onclick=function(){
            if (webuser.properties.id) {
              webuser.logoff();
            }
            (new Node()).refreshView(document.getElementById("centralcontent"), "templates/loginform.php");
	}
      </script>
    </div>
  </template>
  <div style="text-align:center"></div>
  <script>
    //if cart it is not empty -> redirect to checkout
    if (mycart.getRelationship("cartitem").children.length>0) {
      (new Node()).refreshView(document.getElementById("centralcontent"), 'templates/checkout1.php');
    }
    else {
      (new Node()).refreshView(document.getElementById("centralcontent"), thisElement.parentElement.querySelector("template"), function(){
	var url='?userarea=1';
	if (history.state && history.state.url==url) {
	  return;
	}
	history.pushState({url:url}, null, url);
      });
    }
  </script>
</template>
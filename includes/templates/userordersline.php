<template>
<tr class="adminlauncher" style="display:table-row">
  <td >
    <span></span>
    <script>
      if (thisNode.properties.creationdateformat) {
	thisElement.innerHTML=thisNode.properties.creationdateformat;
      }
      else {
	thisElement.innerHTML=thisNode.properties.creationdate;
      }
    </script>
  </td>
  <td >
    <a href=""></a>
    <script>
      var thisUser=webuser; //When it is not orders administrator
      if (webuser.getUserType()=="orders administrator") {
      //Complit user information
	var myform=document.getElementById("formgeneric").cloneNode(true);
	myform.elements.parameters.value=JSON.stringify({action: "load my relationships"});
	thisUser=thisNode.getRelationship({name: "users"}).children[0];
	thisUser.setView(myform);
	thisUser.loadfromhttp(myform, function() {
	  var myform=document.getElementById("formgeneric").cloneNode(true);
	  myform.elements.parameters.value=JSON.stringify({action: "load my children"});
	  var datarel=this.getRelationship({name:"usersdata"});
	  datarel.setView(myform);
	  datarel.loadfromhttp(myform, function() {
	    thisElement.textContent=this.children[0].properties.name + " " + this.children[0].properties.surname;
	  });
	});
      }
      else {
	thisElement.textContent=webuser.getRelationship({name:"usersdata"}).children[0].properties.name + " " + webuser.getRelationship({name:"usersdata"}).children[0].properties.surname;
      }
      //Show the address
      var launcher=new NodeMale();
      launcher.addEventListener("closewindow", function(){
	var orderContainerRow=closesttagname.call(this.myContainer, "TR");
	closesttagname.call(orderContainerRow, "TABLE").deleteRow(orderContainerRow.rowIndex);
	this.openview=false;
      });
      thisElement.onclick=function(){
      	if (launcher.openview) return false;
	var thisRow=closesttagname.call(thisElement, "TR");
	var thisTable=closesttagname.call(thisElement, "TABLE");
	myrow=thisTable.insertRow(thisRow.rowIndex+1);
	mycell=myrow.insertCell(0);
	mycell.colSpan=5;
	launcher.myNode=thisUser;
	launcher.myNode.myTp="includes/templates/useraddress.php";
	launcher.refreshView(mycell, "includes/templates/rmbox.php", function(){this.openview=true});
        return false;
      }
    </script>
  </td>
  <td style="text-align:center;">
    <a href="">
      <img src="includes/css/images/view.png"/>
    </a>
    <script>
      var launcher=new NodeMale();
      //To remove not only de order but the order row container
      launcher.addEventListener("closewindow", function(){
	var orderContainerRow=closesttagname.call(this.myContainer, "TR");
	closesttagname.call(orderContainerRow, "TABLE").deleteRow(orderContainerRow.rowIndex);
	this.openview=false;
      });
      thisElement.onclick=function(){
	if (launcher.openview) return false;
	var myform=document.getElementById("formgeneric").cloneNode(true);
        myform.elements.parameters.value=JSON.stringify({action: "load my tree", user_id: webuser.properties.id});
        thisNode.setView(myform);
        thisNode.loadfromhttp(myform, function() {
	  var thisRow=closesttagname.call(thisElement, "TR");
	  var thisTable=closesttagname.call(thisElement, "TABLE");
	  myrow=thisTable.insertRow(thisRow.rowIndex+1);
	  mycell=myrow.insertCell(0);
	  mycell.colSpan=5;
	  launcher.myNode=this.getRelationship({name:"orderitems"});
	  launcher.myNode.myTp="includes/templates/order.php";
          launcher.refreshView(mycell, "includes/templates/rmbox.php", function(){this.openview=true});
        });
        return false;
      }
    </script>
  </td>
  <td>
    <div></div>
    <script>
      var admnlauncher=new NodeMale();
      admnlauncher.butadminposition="vertical";
      admnlauncher.myNode=thisNode;
      admnlauncher.refreshView(thisElement,"includes/templates/admnorderactions.php");
    </script>
  </td>
</tr>
</template>
<template>
<tr class="adminlauncher" style="display:table-row">
  <td>
    <span></span>
    <script>
      thisNode.writeProperty(thisElement, "creationdate");
    </script>
  </td>
  <td >
    <a href=""></a>
    <script>
      var thisUser=webuser; //When it is not orders administrator
      if (webuser.getUserType()=="orders administrator") {
      //Complit user information
	thisUser=thisNode.parentNode.partnerNode;
	thisUser.loadfromhttp({action: "load my relationships"}, function() {
	  var datarel=this.getRelationship({name:"usersdata"});
	  datarel.loadfromhttp({action: "load my children"}, function() {
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
	var orderContainerRow=DomMethods.closesttagname(this.myContainer, "TR");
	DomMethods.closesttagname(orderContainerRow, "TABLE").deleteRow(orderContainerRow.rowIndex);
	this.openview=false;
      });
      thisElement.onclick=function(){
      	if (launcher.openview) return false;
	var thisRow=DomMethods.closesttagname(thisElement, "TR");
	var thisTable=DomMethods.closesttagname(thisElement, "TABLE");
	myrow=thisTable.insertRow(thisRow.rowIndex+1);
	mycell=myrow.insertCell(0);
	mycell.colSpan=5;
	launcher.myNode=thisUser;
	launcher.myNode.myTp="templates/useraddress.php";
	launcher.refreshView(mycell, "templates/rmbox.php", function(){this.openview=true});
        return false;
      }
    </script>
  </td>
  <td style="text-align:center;">
    <a href="">
      <img src="css/images/view.png"/>
    </a>
    <script>
      var launcher=new NodeMale();
      //To remove not only de order but the order row container
      launcher.addEventListener("closewindow", function(){
	var orderContainerRow=DomMethods.closesttagname(this.myContainer, "TR");
	DomMethods.closesttagname(orderContainerRow, "TABLE").deleteRow(orderContainerRow.rowIndex);
	this.openview=false;
      });
      thisElement.onclick=function(){
	if (launcher.openview) return false;
        thisNode.loadfromhttp({action: "load my tree", user_id: webuser.properties.id}, function() {
	  var thisRow=DomMethods.closesttagname(thisElement, "TR");
	  var thisTable=DomMethods.closesttagname(thisElement, "TABLE");
	  myrow=thisTable.insertRow(thisRow.rowIndex+1);
	  mycell=myrow.insertCell(0);
	  mycell.colSpan=5;
	  launcher.myNode=this;
	  launcher.myNode.myTp="templates/order.php";
          launcher.refreshView(mycell, "templates/rmbox.php", function(){this.openview=true});
        });
        return false;
      }
    </script>
  </td>
  <template>
    <td>
      <div></div>
      <script>
	if (webuser.getUserType()=="orders administrator") {
	  var admnlauncher=new NodeMale();
	  var myNewStatus=1;
	  if (thisNode.properties.status==1) myNewStatus=0;
	  admnlauncher.buttons=[
	    {template: "templates/butsuccessorder.php", args:{thisNode: thisNode, newStatus: myNewStatus}},
	    {template: "templates/butdelete.php", args:{thisNode: thisNode}}
	  ];
	  admnlauncher.refreshView(thisElement, "templates/admnbuts.php");
	}
      </script>
    </td>
  </template>
</tr>
<script>
  if (webuser.getUserType()=="orders administrator") {
    thisNode.appendThis(thisElement, thisElement.querySelector("template"), null, true)
  }
</script>
</template>
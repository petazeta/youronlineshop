<template>
  <table class="adminedit">
    <tr>
      <td style="padding-right:6px"></td>
      <script>
	if (!thisNode.myNode.parentNode.properties.childtablelocked==1 && webuser.getUserType()=="orders administrator") {
	  var but=new NodeMale();
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("butsuccessordertp").content;
	  but.refreshView();
	}
      </script>
      <td style="padding-right:6px"></td>
      <script>
	if (!thisNode.myNode.parentNode.properties.childtablelocked==1 && (webuser.getUserType()=="orders administrator" || thisNode.properties.status==0)) {
	  var but=new NodeMale();
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("butdeletetp").content;
	  but.refreshView();
	}
      </script>
    <tr>
  </table>
<template>
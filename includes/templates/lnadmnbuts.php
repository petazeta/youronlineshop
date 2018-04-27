<template id="lnadmnbutstp">
  <table class="adminedit">
    <tr>
      <td style="padding:2px"></td>
      <script>
	if (!thisNode.includeeditbutton) {
	  thisElement.style.display="none";
	}
	else {
	  var but=new NodeMale();
	  but.editpropertyname=thisNode.editpropertyname;
	  but.editelement=thisNode.editelement;
	  but.allowedHTML=thisNode.allowedHTML;
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("butedittp").content;
	  but.refreshView();
	}
      </script>
      <td style="padding:2px"></td>
      <script>
	if (thisNode.myNode.sort_order && thisNode.myNode.parentNode.children.length>1) {
	  var but=new NodeMale();
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("buthchpostp").content;
	  if (thisNode.butadminposition=="vertical") but.myTp=document.getElementById("butvchpostp").content;
	  but.refreshView();
	}
      </script>
      <td style="padding:2px"></td>
      <script>
	if (!(thisNode.myNode.parentNode.properties.childunique==1 && thisNode.myNode.properties.id) && !(thisNode.myNode.parentNode.properties.childtablelocked==1)) {
	  var but=new NodeMale();
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("butaddnodetp").content;
	  but.refreshView();
	}
      </script>
      <td style="padding:2px"></td>
      <script>
	if (!thisNode.myNode.parentNode.properties.childtablelocked==1) {
	  var but=new NodeMale();
	  but.myNode=thisNode.myNode;
	  but.myContainer=thisElement;
	  but.myTp=document.getElementById("butdeletetp").content;
	  but.refreshView();
	}
      </script>
    </tr>
  </table>
  <script>
    //Change buttons to two rows
    if (thisNode.butadminrows=="2") {
      var myRow=thisElement.insertRow(1);
      myRow.appendChild(thisElement.rows[0].cells[0]);
      myRow.appendChild(thisElement.rows[0].cells[0]);
    };
  </script>
</template>
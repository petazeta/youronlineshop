<template id="buteditlinktp">
  <a href="" style="margin:2px" data-js='
    thisElement.onclick=function() {
      var myalert=thisElement.lastElementChild.cloneNode(true);
      var myform=myalert.getElementsByTagName("form")[0];
      var loadcandidatesnode=new NodeFemale();
      var loadcandidatesform=thisElement.getElementsByTagName("form")[0];
      myform.onsubmit=function() {
	var myresult=new NodeMale();
	var thisParent=thisNode.parentNode;
	myresult.loadfromhttp(this, function(){
	  var replaceelement=loadcandidatesnode.children[myform.getElementsByTagName("select")[0].selectedIndex];
	  replaceelement.sort_order=thisNode.sort_order;
	  thisParent.replaceChild(thisNode, replaceelement);
	  thisParent.refreshChildrenView();
	});
	myalert.parentElement.removeChild(myalert);
	return false;
      }
      loadcandidatesnode.getTp("includes/templates/reloption.php", function(){
	loadcandidatesnode.childTp=loadcandidatesnode.xmlTp;
	if (thisNode.parentNode.properties.parentunique!=0) var parameters={action:"load unlinked"};
	else var parameters={action:"load all"};
	loadcandidatesform.elements.parameters.value=JSON.stringify(parameters);
	loadcandidatesnode.loadfromhttp(loadcandidatesform,function() {
	  loadcandidatesnode.childContainer=myalert.getElementsByTagName("select")[0];
	  loadcandidatesnode.refreshChildrenView();
	  document.body.appendChild(myalert);
	  myalert.style.display="block";
	});
      });
      myform.elements.exit.onclick=function(){
	myalert.parentElement.removeChild(myalert);
      }
      return false;
    }
  '>
    <form action="dbrequesttbrecords.php" style="display:none">
      <input type="hidden" name="json" data-js='
	var myparentdata=new NodeFemale();
	myparentdata.loadasc(thisNode.parentNode, 1);
	thisElement.value=JSON.stringify(myparentdata);
      '/>
      <input type="hidden" name="parameters"/>
    </form>
    <img src="includes/css/images/penrel.png"/>
    <div class="alert" style="display:none">
      <p>The list of candidates is printed below</p>
      <form action="dbrequest.php">
	<select name="newid"></select>
	<input type="hidden" name="json" data-js='
	  var mydata=new NodeMale();
	  mydata.properties.id=thisNode.properties.id;
	  mydata.sort_order=thisNode.sort_order+1;
	  mydata.parentNode=new NodeFemale();
	  mydata.parentNode.loadasc(thisNode.parentNode, 1);
	  thisElement.value=JSON.stringify(mydata);
	'/>
	<input type="hidden" name="parameters" value='{"action":"replace myself"}'/>
	<table class="mytable" style="margin-top:11px;">
	  <tr>
	    <td>
	      <input type="button" value="Cancel" name="exit">
	    </td>
	    <td><input type="submit" value="Replace element"></td>
	  </tr>
	</table>
      </form>
    </div>
  </a>
</template>